'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import FileUpload from '@/components/FileUpload';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Calendar,
  MapPin,
  Camera,
  Image as ImageIcon,
  Download,
  Tag
} from 'lucide-react';

export default function AddGalleryImage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    src: '',
    thumbnail: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    photographer: '',
    tags: [''],
    downloadUrl: ''
  });

  const galleryCategories = [
    "Energy Projects",
    "Events", 
    "Research",
    "Training",
    "Technology",
    "Community",
    "Awards",
    "Conservation",
    "Agriculture",
    "Policy",
    "Partnerships",
    "Expansion"
  ];

  // Helper functions for array management
  const addArrayItem = (arrayName, template = '') => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleArrayChange = (arrayName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean up arrays
      const cleanTags = formData.tags.filter(tag => tag.trim() !== '');
      
      const submitData = {
        ...formData,
        tags: cleanTags,
        id: Date.now() // Simulate ID generation
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Creating gallery image:', submitData);
      router.push('/admin/gallery');
    } catch (error) {
      console.error('Error creating gallery image:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  Add New Image
                </h1>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Image Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter image title"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what's happening in this image"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {galleryCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, Country"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Camera className="w-4 h-4 inline mr-1" />
                    Photographer *
                  </label>
                  <input
                    type="text"
                    value={formData.photographer}
                    onChange={(e) => handleInputChange('photographer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Photographer name or team"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image URLs */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Image Files</h3>
              <div className="grid grid-cols-1 gap-6">
                <FileUpload
                  label="Full Size Image"
                  uploadType="image"
                  value={formData.src}
                  onChange={(value) => handleInputChange('src', value)}
                  placeholder="https://example.com/image-full.jpg"
                  required
                />

                <FileUpload
                  label="Thumbnail Image"
                  uploadType="image"
                  value={formData.thumbnail}
                  onChange={(value) => handleInputChange('thumbnail', value)}
                  placeholder="https://example.com/thumbnail.jpg"
                  required
                />

                <FileUpload
                  label="Download Version"
                  uploadType="image"
                  value={formData.downloadUrl}
                  onChange={(value) => handleInputChange('downloadUrl', value)}
                  placeholder="https://example.com/download.jpg"
                  required
                />
              </div>
            </div>

            {/* Tags */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('tags')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Tag
                </button>
              </div>
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tag keyword"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.tags.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            {formData.thumbnail && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                  <div className="max-w-sm mx-auto">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={formData.thumbnail}
                        alt={formData.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {formData.title || 'Image Title'}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {formData.description || 'Image description will appear here...'}
                      </p>
                      <div className="space-y-1 text-xs text-gray-500">
                        {formData.category && <div>{formData.category}</div>}
                        <div className="flex items-center justify-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formData.date ? new Date(formData.date).toLocaleDateString() : 'Date'}
                        </div>
                        <div className="flex items-center justify-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {formData.location || 'Location'}
                        </div>
                        <div className="flex items-center justify-center">
                          <Camera className="w-3 h-3 mr-1" />
                          {formData.photographer || 'Photographer'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="border-t pt-6">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
