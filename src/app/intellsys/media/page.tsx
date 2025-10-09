'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import ImageCropper to avoid SSR issues
const ImageCropper = dynamic(() => import('@/components/admin/ImageCropper'), { ssr: false });

interface MediaFile {
  ObjectName: string;
  Guid: string;
  StorageZoneName: string;
  Path: string;
  IsDirectory: boolean;
  Length: number;
  DateCreated: string;
  LastChanged: string;
  url: string | null;
  path: string;
}

export default function MediaManagerPage() {
  const router = useRouter();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [rootFolders, setRootFolders] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [renameFile, setRenameFile] = useState<MediaFile | null>(null);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    fetchFiles();
  }, [currentFolder]);

  useEffect(() => {
    // Fetch root folders on mount
    fetchRootFolders();
  }, []);

  const fetchRootFolders = async () => {
    try {
      const response = await fetch(`/api/intellsys/media?folder=`);
      const data = await response.json();
      const folders = data.filter((item: MediaFile) => item.IsDirectory);
      setRootFolders(folders);
    } catch (error) {
      console.error('Error fetching root folders:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      // Add cache-busting parameter
      const cacheBuster = Date.now();
      const response = await fetch(`/api/intellsys/media?folder=${currentFolder}&_t=${cacheBuster}`);
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type for video
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    // Validate file size (max 100MB for videos)
    if (file.size > 100 * 1024 * 1024) {
      alert('Video too large. Maximum size is 100MB.');
      return;
    }

    // Upload video directly
    try {
      setUploading(true);
      const sanitizedName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', currentFolder);
      formData.append('fileName', sanitizedName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('Video uploaded successfully!');
        fetchFiles();
        fetchRootFolders();
      } else {
        alert('Upload failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteFile = async (file: MediaFile) => {
    if (!confirm(`Are you sure you want to delete ${file.ObjectName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/intellsys/media?key=${encodeURIComponent(file.path)}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('File deleted successfully!');
        fetchFiles();
        setSelectedFile(null);
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  const toggleItemSelection = (path: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }
    setSelectedItems(newSelected);
  };

  const handleRenameFile = async () => {
    if (!renameFile || !newFileName.trim()) {
      alert('Please enter a valid filename');
      return;
    }

    try {
      setUploading(true);

      // Get file extension from original file
      const extension = renameFile.ObjectName.split('.').pop() || '';
      const sanitizedName = newFileName.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
      const finalFileName = extension ? `${sanitizedName}.${extension}` : sanitizedName;

      // Download the file from CDN
      const downloadResponse = await fetch(renameFile.url!);
      if (!downloadResponse.ok) {
        throw new Error('Failed to download file');
      }
      const fileBlob = await downloadResponse.blob();

      // Upload with new name
      const formData = new FormData();
      formData.append('file', fileBlob, finalFileName);
      formData.append('folder', currentFolder);
      formData.append('fileName', finalFileName);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (uploadResult.success) {
        // Delete old file
        await fetch(`/api/intellsys/media?key=${encodeURIComponent(renameFile.path)}`, {
          method: 'DELETE',
        });

        alert('File renamed successfully!');
        setRenameFile(null);
        setNewFileName('');
        fetchFiles();
        fetchRootFolders();
      } else {
        alert('Failed to rename file: ' + (uploadResult.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Rename error:', error);
      alert('Failed to rename file');
    } finally {
      setUploading(false);
    }
  };

  // Function to delete the folder itself (not just contents)
  const deleteFolderItself = async (folderPath: string): Promise<void> => {
    try {
      console.log(`Attempting to delete folder itself: ${folderPath}`);
      
      // Ensure folder path ends with /
      const normalizedPath = folderPath.endsWith('/') ? folderPath : folderPath + '/';
      
      const response = await fetch(`/api/intellsys/media?key=${encodeURIComponent(normalizedPath)}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        console.log(`Deleted folder itself: ${folderPath}`);
      } else {
        console.log(`Folder itself not found or already deleted: ${folderPath}`);
      }
    } catch (error) {
      console.error(`Error deleting folder itself ${folderPath}:`, error);
    }
  };

  // Recursive function to delete folder and all its contents
  const deleteFolderRecursive = async (folderPath: string): Promise<void> => {
    try {
      // Ensure folder path ends with /
      const normalizedPath = folderPath.endsWith('/') ? folderPath : folderPath + '/';
      
      // Get all contents of the folder
      const response = await fetch(`/api/intellsys/media?folder=${normalizedPath}`);
      const contents = await response.json();
      
      console.log(`Contents of ${normalizedPath}:`, contents.length, 'items');
      
      // Recursively delete subfolders first
      const subfolders = contents.filter((f: MediaFile) => f.IsDirectory);
      console.log(`Subfolders to delete:`, subfolders.map((f: MediaFile) => f.ObjectName));
      for (const subfolder of subfolders) {
        await deleteFolderRecursive(subfolder.path);
      }
      
      // Delete all files in this folder (including .keep files)
      const filesToDelete = contents.filter((f: MediaFile) => !f.IsDirectory);
      console.log(`Files to delete in ${normalizedPath}:`, filesToDelete.map((f: MediaFile) => f.ObjectName));
      
      // Also explicitly delete the .keep file if it exists
      const keepFilePath = normalizedPath + '.keep';
      console.log(`Checking for .keep file: ${keepFilePath}`);
      
      const deletePromises = filesToDelete.map((f: MediaFile) => {
        console.log(`Deleting file: ${f.path}`);
        return fetch(`/api/intellsys/media?key=${encodeURIComponent(f.path)}`, { method: 'DELETE' });
      });
      
      // Add .keep file deletion
      deletePromises.push(
        fetch(`/api/intellsys/media?key=${encodeURIComponent(keepFilePath)}`, { method: 'DELETE' })
          .then(response => {
            if (response.ok) {
              console.log(`Deleted .keep file: ${keepFilePath}`);
            } else if (response.status === 500) {
              // Check if it's a 404 wrapped in 500 (file not found)
              console.log(`.keep file not found or already deleted: ${keepFilePath}`);
            } else {
              console.log(`.keep file not found or already deleted: ${keepFilePath}`);
            }
            return response;
          })
      );
      
      const results = await Promise.all(deletePromises);
      
      // Check if all deletions were successful
      const failedDeletions = results.filter(r => !r.ok);
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} files in ${normalizedPath}`);
      }
      
      console.log(`✅ Deleted folder: ${folderPath}`);
    } catch (error) {
      console.error(`Error deleting folder ${folderPath}:`, error);
      throw error;
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      alert('Please select files or folders to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedItems.size} selected item(s)? This will permanently delete folders and all their contents.`)) {
      return;
    }

    try {
      // Separate files and folders
      const selectedPaths = Array.from(selectedItems);
      const selectedFiles = files.filter(f => selectedPaths.includes(f.path) && !f.IsDirectory);
      const selectedFolders = files.filter(f => selectedPaths.includes(f.path) && f.IsDirectory);
      
      console.log('Deleting folders:', selectedFolders.map(f => f.path));
      console.log('Deleting files:', selectedFiles.map(f => f.path));
      
      // Delete folders recursively
      for (const folder of selectedFolders) {
        await deleteFolderRecursive(folder.path);
        // Also try to delete the folder itself
        await deleteFolderItself(folder.path);
      }
      
      // Delete selected files
      const deletePromises = selectedFiles.map((file) => 
        fetch(`/api/intellsys/media?key=${encodeURIComponent(file.path)}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      
      alert(`${selectedItems.size} item(s) deleted successfully!`);
      setSelectedItems(new Set());
      setDeleteMode(false);
      
      // Force refresh with a small delay to ensure Bunny.net has processed the deletions
      setTimeout(() => {
        console.log('Refreshing file list after deletion...');
        // Force complete refresh by clearing state first
        setFiles([]);
        setRootFolders([]);
        // Then fetch fresh data
        fetchFiles();
        fetchRootFolders();
      }, 1000);
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Failed to delete some items. Check console for details.');
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopiedUrl(url);
          setTimeout(() => setCopiedUrl(null), 2000);
        } catch (err) {
          console.error('Fallback copy failed:', err);
          // Show the URL in a prompt as last resort
          prompt('Copy this URL:', url);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Copy failed:', err);
      // Show the URL in a prompt as last resort
      prompt('Copy this URL:', url);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name');
      return;
    }
    
    // Validate folder name
    const sanitized = newFolderName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    // Check if folder already exists in current directory
    if (directories.some(f => f.ObjectName === sanitized)) {
      alert('Folder already exists in this directory');
      return;
    }
    
    try {
      // Create folder by uploading a placeholder file
      // Folder path is currentFolder + newFolderName
      const folderPath = currentFolder + sanitized;
      const placeholderContent = 'This folder was created via Media Manager';
      
      const response = await fetch(`https://storage.bunnycdn.com/${process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME}/${folderPath}/.keep`, {
        method: 'PUT',
        headers: {
          'AccessKey': process.env.NEXT_PUBLIC_BUNNY_STORAGE_PASSWORD || '',
          'Content-Type': 'text/plain',
        },
        body: placeholderContent,
      });
      
      if (response.ok) {
        alert(`Folder "${sanitized}" created successfully!`);
        setNewFolderName('');
        setShowNewFolderInput(false);
        fetchFiles(); // Refresh current folder
        if (currentFolder === '') {
          fetchRootFolders(); // Refresh root folders if we're in root
        }
      } else {
        const errorText = await response.text();
        console.error('Create folder error:', errorText);
        alert('Failed to create folder. Please try again.');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    }
  };
  const imageFiles = files.filter(f => !f.IsDirectory && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.ObjectName));
  const videoFiles = files.filter(f => !f.IsDirectory && /\.(mp4|webm|ogg|mov|avi)$/i.test(f.ObjectName));
  const otherFiles = files.filter(f => !f.IsDirectory && !/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|ogg|mov|avi)$/i.test(f.ObjectName));
  const directories = files.filter(f => f.IsDirectory);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading files...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold txt-clr-black">Media Manager</h1>
            <p className="text-sm txt-clr-black mt-1">
              Manage your uploaded images and files
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {!deleteMode ? (
              <>
                <button
                  onClick={() => setShowCropper(true)}
                  disabled={uploading}
                  className="px-4 py-2 bg-primary txt-clr-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <label className="px-4 py-2 bg-blue-500 txt-clr-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                  {uploading ? 'Uploading...' : 'Upload Video'}
                  <input
                    type="file"
                    onChange={handleVideoUpload}
                    disabled={uploading}
                    className="hidden"
                    accept="video/*"
                  />
                </label>
                <button
                  onClick={() => setShowNewFolderInput(!showNewFolderInput)}
                  className="px-4 py-2 bg-green-500 txt-clr-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  New Folder
                </button>
                <button
                  onClick={() => {
                    console.log('Manual refresh triggered');
                    // Force complete refresh by clearing state first
                    setFiles([]);
                    setRootFolders([]);
                    // Then fetch fresh data
                    fetchFiles();
                    fetchRootFolders();
                  }}
                  className="px-4 py-2 bg-blue-500 txt-clr-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={() => {
                    setDeleteMode(true);
                    setSelectedItems(new Set());
                  }}
                  className="px-4 py-2 bg-red-500 txt-clr-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
                  Delete Mode: Select items to delete ({selectedItems.size} selected)
                </div>
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedItems.size === 0}
                  className="px-4 py-2 bg-red-500 txt-clr-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Delete Selected ({selectedItems.size})
                </button>
                <button
                  onClick={() => {
                    setDeleteMode(false);
                    setSelectedItems(new Set());
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* New Folder Input */}
        {showNewFolderInput && (
          <div className="bg-clr-white p-4 rounded-lg border">
            <div className="flex gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name (e.g., events, products)"
                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-primary"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewFolderInput(false);
                  setNewFolderName('');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Folder names will be sanitized (lowercase, alphanumeric, hyphens only)
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-clr-white p-4 rounded-lg border">
            <div className="text-2xl font-bold txt-clr-black">{imageFiles.length}</div>
            <div className="text-sm txt-clr-black">Images</div>
          </div>
          <div className="bg-clr-white p-4 rounded-lg border">
            <div className="text-2xl font-bold txt-clr-black">{videoFiles.length}</div>
            <div className="text-sm txt-clr-black">Videos</div>
          </div>
          <div className="bg-clr-white p-4 rounded-lg border">
            <div className="text-2xl font-bold txt-clr-black">{otherFiles.length}</div>
            <div className="text-sm txt-clr-black">Other Files</div>
          </div>
          <div className="bg-clr-white p-4 rounded-lg border">
            <div className="text-2xl font-bold txt-clr-black">
              {formatFileSize(files.reduce((acc, f) => acc + (f.Length || 0), 0))}
            </div>
            <div className="text-sm txt-clr-black">Total Size</div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="bg-clr-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Path:</span>
            <button
              onClick={() => setCurrentFolder('')}
              className="text-blue-600 hover:underline"
            >
              root
            </button>
            {currentFolder && currentFolder.split('/').filter(Boolean).map((part, index, arr) => {
              const path = arr.slice(0, index + 1).join('/') + '/';
              return (
                <span key={index} className="flex items-center gap-2">
                  <span className="text-gray-400">/</span>
                  <button
                    onClick={() => setCurrentFolder(path)}
                    className="text-blue-600 hover:underline"
                  >
                    {part}
                  </button>
                </span>
              );
            })}
          </div>
        </div>

        {/* Files Grid */}
        {imageFiles.length === 0 && videoFiles.length === 0 && otherFiles.length === 0 && directories.length === 0 ? (
          <div className="bg-clr-white p-12 rounded-lg border text-center">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-lg txt-clr-black mb-2">No files in this folder</p>
            <p className="text-sm txt-clr-neutral">Upload files to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Directories */}
            {directories.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold txt-clr-black mb-3">📁 Folders ({directories.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {directories.map((dir) => (
                    <div
                      key={dir.Guid}
                      className={`bg-clr-white rounded-lg border transition-colors text-center relative ${
                        deleteMode && selectedItems.has(dir.path) ? 'border-red-500 ring-2 ring-red-500' : 'hover:border-primary'
                      }`}
                    >
                      {deleteMode && (
                        <div className="absolute top-2 right-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(dir.path)}
                            onChange={() => toggleItemSelection(dir.path)}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => !deleteMode && setCurrentFolder(currentFolder + dir.ObjectName + '/')}
                        disabled={deleteMode}
                        className="w-full p-4 disabled:cursor-default"
                      >
                        <div className="text-4xl mb-2">📁</div>
                        <div className="text-sm txt-clr-black truncate">{dir.ObjectName}</div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {imageFiles.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold txt-clr-black mb-3">📷 Images ({imageFiles.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imageFiles.map((file) => (
                    <div
                      key={file.Guid}
                      className={`bg-clr-white rounded-lg border overflow-hidden transition-colors group relative ${
                        deleteMode && selectedItems.has(file.path) 
                          ? 'border-red-500 ring-2 ring-red-500' 
                          : selectedFile?.Guid === file.Guid 
                          ? 'border-primary ring-2 ring-primary' 
                          : 'hover:border-primary'
                      }`}
                    >
                      {deleteMode && (
                        <div className="absolute top-2 right-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(file.path)}
                            onChange={() => toggleItemSelection(file.path)}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>
                      )}
                      <div 
                        className="relative aspect-square bg-gray-100 cursor-pointer"
                        onClick={() => !deleteMode && setSelectedFile(file)}
                      >
                        <Image
                          src={file.url!}
                          alt={file.ObjectName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      </div>
                      <div className="p-2">
                        <div className="text-xs txt-clr-black truncate mb-1" title={file.ObjectName}>
                          {file.ObjectName}
                        </div>
                        <div className="text-xs txt-clr-neutral mb-2">{formatFileSize(file.Length)}</div>
                        {!deleteMode && (
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(file.url!);
                              }}
                              className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              {copiedUrl === file.url ? '✓' : '📋 URL'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(`![Image description](${file.url})`);
                              }}
                              className="flex-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                              {copiedUrl === `![Image description](${file.url})` ? '✓' : 'MD'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {videoFiles.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold txt-clr-black mb-3">🎬 Videos ({videoFiles.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {videoFiles.map((file) => (
                    <div
                      key={file.Guid}
                      className={`bg-clr-white rounded-lg border overflow-hidden transition-colors relative ${
                        deleteMode && selectedItems.has(file.path)
                          ? 'border-red-500 ring-2 ring-red-500'
                          : selectedFile?.Guid === file.Guid 
                          ? 'border-primary ring-2 ring-primary' 
                          : 'hover:border-primary'
                      }`}
                    >
                      {deleteMode && (
                        <div className="absolute top-2 right-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(file.path)}
                            onChange={() => toggleItemSelection(file.path)}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>
                      )}
                      <div 
                        className="relative aspect-video bg-gray-900 flex items-center justify-center cursor-pointer"
                        onClick={() => !deleteMode && setSelectedFile(file)}
                      >
                        <div className="text-white text-4xl">▶️</div>
                      </div>
                      <div className="p-2">
                        <div className="text-xs txt-clr-black truncate mb-1" title={file.ObjectName}>
                          {file.ObjectName}
                        </div>
                        <div className="text-xs txt-clr-neutral mb-2">{formatFileSize(file.Length)}</div>
                        {!deleteMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(file.url!);
                            }}
                            className="w-full px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            {copiedUrl === file.url ? '✓ Copied!' : '📋 Copy URL'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Files */}
            {otherFiles.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold txt-clr-black mb-3">📄 Other Files ({otherFiles.length})</h2>
                <div className="bg-clr-white rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherFiles.map((file) => (
                        <tr key={file.Guid} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{file.ObjectName}</td>
                          <td className="px-4 py-3 text-sm">{formatFileSize(file.Length)}</td>
                          <td className="px-4 py-3 text-sm">{formatDate(file.DateCreated)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedFile(file)}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Details Modal */}
        {selectedFile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">File Details</h2>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Image Preview */}
                {selectedFile.url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(selectedFile.ObjectName) && (
                  <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={selectedFile.url}
                      alt={selectedFile.ObjectName}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}

                {/* Video Preview */}
                {selectedFile.url && /\.(mp4|webm|ogg|mov)$/i.test(selectedFile.ObjectName) && (
                  <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      src={selectedFile.url}
                      controls
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* File Info */}
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Name:</span> {selectedFile.ObjectName}
                  </div>
                  <div>
                    <span className="font-semibold">Size:</span> {formatFileSize(selectedFile.Length)}
                  </div>
                  <div>
                    <span className="font-semibold">Uploaded:</span> {formatDate(selectedFile.DateCreated)}
                  </div>
                  <div>
                    <span className="font-semibold">Path:</span> {selectedFile.path}
                  </div>
                </div>

                {/* URL Copy */}
                {selectedFile.url && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">CDN URL:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selectedFile.url}
                        readOnly
                        className="flex-1 px-3 py-2 border rounded text-sm bg-gray-50"
                      />
                      <button
                        onClick={() => copyToClipboard(selectedFile.url!)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      >
                        {copiedUrl === selectedFile.url ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Markdown Copy */}
                {selectedFile.url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(selectedFile.ObjectName) && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Markdown (for blogs):</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={`![Image description](${selectedFile.url})`}
                        readOnly
                        className="flex-1 px-3 py-2 border rounded text-sm bg-gray-50 font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(`![Image description](${selectedFile.url})`)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                      >
                        {copiedUrl === `![Image description](${selectedFile.url})` ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedFile.url && (
                    <a
                      href={selectedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      🔗 Open in New Tab
                    </a>
                  )}
                  <button
                    onClick={() => {
                      const nameWithoutExt = selectedFile.ObjectName.replace(/\.[^/.]+$/, '');
                      setNewFileName(nameWithoutExt);
                      setRenameFile(selectedFile);
                      setSelectedFile(null);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleDeleteFile(selectedFile)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Cropper Modal */}
        {showCropper && (
          <ImageCropper
            currentFolder={currentFolder}
            onCropComplete={(blob, url) => {
              setShowCropper(false);
              alert('Image cropped and uploaded successfully!');
              fetchFiles(); // Refresh file list
            }}
            onCancel={() => setShowCropper(false)}
          />
        )}

        {/* Rename Modal */}
        {renameFile && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold txt-clr-black mb-4">Rename File</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current name: <span className="font-normal">{renameFile.ObjectName}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter new filename"
                      autoFocus
                    />
                    <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600">
                      .{renameFile.ObjectName.split('.').pop()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Extension (.{renameFile.ObjectName.split('.').pop()}) is automatically preserved
                  </p>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t">
                  <button
                    onClick={() => {
                      setRenameFile(null);
                      setNewFileName('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRenameFile}
                    disabled={uploading || !newFileName.trim()}
                    className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Renaming...' : 'Rename'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
