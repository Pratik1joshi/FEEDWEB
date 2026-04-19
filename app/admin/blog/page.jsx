'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { blogApi } from '@/src/lib/api-services';
import { 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Eye,
  Star,
  Calendar,
  User,
  Tag,
  Clock,
  Bookmark
} from 'lucide-react';

export default function BlogAdmin() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  const normalizePost = (post) => ({
    ...post,
    excerpt: post.excerpt || '',
    tags: Array.isArray(post.tags)
      ? post.tags
      : typeof post.tags === 'string'
        ? post.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [],
    author: post.author || {
      name: post.author_name || '',
      title: post.author_title || '',
      avatar: post.author_avatar || ''
    },
    publishDate: post.publish_date || post.publishDate,
    readTime: post.read_time || post.readTime,
    views: Number(post.views || 0)
  });

  const blogStatuses = [
    { value: 'all', label: 'All Status', count: 0 },
    { value: 'published', label: 'Published', count: 0 },
    { value: 'draft', label: 'Draft', count: 0 },
    { value: 'scheduled', label: 'Scheduled', count: 0 },
    { value: 'archived', label: 'Archived', count: 0 }
  ];

  const blogCategories = [
    'All',
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
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [blogPosts, searchTerm, statusFilter, categoryFilter, featuredFilter]);

  const fetchBlogPosts = async () => {
    try {
      const data = await blogApi.getAll();

      if (data.success) {
        setBlogPosts(data.data.map(normalizePost));
      } else {
        console.error('Error fetching blog posts:', data.message);
        // Fallback to empty array if API fails
        setBlogPosts([]);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fallback to empty array if API fails
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = blogPosts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    // Featured filter
    if (featuredFilter === 'featured') {
      filtered = filtered.filter(post => post.featured);
    } else if (featuredFilter === 'regular') {
      filtered = filtered.filter(post => !post.featured);
    }

    setFilteredPosts(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Scheduled' },
      archived: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const data = await blogApi.delete(id);
        
        if (data.success) {
          setBlogPosts(posts => posts.filter(post => post.id !== id));
          alert('Blog post deleted successfully!');
        } else {
          alert('Error deleting blog post: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Error deleting blog post. Please try again.');
      }
    }
  };

  const toggleFeatured = async (id) => {
    try {
      const data = await blogApi.toggleFeatured(id);
      
      if (data.success) {
        await fetchBlogPosts();
      } else {
        alert('Error updating featured status: ' + data.message);
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Error updating featured status. Please try again.');
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
    <AdminLayout title='Blog Posts'>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1> */}
            <p className="mt-2 text-gray-600">
              Manage your blog content and articles
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/blog/add')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Blog Post
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {blogCategories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Filter */}
            <div>
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Posts</option>
                <option value="featured">Featured Only</option>
                <option value="regular">Regular Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">{blogPosts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {blogPosts.filter(post => post.status === 'published').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Edit className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {blogPosts.filter(post => post.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {blogPosts.filter(post => post.featured).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4 max-w-xs">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {post.title}
                            </h3>
                            {post.featured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{post.excerpt?.replace(/<[^>]*>/g, '') || ''}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {post.author.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(post.publishDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        {post.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => toggleFeatured(post.id)}
                          className={`${
                            post.featured ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-400 hover:text-gray-600'
                          } transition-colors`}
                          title={post.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <Star className={`w-4 h-4 ${post.featured ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/blog/edit/${post.id}`)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || featuredFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Get started by creating your first blog post.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
