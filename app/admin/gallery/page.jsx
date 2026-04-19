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
  Download,
  Calendar,
  MapPin,
  Camera,
  Filter
} from 'lucide-react';

export default function GalleryAdmin() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    "All",
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

  // Mock data - in real app, this would come from API
  useEffect(() => {
    setTimeout(() => {
      setImages([
        {
          id: 1,
          title: "Community Solar Installation",
          description: "Local technicians installing solar panels on a community center in rural Nepal",
          src: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&h=800&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=300&fit=crop",
          category: "Energy Projects",
          date: "March 15, 2025",
          location: "Dolakha, Nepal",
          photographer: "FEED Team",
          tags: ["solar", "community", "installation", "rural"],
          downloadUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&h=1280&fit=crop&dl=community-solar-installation.jpg"
        },
        {
          id: 2,
          title: "Climate Finance Summit Opening",
          description: "Dr. Sarah Johnson delivering the opening keynote at the International Climate Finance Summit",
          src: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=1200&h=800&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=300&fit=crop",
          category: "Events",
          date: "June 10, 2025",
          location: "Kathmandu, Nepal",
          photographer: "Conference Photography Team",
          tags: ["summit", "keynote", "climate finance", "conference"],
          downloadUrl: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=1920&h=1280&fit=crop&dl=summit-opening.jpg"
        },
        {
          id: 3,
          title: "Forest Carbon Research",
          description: "Research team collecting data on carbon sequestration in community-managed forests",
          src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
          category: "Research",
          date: "April 22, 2025",
          location: "Chitwan, Nepal",
          photographer: "Dr. Emily Rodriguez",
          tags: ["research", "forest", "carbon", "data collection"],
          downloadUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1280&fit=crop&dl=forest-research.jpg"
        },
        {
          id: 4,
          title: "Youth Leadership Training",
          description: "Young climate leaders participating in hands-on renewable energy training",
          src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
          category: "Training",
          date: "May 5, 2025",
          location: "Pokhara, Nepal",
          photographer: "Training Team",
          tags: ["youth", "training", "leadership", "renewable energy"],
          downloadUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1280&fit=crop&dl=youth-training.jpg"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImages(images.filter(image => image.id !== imageId));
    }
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
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
    <AdminLayout title="Gallery Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-900">Gallery</h1> */}
            <p className="text-gray-600">Manage your image gallery and media assets</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => router.push('/admin/gallery/add')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search images..."
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

        {/* Images Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No images found</div>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'All' ? 'Try adjusting your filters' : 'Get started by adding your first image'}
            </p>
            {!searchTerm && selectedCategory === 'All' && (
              <button
                onClick={() => router.push('/admin/gallery/add')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Image
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredImages.map((image) => (
              <div key={image.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Image */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={image.thumbnail}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => window.open(image.src, '_blank')}
                        className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-800" />
                      </button>
                      <button 
                        onClick={() => window.open(image.downloadUrl, '_blank')}
                        className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Download className="w-4 h-4 text-gray-800" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {image.category}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {image.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {truncateText(image.description, 80)}
                  </p>
                  
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {image.date}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {image.location}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Camera className="w-3 h-3 mr-1" />
                      {image.photographer}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/admin/gallery/view/${image.id}`)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/admin/gallery/edit/${image.id}`)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(image.id)}
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
              <div className="text-2xl font-bold text-gray-900">{images.length}</div>
              <div className="text-sm text-gray-500">Total Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {categories.length - 1}
              </div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {images.filter(img => new Date(img.date) > new Date(Date.now() - 30*24*60*60*1000)).length}
              </div>
              <div className="text-sm text-gray-500">Recent Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {[...new Set(images.map(img => img.photographer))].length}
              </div>
              <div className="text-sm text-gray-500">Photographers</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
