'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import BasicRichTextEditor from '@/components/rich-text-editor/BasicRichTextEditor';
import { Save, ArrowLeft, Calendar, User, FileText, Star } from 'lucide-react';

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    publish_date: '',
    author: {
      name: '',
      title: '',
      avatar: ''
    },
    category: 'Energy',
    tags: [],
    status: 'published',
    featured: false,
    read_time: ''
  });

  const categories = [
    'Energy',
    'Finance', 
    'Research',
    'Leadership',
    'Urban Planning',
    'Evaluation',
    'Policy',
    'Technology',
    'Innovation',
    'Community Development'
  ];

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          const blogPost = data.data;
          setFormData({
            title: blogPost.title || '',
            slug: blogPost.slug || '',
            excerpt: blogPost.excerpt || '',
            content: blogPost.content || '',
            image: blogPost.image || '',
            publish_date: blogPost.publish_date?.split('T')[0] || '',
            author: {
              name: blogPost.author?.name || blogPost.author_name || '',
              title: blogPost.author?.title || blogPost.author_title || '',
              avatar: blogPost.author?.avatar || blogPost.author_avatar || ''
            },
            category: blogPost.category || 'Energy',
            tags: Array.isArray(blogPost.tags) ? blogPost.tags : (blogPost.tags ? blogPost.tags.split(',') : []),
            status: blogPost.status || 'published',
            featured: blogPost.featured || false,
            read_time: blogPost.read_time || ''
          });
        } else {
          alert('Error loading blog post: ' + data.message);
          router.push('/admin/blog');
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
        alert('Error loading blog post. Redirecting to blog list.');
        router.push('/admin/blog');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadBlogPost();
    }
  }, [params.id, router]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
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
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Blog post updated successfully!');
        router.push('/admin/blog');
      } else {
        alert('Error updating blog post: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('Error updating blog post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Blog Post">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Blog Post">
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
                  Edit Blog Post
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
                  <FileText className="w-4 h-4 inline mr-1" />
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter blog post title"
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
                  Publish Date *
                </label>
                <input
                  type="date"
                  value={formData.publish_date}
                  onChange={(e) => handleInputChange('publish_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.read_time}
                  onChange={(e) => handleInputChange('read_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="8 min read"
                />
              </div>
            </div>

            {/* Author Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                <User className="w-5 h-5 inline mr-2" />
                Author Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={formData.author.name}
                    onChange={(e) => handleInputChange('author.name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Author name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Title
                  </label>
                  <input
                    type="text"
                    value={formData.author.title}
                    onChange={(e) => handleInputChange('author.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Position/Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Avatar URL
                  </label>
                  <input
                    type="url"
                    value={formData.author.avatar}
                    onChange={(e) => handleInputChange('author.avatar', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="energy, climate, innovation"
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
                  📝 Blog Post Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief summary of the blog post..."
                  required
                />
              </div>

              <div>
                <BasicRichTextEditor
                  label="📰 Full Blog Post Content *"
                  value={formData.content}
                  onChange={(value) => handleInputChange('content', value)}
                  placeholder="Write your blog post here..."
                  height="400px"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  id="published"
                  type="checkbox"
                  checked={formData.status === 'published'}
                  onChange={(e) => handleInputChange('status', e.target.checked ? 'published' : 'draft')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                  Published
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Featured blog post
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
                      Update Blog Post
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
