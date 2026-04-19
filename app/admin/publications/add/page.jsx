'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../../components/AdminLayout';
import FileUpload from '../../../../components/FileUpload';
import BasicRichTextEditor from '../../../../components/rich-text-editor/BasicRichTextEditor';
import { publicationsApi } from '../../../../lib/api-services';
import { PUBLICATION_FORM_INITIAL_STATE, PUBLICATION_TYPES, CATEGORY_OPTIONS, LANGUAGE_OPTIONS, validatePublicationForm, cleanPublicationData } from '../../../../lib/publication-form-config';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  BookOpen,
  Calendar,
  Tag,
  Download,
  AlertCircle
} from 'lucide-react';

export default function AddPublication() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState(PUBLICATION_FORM_INITIAL_STATE);

  const publicationTypes = PUBLICATION_TYPES;
  const categories = CATEGORY_OPTIONS;
  const languages = LANGUAGE_OPTIONS;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate slug from title
    if (field === 'title' && value) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    const validation = validatePublicationForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setErrors({});
    setSaving(true);

    try {
      const finalData = cleanPublicationData(formData);
      await publicationsApi.create(finalData);
      router.push('/admin/publications');
    } catch (error) {
      console.error('Error adding publication:', error);
      setErrors({ submit: error.message || 'Failed to create publication. Please try again.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Add Publication">
      <div className="max-w-4xl mx-auto">
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.back()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  Add New Publication
                </h1>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter publication title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter publication subtitle"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Type</option>
                      {publicationTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
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
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Publication Date *
                    </label>
                    <input
                      type="date"
                      value={formData.publication_date}
                      onChange={(e) => handleInputChange('publication_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pages
                    </label>
                    <input
                      type="number"
                      value={formData.pages}
                      onChange={(e) => handleInputChange('pages', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DOI
                    </label>
                    <input
                      type="text"
                      value={formData.doi}
                      onChange={(e) => handleInputChange('doi', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10.1234/example.2024.001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug (auto-generated)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholder="url-friendly-slug"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Featured Publication
                  </label>
                </div>
              </div>
            </div>

            {/* Authors */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Authors</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('authors')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Author
                </button>
              </div>
              <div className="space-y-3">
                {formData.authors.map((author, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => handleArrayChange('authors', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Author name"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('authors', index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.authors.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="border-t pt-6">
              <div className="space-y-6">
                <div>
                  <BasicRichTextEditor
                    label="📋 Publication Abstract *"
                    value={formData.abstract}
                    onChange={(value) => handleInputChange('abstract', value)}
                    placeholder="Write a compelling abstract that summarizes your publication..."
                    height="200px"
                  />
                </div>

                <div>
                  <BasicRichTextEditor
                    label="📖 Publication Description"
                    value={formData.description}
                    onChange={(value) => handleInputChange('description', value)}
                    placeholder="Provide a detailed description of your publication..."
                    height="300px"
                  />
                </div>

                <div>
                  <BasicRichTextEditor
                    label="📄 Full Publication Content"
                    value={formData.full_content}
                    onChange={(value) => handleInputChange('full_content', value)}
                    placeholder="Enter the complete publication content with rich formatting, images, and styling..."
                    height="600px"
                  />
                </div>
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

            {/* URLs and Media */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">URLs and Media</h3>
              <div className="space-y-6">
                <FileUpload
                  label="Publication Document"
                  uploadType="document"
                  value={formData.download_url}
                  onChange={(value) => handleInputChange('download_url', value)}
                  placeholder="https://example.com/publication.pdf"
                  icon={Download}
                />

                <FileUpload
                  label="Cover Image"
                  uploadType="image"
                  value={formData.image_url}
                  onChange={(value) => handleInputChange('image_url', value)}
                  placeholder="https://example.com/cover-image.jpg"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Citations
                  </label>
                  <input
                    type="number"
                    value={formData.citations}
                    onChange={(e) => handleInputChange('citations', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Downloads
                  </label>
                  <input
                    type="number"
                    value={formData.downloads}
                    onChange={(e) => handleInputChange('downloads', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                  />
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
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Publication
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

