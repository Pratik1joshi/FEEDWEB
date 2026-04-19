'use client';
import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Trophy,
  Star,
  Award,
  Calendar,
  Users,
  MapPin,
  DollarSign
} from 'lucide-react';

// Sample awards data - in real app this would come from an API
const sampleAwards = [
  {
    id: 1,
    title: 'Nepal Environmental Excellence Award 2023',
    category: 'Environmental Excellence',
    recipient: 'Dr. Pradeep Kumar Khatiwada',
    organization: 'FEED Nepal',
    awardedBy: 'Ministry of Forest and Environment',
    awardDate: '2023-06-15',
    location: 'Kathmandu, Nepal',
    status: 'received',
    featured: true,
    amount: 500000,
    currency: 'NPR',
    description: 'Recognition for outstanding contribution to environmental research and sustainable development initiatives in Nepal.',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'UNEP Climate Champion Award',
    category: 'Climate Action',
    recipient: 'FEED Research Team',
    organization: 'FEED Nepal',
    awardedBy: 'United Nations Environment Programme',
    awardDate: '2022-12-03',
    location: 'Geneva, Switzerland',
    status: 'received',
    featured: true,
    description: 'International recognition for innovative climate adaptation strategies in rural communities.',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Best Research Paper Award',
    category: 'Academic Achievement',
    recipient: 'Dr. Sarah Johnson',
    organization: 'FEED Nepal',
    awardedBy: 'International Conference on Sustainability',
    awardDate: '2023-03-20',
    location: 'Bangkok, Thailand',
    status: 'received',
    featured: false,
    description: 'Outstanding research on biodiversity conservation in the Himalayas.',
    image: null
  }
];

export default function AwardsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [awards] = useState(sampleAwards);

  // Filter awards
  const filteredAwards = awards.filter(award => {
    const matchesSearch = award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         award.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         award.awardedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || award.category === selectedCategory;
    const matchesStatus = selectedStatus === '' || award.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories and statuses for filters
  const categories = [...new Set(awards.map(award => award.category))];
  const statuses = [...new Set(awards.map(award => award.status))];

  const handleDelete = (awardId, awardTitle) => {
    if (window.confirm(`Are you sure you want to delete "${awardTitle}"? This action cannot be undone.`)) {
      // In a real app, this would delete from database
      console.log('Deleting award:', awardId);
      alert('Award deleted successfully!');
      // Refresh the page or update state
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'nominated':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount, currency) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout title="Awards & Recognition">
      {/* Action Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600">Manage awards, recognitions, and achievements</p>
        </div>
        <Link
          href="/admin/awards/add"
          className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Award
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{awards.length}</p>
              <p className="text-gray-600">Total Awards</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {awards.filter(a => a.status === 'received').length}
              </p>
              <p className="text-gray-600">Received</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {awards.filter(a => a.featured).length}
              </p>
              <p className="text-gray-600">Featured</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {categories.length}
              </p>
              <p className="text-gray-600">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search awards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent min-w-[180px]"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent min-w-[140px]"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAwards.length} of {awards.length} awards
        </div>
      </div>

      {/* Awards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAwards.map((award) => (
          <div key={award.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Award Image */}
            <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
              {award.image ? (
                <img
                  src={award.image}
                  alt={award.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <Trophy className="w-16 h-16 text-white" />
                </div>
              )}
              
              {/* Status & Featured Badges */}
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(award.status)}`}>
                  {award.status.charAt(0).toUpperCase() + award.status.slice(1)}
                </span>
                {award.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Award Info */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{award.title}</h3>
                <p className="text-[#1A365D] font-medium text-sm">{award.category}</p>
              </div>

              {/* Quick Info */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{award.recipient}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Award className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{award.awardedBy}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{formatDate(award.awardDate)}</span>
                </div>
                
                {award.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{award.location}</span>
                  </div>
                )}
                
                {award.amount && (
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="font-medium">{formatAmount(award.amount, award.currency)}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {award.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {award.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/awards/view/${award.id}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
                <Link
                  href={`/admin/awards/edit/${award.id}`}
                  className="flex-1 px-3 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(award.id, award.title)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAwards.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No awards found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory || selectedStatus
              ? 'Try adjusting your filters'
              : 'Get started by adding your first award'}
          </p>
          <Link
            href="/admin/awards/add"
            className="inline-flex items-center px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Award
          </Link>
        </div>
      )}
    </AdminLayout>
  );
}
