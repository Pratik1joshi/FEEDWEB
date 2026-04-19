'use client';

import { useState, useRef } from 'react';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { uploadApi } from '@/lib/api-services';

const MultipleImageUpload = ({ 
  label = "Images", 
  images = [], 
  onChange, 
  maxImages = 10,
  required = false 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setUploading(true);
    const uploadPromises = filesToUpload.map(async (file) => {
      try {
        const result = await uploadApi.single(file);
        return result?.success ? (result?.data?.url || result?.url || null) : null;
      } catch (error) {
        console.error('Upload failed:', error);
        return null;
      }
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null);
      
      if (validUrls.length > 0) {
        onChange([...images, ...validUrls]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Some uploads failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index, imageUrl) => {
    // Delete from server if it's an uploaded file
    if (imageUrl.startsWith('/uploads/')) {
      try {
        const filename = imageUrl.split('/').pop();
        await uploadApi.delete(filename);
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
    
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          <ImageIcon className="w-4 h-4 inline mr-1" />
          {label} {required && <span className="text-red-500">*</span>}
          <span className="text-gray-500 text-xs ml-2">({images.length}/{maxImages})</span>
        </label>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border shadow-sm"
              onError={(e) => e.target.style.display = 'none'}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index, image)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Add New Image Button */}
        {images.length < maxImages && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              dragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {uploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-xs text-gray-600">Uploading...</p>
              </div>
            ) : (
              <div className="text-center">
                <Plus className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-xs text-gray-600">Add Image</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Drag and drop images here, or click the + button to browse. 
        Supports JPG, PNG, GIF up to 10MB each.
      </p>
    </div>
  );
};

export default MultipleImageUpload;
