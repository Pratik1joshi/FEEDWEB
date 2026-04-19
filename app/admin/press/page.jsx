'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Calendar,
  FileText,
  Download
} from 'lucide-react';

export default function PressAdmin() {
  const router = useRouter();
  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const pressTypes = ['All', 'Partnership Announcement', 'Award Announcement', 'Product Launch', 'Research Publication', 'Event Announcement', 'Company News'];

  useEffect(() => {
    fetchPressReleases();
  }, []);

  const fetchPressReleases = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/press');
      const data = await response.json();
      
      if (data.success) {
        setPressReleases(data.data);
      } else {
        console.error('Failed to fetch press releases:', data.message);
      }
    } catch (error) {
      console.error('Error fetching press releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this press release?')) {
      try {
        const response = await fetch(`/api/press/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          alert('Press release deleted successfully!');
          fetchPressReleases(); // Refresh the list
        } else {
          alert('Error deleting press release: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting press release:', error);
        alert('Error deleting press release. Please try again.');
      }
    }
  };

  const filteredPressReleases = pressReleases.filter(press => {
    const matchesSearch = press.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         press.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || 
                       press.category?.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

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
    <AdminLayout title='Press Releases'>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-900">Press Releases</h1> */}
            <p className="text-gray-600">Manage your press releases and media communications</p>
          </div>
          <Link
            href="/admin/press/add"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Press Release
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search press releases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {pressTypes.map(type => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Press Releases Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Press Release
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPressReleases.map((press) => (
                  <tr key={press.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {press.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {press.excerpt}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                        {press.category || press.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {press.publish_date ? new Date(press.publish_date).toLocaleDateString() : press.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        {press.downloadUrl && (
                          <a
                            href={press.downloadUrl}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Main Release
                          </a>
                        )}
                        {press.attachments && press.attachments.map((attachment, index) => (
                          <a
                            key={index}
                            href={attachment.url}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => router.push(`/press/${press.slug}`)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/press/edit/${press.id}`)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(press.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
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

          {filteredPressReleases.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm || typeFilter !== 'all' 
                  ? 'No press releases found matching your criteria.' 
                  : 'No press releases yet. Create your first press release!'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
