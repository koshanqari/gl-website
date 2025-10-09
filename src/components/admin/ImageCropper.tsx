'use client';

import { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  onCropComplete: (croppedImageBlob: Blob, croppedImageUrl: string) => void;
  onCancel: () => void;
  currentFolder?: string;
}

export default function ImageCropper({ onCropComplete, onCancel, currentFolder = '' }: ImageCropperProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 60,
    x: 10,
    y: 10,
  });
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [originalExtension, setOriginalExtension] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 25MB for cropping)
    if (file.size > 25 * 1024 * 1024) {
      alert('Image too large. Maximum size is 25MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      // Extract filename and extension
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      const extension = file.name.split('.').pop() || 'jpg';
      const sanitizedName = nameWithoutExt.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
      setFileName(sanitizedName);
      setOriginalExtension(extension);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async (): Promise<{ blob: Blob; url: string } | null> => {
    if (!completedCrop || !imgRef.current) return null;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const url = URL.createObjectURL(blob);
          resolve({ blob, url });
        },
        'image/jpeg',
        0.95
      );
    });
  };

  const handleCropAndUpload = async () => {
    if (!completedCrop) {
      alert('Please select a crop area');
      return;
    }

    setUploading(true);

    try {
      const croppedImage = await getCroppedImg();
      
      if (!croppedImage) {
        alert('Failed to crop image');
        return;
      }

      // Upload cropped image
      const formData = new FormData();
      const finalFileName = `${fileName}.${originalExtension}`;
      formData.append('file', croppedImage.blob, finalFileName);
      formData.append('folder', currentFolder);
      formData.append('fileName', finalFileName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Show compression stats if available
        if (result.originalSize && result.compressedSize) {
          console.log(`✅ Image uploaded: ${result.originalSize} → ${result.compressedSize} (${result.quality})`);
        }
        onCropComplete(croppedImage.blob, result.url);
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Crop and upload error:', error);
      alert('Failed to crop and upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Crop & Upload Image</h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* File Selection */}
          {!imageSrc && (
            <div className="text-center py-12">
              <p className="text-lg mb-4">Select an image to crop</p>
              <label className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark cursor-pointer inline-block">
                Choose Image
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-4">Max size: 10MB • Formats: JPG, PNG, GIF, WEBP</p>
            </div>
          )}

          {/* Crop Area */}
          {imageSrc && (
            <div className="space-y-4">
              <div className="flex justify-center bg-gray-100 p-4 rounded-lg">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop preview"
                    style={{ maxHeight: '60vh', maxWidth: '100%' }}
                  />
                </ReactCrop>
              </div>

              {/* Preset Aspect Ratios */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Quick Ratios:</span>
                <button
                  onClick={() => setAspect(undefined)}
                  className={`px-3 py-1 text-sm rounded ${aspect === undefined ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Free
                </button>
                <button
                  onClick={() => setAspect(16 / 9)}
                  className={`px-3 py-1 text-sm rounded ${aspect === 16 / 9 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  16:9
                </button>
                <button
                  onClick={() => setAspect(4 / 3)}
                  className={`px-3 py-1 text-sm rounded ${aspect === 4 / 3 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  4:3
                </button>
                <button
                  onClick={() => setAspect(1)}
                  className={`px-3 py-1 text-sm rounded ${aspect === 1 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  1:1 (Square)
                </button>
                <button
                  onClick={() => setAspect(3 / 4)}
                  className={`px-3 py-1 text-sm rounded ${aspect === 3 / 4 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  3:4 (Portrait)
                </button>
              </div>

              {/* File Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">File Name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter file name"
                  />
                  <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600">
                    .{originalExtension}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Extension (.{originalExtension}) is automatically preserved
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <button
                  onClick={() => {
                    setImageSrc('');
                    setCrop({ unit: '%', width: 80, height: 60, x: 10, y: 10 });
                    setCompletedCrop(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Choose Different Image
                </button>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropAndUpload}
                  disabled={uploading || !completedCrop}
                  className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Crop & Upload'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
