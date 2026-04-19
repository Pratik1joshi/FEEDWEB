'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import BasicRichTextEditor from '@/components/rich-text-editor/BasicRichTextEditor';
import { Save, ArrowLeft, Calendar, FileText, BookOpen } from 'lucide-react';

export default function EditPublication() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'Research Report',
    category: 'Research',
    date: '',
    authors: [],
    abstract: '',
    description: '',
    downloadUrl: '',
    image: '',
    tags: [],
    pages: 0,
    language: 'English',
    doi: '',
    featured: false,
    slug: ''
  });

  const publicationTypes = [
    'Research Report',
    'Policy Brief', 
    'White Paper',
    'Case Study',
    'Working Paper',
    'Technical Note',
    'Annual Report'
  ];

  const categories = [
    'Research',
    'Policy',
    'Technology',
    'Finance',
    'Environment',
    'Energy',
    'Social Impact'
  ];

  useEffect(() => {
    const loadPublication = async () => {
      try {
        const response = await fetch(`/api/publications/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          const publication = data.data;
          setFormData({
            title: publication.title || '',
            subtitle: publication.subtitle || '',
            type: publication.type || 'Research Report',
            category: publication.category || 'Research',
            date: publication.date?.split('T')[0] || publication.publication_date?.split('T')[0] || '',
            authors: Array.isArray(publication.authors) ? publication.authors : (publication.authors ? publication.authors.split(',') : []),
            abstract: publication.abstract || '',
            description: publication.description || publication.content || '',
            downloadUrl: publication.downloadUrl || publication.download_url || '',
            image: publication.image || publication.image_url || '',
            tags: Array.isArray(publication.tags) ? publication.tags : (publication.tags ? publication.tags.split(',') : []),
            pages: publication.pages || 0,
            language: publication.language || 'English',
            doi: publication.doi || '',
            featured: publication.featured || false,
            slug: publication.slug || ''
          });
        } else {
          alert('Error loading publication: ' + data.message);
          router.push('/admin/publications');
        }
      } catch (error) {
        console.error('Error loading publication:', error);
        alert('Error loading publication. Redirecting to publications list.');
        router.push('/admin/publications');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadPublication();
    }
  }, [params.id, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAuthorsChange = (authorsText) => {
    const authors = authorsText.split(',').map(author => author.trim()).filter(author => author !== '');
    setFormData(prev => ({
      ...prev,
      authors: authors
    }));
  };

  const handleTagsChange = (tagsText) => {
    const tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setFormData(prev => ({
      ...prev,
      tags: tags
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/publications/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Publication updated successfully!');
        router.push('/admin/publications');
      } else {
        alert('Error updating publication: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating publication:', error);
      alert('Error updating publication. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Publication">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Publication">
      <div className="max-w-4xl mx-auto">
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
                  Edit Publication
                </h1>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter publication subtitle (optional)"
                />
              </div>

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
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="English"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pages
                </label>
                <input
                  type="number"
                  value={formData.pages}
                  onChange={(e) => handleInputChange('pages', parseInt(e.target.value) || 0)}
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
                  placeholder="10.xxxx/xxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Download URL
                </label>
                <input
                  type="url"
                  value={formData.downloadUrl}
                  onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/publication.pdf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authors (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.authors.join(', ')}
                  onChange={(e) => handleAuthorsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe, Jane Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="climate, energy, policy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="url-friendly-slug"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Abstract *
                </label>
                <textarea
                  value={formData.abstract}
                  onChange={(e) => handleInputChange('abstract', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief abstract or summary of the publication..."
                  required
                />
              </div>

              <div>
                <BasicRichTextEditor
                  label="📚 Full Publication Description *"
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder="Detailed description of the publication..."
                  height="400px"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  id="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured publication
                </label>
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Publication
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
