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
  FileText,
  BookOpen,
  Users,
  Tag,
  Globe,
  Eye
} from 'lucide-react';

export default function ViewPublication() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [publication, setPublication] = useState(null);

  useEffect(() => {
    // Simulate loading publication data
    const loadPublication = async () => {
      try {
        // In real app, fetch from API: await fetch(`/api/publications/${params.id}`)
        // For now, simulate with sample data
        setTimeout(() => {
          setPublication({
            id: params.id,
            title: 'Climate Resilience in Rural Communities of Nepal: A Comprehensive Study',
            type: 'Research Report',
            authors: ['Dr. Pradeep Kumar Khatiwada', 'Dr. Sarah Johnson', 'Prof. Ram Bahadur Shrestha'],
            description: 'This comprehensive research report examines climate resilience strategies implemented across rural communities in Nepal, analyzing their effectiveness and sustainability.',
            content: `This study presents a thorough analysis of climate resilience initiatives undertaken in rural Nepalese communities over the past decade. The research was conducted across 15 districts, involving 1,200 households and 45 community organizations.

Key findings include:
1. Community-based adaptation strategies show 70% higher success rates than top-down approaches
2. Local knowledge integration increases project sustainability by 60%
3. Women's participation in climate initiatives correlates strongly with community resilience outcomes

The study employed mixed-method approaches including household surveys, focus group discussions, key informant interviews, and participatory rural appraisal techniques. Data collection spanned 18 months from January 2022 to June 2023.

Recommendations:
- Strengthen local institutional capacity for climate adaptation
- Integrate traditional knowledge systems with modern climate science
- Ensure equitable participation of marginalized communities
- Develop context-specific financing mechanisms for adaptation projects`,
            publishDate: '2023-08-15',
            tags: ['Climate Change', 'Rural Communities', 'Nepal', 'Adaptation', 'Resilience'],
            category: 'Climate Change',
            status: 'Published',
            featured: true,
            downloadUrl: 'https://example.com/climate-resilience-report.pdf',
            externalUrl: 'https://journal.example.com/climate-resilience-nepal',
            coverImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            pageCount: 156,
            language: 'English',
            doi: '10.1000/nepal2023',
            isbn: '978-9937-0-1234-5',
            downloads: 1247,
            views: 3456
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading publication:', error);
        setLoading(false);
      }
    };

    loadPublication();
  }, [params.id]);

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'research report':
      case 'report':
        return <BookOpen className="w-5 h-5" />;
      case 'journal article':
      case 'research paper':
        return <FileText className="w-5 h-5" />;
      case 'policy brief':
        return <Users className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
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

  if (loading) {
    return (
      <AdminLayout title="Publication Details">
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!publication) {
    return (
      <AdminLayout title="Publication Not Found">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Publication Not Found</h2>
          <p className="text-gray-600 mb-8">The publication you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/publications')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Publications
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Publication Details">
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
                  Publication Details
                </h1>
              </div>
              <button
                onClick={() => router.push(`/admin/publications/edit/${publication.id}`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Publication
              </button>
            </div>
          </div>

          {/* Publication Header */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Cover Image */}
              {publication.coverImage && (
                <div className="flex-shrink-0">
                  <div className="w-48 h-64 rounded-lg overflow-hidden bg-gray-200">
                    <img 
                      src={publication.coverImage} 
                      alt={publication.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {/* Publication Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(publication.type)}
                    <span className="text-sm text-blue-600 font-medium">{publication.type}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(publication.status)}`}>
                      {publication.status}
                    </span>
                    {publication.featured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">{publication.title}</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{publication.authors.join(', ')}</span>
                  </div>
                  
                  {publication.publishDate && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Published: {formatDate(publication.publishDate)}</span>
                    </div>
                  )}

                  {publication.category && (
                    <div className="flex items-center text-gray-600">
                      <Tag className="w-4 h-4 mr-2" />
                      <span>{publication.category}</span>
                    </div>
                  )}

                  {publication.language && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>{publication.language}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{publication.views.toLocaleString()}</div>
                    <div className="text-sm text-blue-800">Views</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{publication.downloads.toLocaleString()}</div>
                    <div className="text-sm text-green-800">Downloads</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{publication.pageCount}</div>
                    <div className="text-sm text-purple-800">Pages</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {publication.downloadUrl && (
                    <a
                      href={publication.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  )}
                  
                  {publication.externalUrl && (
                    <a
                      href={publication.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View External
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {publication.description && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">{publication.description}</p>
            </div>
          </div>
        )}

        {/* Content/Abstract */}
        {publication.content && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Abstract/Content</h3>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                {publication.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {publication.tags && publication.tags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {publication.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publication.doi && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">DOI</label>
                  <p className="text-gray-900 font-mono">{publication.doi}</p>
                </div>
              )}
              
              {publication.isbn && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">ISBN</label>
                  <p className="text-gray-900 font-mono">{publication.isbn}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Publication ID</label>
                <p className="text-gray-900 font-mono">{publication.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <p className="text-gray-900">{publication.language}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
