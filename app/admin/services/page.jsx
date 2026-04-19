'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useApi } from '../../../src/hooks/useApi';
import { servicesApi } from '../../../src/lib/api-services';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  MoreHorizontal,
  Filter
} from 'lucide-react';

export default function ServicesAdmin() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Use real API instead of mock data
  const { data: services, loading, error, refetch } = useApi(servicesApi.getAll);

  // Handle different possible response structures
  let servicesArray = [];
  if (services) {
    if (Array.isArray(services)) {
      servicesArray = services;
    } else if (services.data && Array.isArray(services.data)) {
      servicesArray = services.data;
    } else if (services.services && Array.isArray(services.services)) {
      servicesArray = services.services;
    } else if (typeof services === 'object') {
      const possibleArrays = Object.values(services).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0) {
        servicesArray = possibleArrays[0];
      }
    }
  }

  const filteredServices = servicesArray.filter(service =>
    service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (serviceId) => {
    console.log('Delete service clicked:', serviceId);
    
    if (!window.confirm('Are you sure you want to delete this service?')) {
      console.log('Delete cancelled by user');
      return;
    }

    console.log('Attempting to delete service:', serviceId);
    setDeleteLoading(serviceId);
    
    try {
      console.log('Calling servicesApi.delete...');
      const result = await servicesApi.delete(serviceId);
      console.log('Delete result:', result);
      
      console.log('Refreshing data...');
      refetch();
      console.log('Service deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      alert(`Failed to delete service: ${error.message}`);
    } finally {
      setDeleteLoading(null);
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

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error loading services: {error.message}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Services Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-900">Services</h1> */}
            <p className="text-gray-600">Manage your service offerings</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => router.push('/admin/services/add')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No services found</div>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first service'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push('/admin/services/add')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Service
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {truncateText(service.description, 120)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>ID: {service.id}</span>
                    <span>Updated: {new Date(service.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/admin/services/view/${service.id}`)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/admin/services/edit/${service.id}`)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(service.id)}
                      disabled={deleteLoading === service.id}
                      className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      {deleteLoading === service.id ? (
                        <div className="w-4 h-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full mr-1" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
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
              <div className="text-2xl font-bold text-gray-900">{servicesArray.length}</div>
              <div className="text-sm text-gray-500">Total Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {servicesArray.filter(s => s.updatedAt && new Date(s.updatedAt) > new Date(Date.now() - 30*24*60*60*1000)).length}
              </div>
              <div className="text-sm text-gray-500">Updated This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {servicesArray.filter(s => s.description && s.description.length > 200).length}
              </div>
              <div className="text-sm text-gray-500">Detailed Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {servicesArray.filter(s => s.icon).length}
              </div>
              <div className="text-sm text-gray-500">With Icons</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
