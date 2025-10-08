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
    
    // Construct upload URL (use main endpoint, not regional)
    const uploadUrl = `https://storage.bunnycdn.com/${storageZoneName}/${key}`;
    
    // Upload to Bunny.net using fetch
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': storagePassword,
        'Content-Type': getContentType(fileName),
      },
      body: file as any, // Buffer is compatible with fetch body
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
 * List files in Bunny.net Storage
 * @param path - Path/folder to list (e.g., 'blogs/', 'test/')
 * @returns Array of files with metadata
 */
export async function listStorageFiles(path: string = ''): Promise<any[]> {
  try {
    const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME!;
    const storagePassword = process.env.BUNNY_STORAGE_PASSWORD!;
    
    const listUrl = `https://storage.bunnycdn.com/${storageZoneName}/${path}`;
    
    const response = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'AccessKey': storagePassword,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.status} ${response.statusText}`);
    }

    const files = await response.json();
    return files || [];
  } catch (error) {
    console.error('Bunny list error:', error);
    return [];
  }
}

/**
 * Delete a file from Bunny.net Storage
 * @param key - File key/path to delete
 * @returns Success status
 */
export async function deleteFromStorage(key: string): Promise<boolean> {
  console.log('=== DELETE FROM STORAGE CALLED ===');
  try {
    const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME!;
    const storagePassword = process.env.BUNNY_STORAGE_PASSWORD!;
    
    console.log('Delete request details:');
    console.log('- Storage Zone:', storageZoneName);
    console.log('- Key:', key);
    console.log('- Password length:', storagePassword?.length || 0);
    
    if (!storageZoneName || !storagePassword) {
      console.error('❌ Missing environment variables!');
      console.error('- BUNNY_STORAGE_ZONE_NAME:', !!storageZoneName);
      console.error('- BUNNY_STORAGE_PASSWORD:', !!storagePassword);
      return false;
    }
    
    const deleteUrl = `https://storage.bunnycdn.com/${storageZoneName}/${key}`;
    console.log('- Delete URL:', deleteUrl);
    
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'AccessKey': storagePassword,
      },
    });

    console.log('- Response status:', response.status);
    console.log('- Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('- Error response:', errorText);
      
      // 404 means file doesn't exist, which is fine for deletion
      if (response.status === 404) {
        console.log('- File not found (404), treating as successful deletion');
        return true;
      }
    }

    return response.ok;
  } catch (error) {
    console.error('=== ERROR IN DELETE FROM STORAGE ===');
    console.error('Bunny delete error:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return false;
  }
}

/**
 * Get MIME type based on file extension
 */
function getContentType(fileName: string): string {
  const ext = fileName.toLowerCase().split('.').pop();
  
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    // Videos
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
  };

  return mimeTypes[ext || ''] || 'application/octet-stream';
}
