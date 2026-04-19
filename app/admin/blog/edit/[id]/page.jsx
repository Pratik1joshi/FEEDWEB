'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import FileUpload from '@/components/FileUpload';
import BasicRichTextEditor from '@/components/rich-text-editor/BasicRichTextEditor';
import { blogApi } from '@/src/lib/api-services';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Calendar,
  User,
  Tag,
  FileText,
  Image as ImageIcon,
  Eye,
  Star,
  Clock,
  Link as LinkIcon
} from 'lucide-react';

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
    publishDate: '',
    author: {
      name: '',
      title: '',
      bio: '',
      avatar: '',
      social: {
        twitter: '',
        linkedin: ''
      }
    },
    category: '',
    tags: [''],
    readTime: '',
    status: 'draft',
    featured: false,
    metaDescription: '',
    metaKeywords: ''
  });

  const blogCategories = [
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

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'archived', label: 'Archived' }
  ];

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        const data = await blogApi.getById(params.id);

        if (data.success) {
          const blogPost = data.data;
          setFormData({
            title: blogPost.title || '',
            slug: blogPost.slug || '',
            excerpt: blogPost.excerpt || '',
            content: blogPost.content || '',
            image: blogPost.image || '',
            publishDate: blogPost.publish_date?.split('T')[0] || blogPost.publishDate?.split('T')[0] || '',
            author: {
              name: blogPost.author?.name || blogPost.author_name || '',
              title: blogPost.author?.title || blogPost.author_title || '',
              bio: blogPost.author?.bio || '',
              avatar: blogPost.author?.avatar || blogPost.author_avatar || '',
              social: {
                twitter: blogPost.author?.social?.twitter || '',
                linkedin: blogPost.author?.social?.linkedin || ''
              }
            },
            category: blogPost.category || 'Energy',
            tags: Array.isArray(blogPost.tags) ? blogPost.tags : [],
            readTime: blogPost.read_time || blogPost.readTime || '',
            status: blogPost.status || 'draft',
            featured: Boolean(blogPost.featured),
            metaDescription: blogPost.excerpt || '',
            metaKeywords: Array.isArray(blogPost.tags) ? blogPost.tags.join(', ') : ''
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

    loadBlogPost();
  }, [params.id]);

  // Helper functions for array management
  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index) => {
    if (formData.tags.length > 1) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter((_, i) => i !== index)
      }));
    }
  };

  const handleTagChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child, grandchild] = field.split('.');
      if (grandchild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title) => {
    handleInputChange('title', title);
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      handleInputChange('slug', generateSlug(title));
    }
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.trim().replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleContentChange = (content) => {
    handleInputChange('content', content);
    if (content.trim()) {
      handleInputChange('readTime', estimateReadTime(content));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanTags = formData.tags.filter(tag => tag.trim() !== '');
      
      const submitData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        publish_date: formData.publishDate,
        author: {
          name: formData.author.name,
          title: formData.author.title,
          avatar: formData.author.avatar
        },
        category: formData.category,
        tags: cleanTags,
        status: formData.status,
        featured: formData.featured,
        read_time: formData.readTime
      };

      const data = await blogApi.update(params.id, submitData);

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
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

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
                  Edit Blog Post
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Status: <span className="font-medium">{formData.status}</span>
                </span>
                {formData.featured && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
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
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter blog post title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="url-friendly-slug"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Blog Post Excerpt *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Write a compelling excerpt that will make readers want to read more..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 break-words whitespace-pre-wrap"
                    rows="3"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500 text-right">
                    {formData.excerpt?.length || 0} characters (Recommended: 150-160)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      {blogCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => handleInputChange('publishDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        <Star className="w-4 h-4 inline mr-1" />
                        Featured Post
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>
              <div className="space-y-6">
                <div>
                  <BasicRichTextEditor
                    label="✍️ Blog Post Content *"
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your amazing blog post here! Use the rich text editor to format your content beautifully with headings, images, lists, and more..."
                    height="600px"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    💡 The read time will be calculated automatically as you type!
                  </p>
                </div>

                <div className="md:col-span-2">
                  <FileUpload
                    label="Featured Image"
                    uploadType="image"
                    value={formData.image}
                    onChange={(value) => handleInputChange('image', value)}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => handleInputChange('readTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5 min read"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This will be calculated automatically based on content length
                  </p>
                </div>
              </div>
            </div>

            {/* Author Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Author Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={formData.author.name}
                    onChange={(e) => handleInputChange('author.name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Author's full name"
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
                    placeholder="Author's job title"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Author Bio
                  </label>
                  <textarea
                    value={formData.author.bio}
                    onChange={(e) => handleInputChange('author.bio', e.target.value)}
                    placeholder="Write a brief but engaging bio of the author..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 break-words whitespace-pre-wrap"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={formData.author.avatar}
                    onChange={(e) => handleInputChange('author.avatar', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Handle
                  </label>
                  <input
                    type="text"
                    value={formData.author.social.twitter}
                    onChange={(e) => handleInputChange('author.social.twitter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="@username"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-1" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.author.social.linkedin}
                    onChange={(e) => handleInputChange('author.social.linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/in/username"
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
                  onClick={addTag}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Tag
                </button>
              </div>
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tag keyword"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.tags.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    rows={2}
                    maxLength={160}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description for search engines (max 160 characters)"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.metaKeywords}
                    onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Comma-separated keywords for SEO"
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
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
