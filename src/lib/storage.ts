// Bunny.net Storage API Configuration
// Simpler and cheaper than S3, with built-in CDN

export interface UploadResult {
  url: string;
  key: string;
  success: boolean;
  error?: string;
}

/**
 * Upload a file to Bunny.net Storage
 * 
 * Benefits of Bunny.net:
 * - Simple API (just HTTP PUT request)
 * - Built-in CDN (fast global delivery)
 * - Cheaper than S3
 * - No complex IAM or bucket policies
 * - URLs never expire
 * - Automatic image optimization
 * 
 * @param file - File buffer
 * @param fileName - Original file name
 * @param folder - Folder in storage (e.g., 'blogs', 'work', 'capabilities')
 * @returns Upload result with CDN URL
 */
export async function uploadToStorage(
  file: Buffer,
  fileName: string,
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${timestamp}-${sanitizedFileName}`;

    // Bunny.net Storage API endpoint
    const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME!;
    const storagePassword = process.env.BUNNY_STORAGE_PASSWORD!;
    const storageRegion = process.env.BUNNY_STORAGE_REGION || 'sg'; // Default to Singapore
    
    // Construct upload URL
    const uploadUrl = `https://${storageRegion}.storage.bunnycdn.com/${storageZoneName}/${key}`;
    
    // Upload to Bunny.net using fetch
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': storagePassword,
        'Content-Type': getContentType(fileName),
      },
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Bunny upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Construct CDN URL (public, never expires)
    const cdnUrl = process.env.BUNNY_CDN_URL!;
    const url = `${cdnUrl}/${key}`;

    return {
      url,
      key,
      success: true,
    };
  } catch (error) {
    console.error('Bunny upload error:', error);
    return {
      url: '',
      key: '',
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete a file from Bunny.net Storage
 * @param key - File key/path to delete
 * @returns Success status
 */
export async function deleteFromStorage(key: string): Promise<boolean> {
  try {
    const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME!;
    const storagePassword = process.env.BUNNY_STORAGE_PASSWORD!;
    const storageRegion = process.env.BUNNY_STORAGE_REGION || 'sg';
    
    const deleteUrl = `https://${storageRegion}.storage.bunnycdn.com/${storageZoneName}/${key}`;
    
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'AccessKey': storagePassword,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Bunny delete error:', error);
    return false;
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
