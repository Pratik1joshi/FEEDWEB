'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { eventsApi } from '@/lib/api-services';
import { 
  ArrowLeft, 
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  User,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';

export default function ViewEvent() {
  const router = useRouter();
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const eventData = await eventsApi.getById(params.id);
        setEvent(eventData);
      } catch (error) {
        console.error('Error loading event:', error);
        alert('Failed to load event data');
        router.push('/admin/events');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadEvent();
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await eventsApi.delete(params.id);
      router.push('/admin/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (!event) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Event not found</p>
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
                  Event Details
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push(`/admin/events/edit/${event.id}`)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                </span>
              </div>
              
              {event.subtitle && (
                <p className="text-lg text-gray-600 mb-4">{event.subtitle}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Date: {formatDate(event.event_date)}</span>
                </div>
                {event.end_date && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>End Date: {formatDate(event.end_date)}</span>
                  </div>
                )}
                {event.event_time && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Time: {event.event_time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Location: {event.location}</span>
                  </div>
                )}
                {event.capacity && (
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Capacity: {event.capacity} people</span>
                  </div>
                )}
                {event.category && (
                  <div className="flex items-center text-gray-600">
                    <Tag className="w-4 h-4 mr-2" />
                    <span>Category: {event.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            {/* Full Description */}
            {event.full_description && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  <FileText className="w-5 h-5 inline mr-2" />
                  Full Description
                </h3>
                <div className="text-gray-700 whitespace-pre-wrap">{event.full_description}</div>
              </div>
            )}

            {/* Images */}
            {event.images && event.images.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  <ImageIcon className="w-5 h-5 inline mr-2" />
                  Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.images.map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={`Event image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  <User className="w-5 h-5 inline mr-2" />
                  Speakers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        {speaker.image && (
                          <img
                            src={speaker.image}
                            alt={speaker.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{speaker.name}</h4>
                          {speaker.title && (
                            <p className="text-sm text-gray-600">{speaker.title}</p>
                          )}
                          {speaker.bio && (
                            <p className="text-sm text-gray-700 mt-2">{speaker.bio}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Agenda</h3>
                <div className="space-y-4">
                  {event.agenda.map((day, dayIndex) => (
                    <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                      {day.day && (
                        <h4 className="font-medium text-gray-900 mb-3">{day.day}</h4>
                      )}
                      {day.sessions && day.sessions.length > 0 && (
                        <div className="space-y-2">
                          {day.sessions.map((session, sessionIndex) => (
                            <div key={sessionIndex} className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4 p-3 bg-gray-50 rounded">
                              {session.time && (
                                <div className="text-sm font-medium text-gray-600 md:w-20 flex-shrink-0">
                                  {session.time}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{session.title}</div>
                                {session.speaker && (
                                  <div className="text-sm text-gray-600">Speaker: {session.speaker}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {event.venue && (
                  <div>
                    <span className="font-medium text-gray-700">Venue:</span>
                    <span className="text-gray-600 ml-2">{event.venue}</span>
                  </div>
                )}
                {event.organizer && (
                  <div>
                    <span className="font-medium text-gray-700">Organizer:</span>
                    <span className="text-gray-600 ml-2">{event.organizer}</span>
                  </div>
                )}
                {event.ticket_price && (
                  <div>
                    <span className="font-medium text-gray-700">Ticket Price:</span>
                    <span className="text-gray-600 ml-2">{event.ticket_price}</span>
                  </div>
                )}
                {event.registration_link && (
                  <div>
                    <span className="font-medium text-gray-700">Registration:</span>
                    <a
                      href={event.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 ml-2 inline-flex items-center"
                    >
                      <LinkIcon className="w-4 h-4 mr-1" />
                      Register Now
                    </a>
                  </div>
                )}
                {event.registered_attendees !== undefined && (
                  <div>
                    <span className="font-medium text-gray-700">Registered:</span>
                    <span className="text-gray-600 ml-2">{event.registered_attendees} attendees</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Slug:</span>
                  <span className="text-gray-600 ml-2">{event.slug}</span>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {event.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
