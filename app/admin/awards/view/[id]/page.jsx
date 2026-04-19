'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  ExternalLink,
  Calendar,
  Trophy,
  Award,
  Users,
  MapPin,
  DollarSign,
  Star,
  Tag
} from 'lucide-react';

export default function ViewAward() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [award, setAward] = useState(null);

  useEffect(() => {
    // Simulate loading award data
    const loadAward = async () => {
      try {
        // In real app, fetch from API: await fetch(`/api/awards/${params.id}`)
        // For now, simulate with sample data
        setTimeout(() => {
          setAward({
            id: params.id,
            title: 'Nepal Environmental Excellence Award 2023',
            category: 'Environmental Excellence',
            recipient: 'Dr. Pradeep Kumar Khatiwada',
            organization: 'FEED Nepal',
            awardedBy: 'Ministry of Forest and Environment, Government of Nepal',
            awardDate: '2023-06-15',
            location: 'Kathmandu, Nepal',
            status: 'received',
            featured: true,
            amount: 500000,
            currency: 'NPR',
            description: 'Recognition for outstanding contribution to environmental research and sustainable development initiatives in Nepal. This prestigious award acknowledges innovative approaches to climate adaptation and community-based environmental solutions.',
            significance: `This award represents the highest recognition for environmental excellence in Nepal, celebrating individuals and organizations that have made exceptional contributions to environmental protection, sustainable development, and climate action.

The award specifically recognizes Dr. Khatiwada's groundbreaking work in developing community-based climate adaptation strategies that have benefited over 50,000 rural households across 15 districts in Nepal. His research on integrating traditional knowledge with modern climate science has set new standards for environmental research in the region.`,
            criteria: [
              'Outstanding contribution to environmental research and innovation',
              'Demonstrated impact on climate adaptation and mitigation',
              'Leadership in sustainable development practices',
              'Community engagement and knowledge transfer',
              'International recognition and collaboration'
            ],
            impacts: [
              'Improved climate resilience for 50,000+ rural households',
              'Development of 25+ community adaptation plans',
              'Training of 200+ local environmental champions',
              'Publication of 15 high-impact research papers',
              'Establishment of 3 climate monitoring stations'
            ],
            tags: ['Environmental Excellence', 'Climate Action', 'Research Innovation', 'Community Impact', 'Nepal'],
            image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            certificateUrl: 'https://example.com/award-certificate.pdf',
            pressReleaseUrl: 'https://example.com/press-release'
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading award:', error);
        setLoading(false);
      }
    };

    loadAward();
  }, [params.id]);

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
      month: 'long',
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

  if (loading) {
    return (
      <AdminLayout title="Award Details">
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!award) {
    return (
      <AdminLayout title="Award Not Found">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Award Not Found</h2>
          <p className="text-gray-600 mb-8">The award you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/awards')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Awards
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Award Details">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.back()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  Award Details
                </h1>
              </div>
              <button
                onClick={() => router.push(`/admin/awards/edit/${award.id}`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Award
              </button>
            </div>
          </div>

          {/* Award Header */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Award Image */}
              {award.image && (
                <div className="flex-shrink-0">
                  <div className="w-48 h-64 rounded-lg overflow-hidden bg-gray-200">
                    <img 
                      src={award.image} 
                      alt={award.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {/* Award Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                    <span className="text-sm text-blue-600 font-medium">{award.category}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(award.status)}`}>
                      {award.status.charAt(0).toUpperCase() + award.status.slice(1)}
                    </span>
                    {award.featured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        <Star className="w-3 h-3 inline mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">{award.title}</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span><strong>Recipient:</strong> {award.recipient}</span>
                  </div>
                  
                  {award.organization && (
                    <div className="flex items-center text-gray-600">
                      <Award className="w-4 h-4 mr-2" />
                      <span><strong>Organization:</strong> {award.organization}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <Trophy className="w-4 h-4 mr-2" />
                    <span><strong>Awarded by:</strong> {award.awardedBy}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span><strong>Date:</strong> {formatDate(award.awardDate)}</span>
                  </div>

                  {award.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span><strong>Location:</strong> {award.location}</span>
                    </div>
                  )}

                  {award.amount && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span><strong>Amount:</strong> {formatAmount(award.amount, award.currency)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {award.certificateUrl && (
                    <a
                      href={award.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </a>
                  )}
                  
                  {award.pressReleaseUrl && (
                    <a
                      href={award.pressReleaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Press Release
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {award.description && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">{award.description}</p>
            </div>
          </div>
        )}

        {/* Significance */}
        {award.significance && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Significance & Achievement</h3>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                {award.significance.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Criteria */}
        {award.criteria && award.criteria.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Award Criteria</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {award.criteria.map((criterion, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{criterion}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Impact & Outcomes */}
        {award.impacts && award.impacts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Impact & Outcomes</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {award.impacts.map((impact, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{impact}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tags */}
        {award.tags && award.tags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {award.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
