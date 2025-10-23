import { NextResponse } from 'next/server';
import { uploadToStorage } from '@/lib/storage';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    const customFileName = formData.get('fileName') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (images and videos)
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);
    
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPG, PNG, GIF, WEBP) and videos (MP4, WEBM, OGG, MOV) are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (25MB for images, 100MB for videos)
    const maxSize = isVideo ? 100 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${isVideo ? '100MB for videos' : '25MB for images'}.` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // Compress images to target 500KB
    if (isImage) {
      try {
        const targetSizeKB = 500;
        const targetSizeBytes = targetSizeKB * 1024;

        // Get original image metadata
        const metadata = await sharp(buffer).metadata();
        const hasAlpha = metadata.hasAlpha;
        
        // Resize to max 2400px width (covers 4K displays)
        let quality = 85; // Start with 85% quality
        let compressed;
        
        if (hasAlpha) {
          // For transparent images, use PNG to preserve transparency
          compressed = await sharp(buffer)
            .resize(2400, null, { 
              withoutEnlargement: true,
              fit: 'inside'
            })
            .png({ 
              quality,
              compressionLevel: 6,
              adaptiveFiltering: true
            })
            .toBuffer();
        } else {
          // For non-transparent images, use WebP
          compressed = await sharp(buffer)
            .resize(2400, null, { 
              withoutEnlargement: true,
              fit: 'inside'
            })
            .webp({ 
              quality,
              lossless: false,
              nearLossless: false,
              smartSubsample: true,
              effort: 4
            })
            .toBuffer();
        }

        // If still too large, reduce quality iteratively
        let attempts = 0;
        while (compressed.length > targetSizeBytes && quality > 60 && attempts < 5) {
          quality -= 5;
          
          if (hasAlpha) {
            // For transparent images, use PNG
            compressed = await sharp(buffer)
              .resize(2400, null, { 
                withoutEnlargement: true,
                fit: 'inside'
              })
              .png({ 
                quality,
                compressionLevel: 6,
                adaptiveFiltering: true
              })
              .toBuffer();
          } else {
            // For non-transparent images, use WebP
            compressed = await sharp(buffer)
              .resize(2400, null, { 
                withoutEnlargement: true,
                fit: 'inside'
              })
              .webp({ 
                quality,
                lossless: false,
                nearLossless: false,
                smartSubsample: true,
                effort: 4
              })
              .toBuffer();
          }
          attempts++;
        }

        buffer = Buffer.from(compressed);
        
        // Update filename - use PNG for transparent images, WebP for others
        const fileNameWithoutExt = (customFileName || file.name).replace(/\.[^/.]+$/, '');
        const finalFileName = hasAlpha ? `${fileNameWithoutExt}.png` : `${fileNameWithoutExt}.webp`;
        
        console.log(`Image compressed: Original ${(bytes.byteLength / 1024).toFixed(0)}KB -> Final ${(buffer.length / 1024).toFixed(0)}KB at ${quality}% quality`);
        
        // Upload compressed image
        const result = await uploadToStorage(buffer, finalFileName, folder);

        if (!result.success) {
          return NextResponse.json(
            { error: result.error || 'Upload failed' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          url: result.url,
          key: result.key,
          originalSize: `${(bytes.byteLength / 1024).toFixed(0)}KB`,
          compressedSize: `${(buffer.length / 1024).toFixed(0)}KB`,
          quality: `${quality}%`
        });

      } catch (compressionError) {
        console.error('Compression error:', compressionError);
        return NextResponse.json(
          { error: 'Failed to compress image' },
          { status: 500 }
        );
      }
    }

    // For videos, upload without compression
    if (isVideo) {
      const fileName = customFileName || file.name;
      const result = await uploadToStorage(buffer, fileName, folder);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Upload failed' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        url: result.url,
        key: result.key,
        size: `${(buffer.length / 1024 / 1024).toFixed(1)}MB`
      });
    }

    // Fallback (shouldn't reach here)
    return NextResponse.json(
      { error: 'Unknown file type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
