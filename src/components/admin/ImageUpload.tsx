'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({ 
  currentUrl, 
  onUploadSuccess, 
  folder = 'uploads',
  label = 'Upload Image'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl || '');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPreview(data.url);
        onUploadSuccess(data.url);
        setError('');
      } else {
        setError(data.error || 'Upload failed');
        setPreview(currentUrl || '');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
      setPreview(currentUrl || '');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 bg-accent text-white rounded font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <span className="inline-block animate-spin mr-2">⏳</span>
            Uploading...
          </>
        ) : (
          <>📤 {label}</>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      {/* Image preview */}
      {preview && (
        <div className="border border-gray-300 rounded p-2 bg-gray-50">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 mx-auto rounded"
          />
          <p className="text-xs text-gray-600 mt-2 text-center break-all">
            {preview}
          </p>
        </div>
      )}

      {/* Help text */}
      <p className="text-xs text-gray-500">
        Max size: 5MB • Formats: JPG, PNG, GIF, WEBP
      </p>
    </div>
  );
}
