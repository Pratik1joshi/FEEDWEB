'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { servicesApi } from '../../../../../src/lib/api-services';
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Calendar,
  User,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function ViewService() {
  const router = useRouter();
  const params = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadService();
    }
  }, [params.id]);

  const loadService = async () => {
    try {
      setLoading(true);
      console.log('Loading service with ID:', params.id);
      const response = await servicesApi.getById(params.id);
      console.log('Service response:', response);
      
      // Handle different response structures
      let serviceData = null;
      if (response) {
        if (response.data) {
          serviceData = response.data;
        } else if (response.service) {
          serviceData = response.service;
        } else {
          serviceData = response;
        }
      }
      
      setService(serviceData);
    } catch (err) {
      console.error('Error loading service:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    try {
      await servicesApi.delete(params.id);
      router.push('/admin/services');
    } catch (error) {
      console.error('Delete failed:', error);
      alert(`Failed to delete service: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderIcon = (iconName) => {
    if (!iconName) return null;
    
    const IconComponent = LucideIcons[iconName];
    if (IconComponent) {
      return <IconComponent className="w-6 h-6 text-blue-600" />;
    }
    return <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">?</div>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            Error loading service: {error}
          </div>
          <button
            onClick={() => router.push('/admin/services')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!service) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
            Service not found
          </div>
          <button
            onClick={() => router.push('/admin/services')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`View Service: ${service.title}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/admin/services')}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push(`/admin/services/edit/${service.id}`)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              {deleteLoading ? (
                <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </button>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {renderIcon(service.icon)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Copy className="w-4 h-4 mr-1" />
                    ID: {service.id}
                    <button
                      onClick={() => copyToClipboard(service.id.toString())}
                      className="ml-2 p-1 hover:bg-gray-200 rounded"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </span>
                  {service.slug && (
                    <span>Slug: {service.slug}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {service.description || 'No description provided'}
              </p>
            </div>

            {/* Long Description */}
            {service.long_description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {service.long_description}
                  </p>
                </div>
              </div>
            )}

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.image && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Image</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-500" style={{display: 'none'}}>
                      Image not available
                    </div>
                  </div>
                </div>
              )}

              {service.hero_image && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Hero Image</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={service.hero_image} 
                      alt={`${service.title} Hero`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-500" style={{display: 'none'}}>
                      Image not available
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(service.created_at)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Last Updated
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(service.updated_at)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Icon</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {service.icon || 'No icon specified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Public Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Public Links</h3>
              <div className="space-y-2">
                <a
                  href={`/services/${service.slug || service.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on website
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
