'use client';

import { useState, useRef } from 'react';
import { Upload, X, Link, Image, Video, FileText } from 'lucide-react';
import { uploadApi } from '@/lib/api-services';

const FileUpload = ({ 
  label, 
  accept = "*/*", 
  value = "", 
  onChange, 
  placeholder = "",
  required = false,
  icon,
  multiple = false,
  uploadType = "any" // "image", "video", "document", "any"
}) => {
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Get appropriate icon based on type
  const getIcon = () => {
    if (icon) return icon;
    switch (uploadType) {
      case 'image': return Image;
      case 'video': return Video;
      case 'document': return FileText;
      default: return Upload;
    }
  };

  const IconComponent = getIcon();

  // Get file type restrictions
  const getAcceptTypes = () => {
    switch (uploadType) {
      case 'image': return 'image/*';
      case 'video': return 'video/*';
      case 'document': return '.pdf,.doc,.docx,.txt';
      default: return accept;
    }
  };

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];

      const result = await uploadApi.single(file);
      const uploadedUrl = result?.data?.url || result?.url;

      if (result?.success && uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveFile = async (fileUrl) => {
    if (fileUrl.startsWith('/uploads/')) {
      try {
        const filename = fileUrl.split('/').pop();
        await uploadApi.delete(filename);
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
    onChange('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        <IconComponent className="w-4 h-4 inline mr-1" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Method Toggle */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`px-3 py-1 rounded-md text-sm transition-all ${
            uploadMethod === 'url' 
              ? 'bg-white shadow-sm text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Link className="w-4 h-4 inline mr-1" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`px-3 py-1 rounded-md text-sm transition-all ${
            uploadMethod === 'file' 
              ? 'bg-white shadow-sm text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-1" />
          Upload
        </button>
      </div>

      {/* URL Input */}
      {uploadMethod === 'url' && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          required={required}
        />
      )}

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div>
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              dragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {uploading ? (
              <div className="space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <IconComponent className="w-8 h-8 text-gray-400 mx-auto" />
                <div className="text-sm text-gray-600">
                  <p>Drop files here or <span className="text-blue-600 font-medium">browse</span></p>
                  <p className="text-xs text-gray-500 mt-1">
                    {uploadType === 'image' && 'PNG, JPG, GIF up to 10MB'}
                    {uploadType === 'video' && 'MP4, AVI, MOV up to 100MB'}
                    {uploadType === 'document' && 'PDF, DOC, DOCX, TXT up to 10MB'}
                    {uploadType === 'any' && 'Any file type'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptTypes()}
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {/* Current File URL Display */}
          {value && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate">
                    {value}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(value)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview for images/videos */}
      {value && (
        <div className="mt-3">
          {(uploadType === 'image' || value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) && (
            <div className="relative inline-block">
              <img
                src={value}
                alt="Preview"
                className="max-w-xs h-32 object-cover rounded-md border shadow-sm"
                onError={(e) => e.target.style.display = 'none'}
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(value)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {uploadType === 'video' && value.match(/\.(mp4|avi|mov|webm)$/i) && (
            <div className="relative inline-block">
              <video
                src={value}
                className="max-w-xs h-32 object-cover rounded-md border shadow-sm"
                controls
                onError={(e) => e.target.style.display = 'none'}
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(value)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
