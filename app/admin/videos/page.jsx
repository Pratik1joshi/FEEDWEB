'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  Play,
  Clock,
  Calendar,
  User,
  Filter
} from 'lucide-react';

export default function VideosAdmin() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    "All",
    "Educational",
    "Documentary", 
    "Conference",
    "Research",
    "Tutorials"
  ];

  // Mock data - in real app, this would come from API
  useEffect(() => {
    setTimeout(() => {
      setVideos([
        {
          id: 1,
          slug: "energy-transitions-explained-series-launch",
          title: "Energy Transitions Explained - Series Launch",
          description: "Introduction to our new educational series breaking down complex energy concepts for policymakers and the public.",
          thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "5:42",
          category: "Educational",
          date: "April 15, 2025",
          views: 12500,
          tags: ["Energy", "Education", "Policy", "Renewable"]
        },
        {
          id: 2,
          slug: "community-solar-microgrid-installation-documentary",
          title: "Community Solar Microgrid Installation - Documentary",
          description: "Follow the complete process of installing a community-owned solar microgrid in rural Nepal, from planning to commissioning.",
          thumbnail: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&h=400&fit=crop",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "28:15",
          category: "Documentary",
          date: "March 20, 2025",
          views: 8750,
          tags: ["Solar", "Community", "Installation", "Rural"]
        },
        {
          id: 3,
          slug: "climate-finance-summit-2025-highlights",
          title: "Climate Finance Summit 2025 - Key Highlights",
          description: "Highlights from FEED's International Climate Finance Summit, featuring expert insights on innovative funding mechanisms.",
          thumbnail: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=600&h=400&fit=crop",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "15:30",
          category: "Conference",
          date: "June 12, 2025",
          views: 15200,
          tags: ["Climate Finance", "Summit", "Innovation", "Policy"]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(video => video.id !== videoId));
    }
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Videos Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-900">Videos</h1> */}
            <p className="text-gray-600">Manage your video content library</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => router.push('/admin/videos/add')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No videos found</div>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'All' ? 'Try adjusting your filters' : 'Get started by adding your first video'}
            </p>
            {!searchTerm && selectedCategory === 'All' && (
              <button
                onClick={() => router.push('/admin/videos/add')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Video
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors">
                      <Play className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {video.category}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="w-3 h-3 mr-1" />
                      {formatViews(video.views)}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {truncateText(video.description, 80)}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="w-3 h-3 mr-1" />
                    {video.date}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/admin/videos/view/${video.id}`)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/admin/videos/edit/${video.id}`)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{videos.length}</div>
              <div className="text-sm text-gray-500">Total Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatViews(videos.reduce((sum, video) => sum + video.views, 0))}
              </div>
              <div className="text-sm text-gray-500">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {categories.length - 1}
              </div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {videos.filter(v => new Date(v.date) > new Date(Date.now() - 30*24*60*60*1000)).length}
              </div>
              <div className="text-sm text-gray-500">Recent Videos</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
