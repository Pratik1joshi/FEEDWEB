'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../../components/AdminLayout';
import FileUpload from '../../../../components/FileUpload';
import BasicRichTextEditor from '../../../../components/rich-text-editor/BasicRichTextEditor';
import { servicesApi } from '../../../../src/lib/api-services';
import { serviceIcons } from '../../../../src/data/services';
import { 
  ArrowLeft, 
  Save, 
  FileText,
  Hash,
  Type,
  Building,
  Zap,
  Cpu,
  Leaf,
  Users,
  Target,
  Globe,
  TrendingUp,
  Star,
  Lightbulb,
  Heart,
  Shield,
  Settings,
  BookOpen,
  Image,
  Plus,
  X
} from 'lucide-react';

const iconComponents = {
  Building, Zap, Cpu, Leaf, FileText, Users, Target, Globe, TrendingUp, Star, Lightbulb, Heart, Shield, Settings, BookOpen
};

export default function AddService() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    long_description: '',
    icon: 'Building',
    image: '',
    features: []
  });

  const [newFeature, setNewFeature] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const generateId = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title) => {
    handleInputChange('title', title);
    if (!formData.id || formData.id === generateId(formData.title)) {
      handleInputChange('id', generateId(title));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = {
        title: formData.title,
        slug: formData.id,
        description: formData.description,
        long_description: formData.long_description,
        icon: formData.icon,
        image: formData.image,
        features: formData.features,
        status: 'active',
        featured: false,
        sort_order: 0
      };

      const response = await servicesApi.create(submitData);
      
      if (response.success) {
        console.log('Service created successfully:', response.data);
        router.push('/admin/services');
      } else {
        throw new Error(response.message || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
    } finally {
      setSaving(false);
    }
  };

  const SelectedIcon = iconComponents[formData.icon];

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
                  Add New Service
                </h1>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Type className="w-4 h-4 inline mr-1" />
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter service title"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Service ID *
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="service-id-slug"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    URL-friendly identifier (auto-generated from title)
                  </p>
                </div>

                <div className="md:col-span-2">
                  <BasicRichTextEditor
                    label="✨ Short Service Description *"
                    value={formData.description}
                    onChange={(value) => handleInputChange('description', value)}
                    placeholder="Write a compelling brief description of your service (shown in service cards)..."
                    height="150px"
                  />
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="border-t pt-6">
              <BasicRichTextEditor
                label="📄 Comprehensive Service Description"
                value={formData.long_description}
                onChange={(value) => handleInputChange('long_description', value)}
                placeholder="Provide a detailed, formatted description of your service with images, lists, and rich content. This will be shown on the service detail page..."
                height="500px"
              />
              <p className="mt-2 text-sm text-gray-500">
                💡 Use the rich formatting tools to create an engaging service description with headings, lists, images, and more!
              </p>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Service Features</h3>
              
              {/* Add new feature */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Feature
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a service feature"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>

              {/* Features list */}
              {formData.features.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Features ({formData.features.length})
                  </label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Images */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FileUpload
                    label="Service Image"
                    uploadType="image"
                    value={formData.image}
                    onChange={(url) => handleInputChange('image', url)}
                    placeholder="Upload or enter image URL"
                  />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This image will be used for both the service card and the service detail page header.
              </p>
            </div>

            {/* Icon Selection */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Icon</h3>
              <div className="grid grid-cols-5 gap-3">
                {serviceIcons.map((iconOption) => {
                  const IconComp = iconComponents[iconOption.name]
                  return (
                    <button
                      key={iconOption.name}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon: iconOption.name }))}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                        formData.icon === iconOption.name
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComp className="w-6 h-6 mb-1" />
                      <span className="text-xs text-center">{iconOption.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Preview */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                      <SelectedIcon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {formData.title || 'Service Title'}
                  </h4>
                  <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                    {formData.description || 'Service description will appear here...'}
                  </p>
                  
                  {formData.features.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Features:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {formData.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                        {formData.features.length > 3 && (
                          <li>... and {formData.features.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {formData.image && (
                    <div className="mt-4">
                      <img 
                        src={formData.image} 
                        alt="Service preview"
                        className="w-24 h-16 object-cover rounded mx-auto"
                      />
                    </div>
                  )}
                  
                  {formData.id && (
                    <p className="text-sm text-gray-400 mt-2">ID: {formData.id}</p>
                  )}
                </div>
              </div>
            </div>

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
                      Create Service
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
