'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { eventsApi } from '@/lib/api-services';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  FileText
} from 'lucide-react';

export default function EventsAdmin() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);

  const eventStatuses = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
  const eventCategories = ['All', 'Summit', 'Workshop', 'Conference', 'Training', 'Webinar', 'Networking'];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('Loading events...');
      const response = await eventsApi.getAll();
      console.log('Events API response:', response);
      
      let eventsData = [];
      if (response?.data) {
        eventsData = response.data;
      } else if (Array.isArray(response)) {
        eventsData = response;
      }
      
      setEvents(eventsData);
    } catch (err) {
      console.error('Error loading events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(eventId);
    try {
      console.log('Deleting event:', eventId);
      await eventsApi.delete(eventId);
      await loadEvents(); // Reload events
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      alert(`Failed to delete event: ${error.message}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         event.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || 
                           event.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error loading events: {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 text-red-800 underline"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Events Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-900">Events Management</h1> */}
            <p className="text-gray-600">Manage your events, workshops, and conferences</p>
          </div>
          <Link
            href="/admin/events/add"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {eventStatuses.map(status => (
                  <option key={status} value={status.toLowerCase()}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {eventCategories.map(category => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {event.subtitle}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {event.description.substring(0, 100)}...
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                            {event.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(event.event_date || event.date)} 
                          {(event.end_date || event.endDate) && event.end_date !== (event.event_date || event.date) && 
                            ` - ${formatDate(event.end_date || event.endDate)}`}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {event.event_time || event.time || 'All day'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {event.location || 'Location TBD'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{event.registered_attendees || 0}</span>
                        <span className="text-gray-500">/{event.capacity || '∞'}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {event.ticket_price || 'Free'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => router.push(`/events/${event.slug}`)}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          title="View Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/events/view/${event.id}`)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/events/edit/${event.id}`)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          disabled={deleteLoading === event.id}
                          className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === event.id ? (
                            <div className="w-4 h-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'No events found matching your criteria.' 
                  : 'No events yet. Create your first event!'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
