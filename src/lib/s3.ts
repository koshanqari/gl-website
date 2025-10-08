// AWS S3 Client Configuration
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Create S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface UploadResult {
  url: string;
  key: string;
  success: boolean;
  error?: string;
}

/**
 * Upload a file to S3
 * @param file - File buffer
 * @param fileName - Original file name
 * @param folder - Folder in S3 bucket (e.g., 'blogs', 'work', 'capabilities')
 * @returns Upload result with public URL
 */
export async function uploadToS3(
  file: Buffer,
  fileName: string,
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${timestamp}-${sanitizedFileName}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: file,
      ContentType: getContentType(fileName),
      ACL: 'public-read', // Make images publicly accessible
    });

    await s3Client.send(command);

    // Construct public URL
    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return {
      url,
      key,
      success: true,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    return {
      url: '',
      key: '',
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Get MIME type based on file extension
 */
function getContentType(fileName: string): string {
  const ext = fileName.toLowerCase().split('.').pop();
  
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };

  return mimeTypes[ext || ''] || 'application/octet-stream';
}

export default s3Client;
