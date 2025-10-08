import { NextRequest, NextResponse } from 'next/server';
import { listStorageFiles, deleteFromStorage } from '@/lib/storage';

console.log('=== MEDIA API ROUTE LOADED ===');
console.log('Environment check:');
console.log('- BUNNY_STORAGE_ZONE_NAME:', process.env.BUNNY_STORAGE_ZONE_NAME ? 'SET' : 'NOT SET');
console.log('- BUNNY_STORAGE_PASSWORD:', process.env.BUNNY_STORAGE_PASSWORD ? 'SET' : 'NOT SET');

// GET - List all files in storage
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';

    const files = await listStorageFiles(folder);
    
    // Transform the response to include CDN URLs
    const cdnUrl = process.env.BUNNY_CDN_URL!;
    const filesWithUrls = files.map((file: any) => ({
      ...file,
      url: file.IsDirectory ? null : `${cdnUrl}/${folder}${file.ObjectName}`,
      path: `${folder}${file.ObjectName}`,
    }));

    const response = NextResponse.json(filesWithUrls);
    // Prevent caching to ensure fresh data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}

// DELETE - Delete a file
export async function DELETE(request: NextRequest) {
  console.log('=== DELETE API ROUTE CALLED ===');
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    console.log('DELETE request received for key:', key);
    console.log('Request URL:', request.url);

    if (!key) {
      console.log('No key provided in DELETE request');
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    console.log('Attempting to delete file:', key);
    const success = await deleteFromStorage(key);
    console.log('Delete result:', success);

    if (success) {
      console.log('✅ File deleted successfully:', key);
      return NextResponse.json({ success: true, message: 'File deleted successfully' });
    } else {
      console.log('❌ Failed to delete file:', key);
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
  } catch (error) {
    console.error('=== ERROR IN DELETE API ROUTE ===');
    console.error('Error deleting file:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      error: 'Failed to delete file', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
