'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Clock,
  Award,
  MapPin,
  Users,
  Star,
  Calendar,
  Tag,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

export default function ViewTimelineItem() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [timelineItem, setTimelineItem] = useState(null);

  useEffect(() => {
    // Simulate loading timeline item data
    const loadTimelineItem = async () => {
      try {
        // Mock data - in real app this would come from API
        const mockData = {
          id: params.id,
          year: "2019",
          title: "Global Partnership Launch",
          description: "Formed strategic alliances with 15 international organizations to expand our impact worldwide. This milestone represented a significant step in our organization's global reach and collaborative approach to addressing environmental challenges.",
          icon: "Heart",
          category: "Partnership",
          featured: true,
          images: [
            "https://example.com/partnership1.jpg",
            "https://example.com/partnership2.jpg"
          ],
          location: "Multiple Countries",
          impact: "15 strategic partnerships established globally",
          participants: [
            "International Organizations", 
            "NGOs", 
            "Government Bodies",
            "Research Institutions"
          ],
          achievements: [
            "15 international partnerships formed",
            "Global network established",
            "Cross-border collaboration initiated",
            "Shared resource framework developed"
          ],
          tags: ["partnership", "global", "alliance", "international", "collaboration"],
          createdAt: "2024-01-17T10:30:00Z",
          updatedAt: "2024-01-20T14:45:00Z"
        };

        setTimelineItem(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading timeline item:', error);
        setLoading(false);
      }
    };

    if (params.id) {
      loadTimelineItem();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this timeline item? This action cannot be undone.')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/admin/timeline');
      } catch (error) {
        console.error('Error deleting timeline item:', error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!timelineItem) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Timeline item not found</h2>
          <p className="text-gray-600 mt-2">The timeline item you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/timeline')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Timeline
          </button>
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
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Timeline Item Details
                  </h1>
                  <p className="text-sm text-gray-600">
                    {timelineItem.year} • {timelineItem.category}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push(`/admin/timeline/edit/${timelineItem.id}`)}
                  className="flex items-center px-3 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-3 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-blue-600">{timelineItem.year}</span>
                    {timelineItem.featured && (
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{timelineItem.title}</h2>
                  <span className="inline-block text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {timelineItem.category}
                  </span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>Created: {new Date(timelineItem.createdAt).toLocaleDateString()}</div>
                  <div>Updated: {new Date(timelineItem.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">
                {timelineItem.description}
              </p>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Location</div>
                    <div>{timelineItem.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-600">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Key Impact</div>
                    <div>{timelineItem.impact}</div>
                  </div>
                </div>
              </div>

              {timelineItem.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Images
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {timelineItem.images.map((image, index) => (
                      <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Timeline image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 text-sm hidden">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Participants */}
            {timelineItem.participants.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Participants
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {timelineItem.participants.map((participant, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{participant}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {timelineItem.achievements.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Key Achievements
                </h3>
                <div className="space-y-3">
                  {timelineItem.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700 flex-1">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {timelineItem.tags.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {timelineItem.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
            <button
              onClick={() => router.push('/admin/timeline')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Timeline List
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/admin/timeline/edit/${timelineItem.id}`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Timeline Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
