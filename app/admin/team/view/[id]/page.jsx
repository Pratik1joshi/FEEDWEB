'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';
import { teamApi } from '../../../../../src/lib/api-team';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Github,
  Award,
  GraduationCap,
  Star
} from 'lucide-react';

export default function ViewTeamMember() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);

  useEffect(() => {
    // Load real team member data from API
    const loadTeamMember = async () => {
      if (!params.id) {
        setLoading(false);
        return;
      }

      try {
        console.log('Loading team member with ID:', params.id);
        const response = await teamApi.getById(params.id);
        
        if (response.success && response.data) {
          const memberData = response.data;
          console.log('Loaded team member:', memberData);
          setMember(memberData);
        } else if (response.name) {
          // Direct response format
          console.log('Loaded team member (direct):', response);
          setMember(response);
        } else {
          console.error('Team member not found');
          alert('Team member not found');
          router.push('/admin/team');
        }
      } catch (error) {
        console.error('Error loading team member:', error);
        alert('Error loading team member: ' + error.message);
        router.push('/admin/team');
      } finally {
        setLoading(false);
      }
    };

    loadTeamMember();
  }, [params.id, router]);

  const getSocialIcon = (platform) => {
    const icons = {
      linkedin: Linkedin,
      facebook: Facebook,
      twitter: Twitter,
      instagram: Instagram,
      github: Github
    };
    return icons[platform] || null;
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
      <AdminLayout title="Team Member Details">
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!member) {
    return (
      <AdminLayout title="Team Member Not Found">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Member Not Found</h2>
          <p className="text-gray-600 mb-8">The team member you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/team')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Team
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Team Member Details">
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
                  Team Member Details
                </h1>
              </div>
              <button
                onClick={() => router.push(`/admin/team/edit/${member.id}`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Member
              </button>
            </div>
          </div>

          {/* Profile Header */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  {member.image_url ? (
                    <img 
                      src={member.image_url} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
                    <p className="text-lg text-blue-600 font-medium">{member.position}</p>
                    <p className="text-gray-600">{member.department}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      member.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{member.years_experience || 0}+</div>
                    <div className="text-sm text-blue-800">Years Experience</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{member.publications || 0}</div>
                    <div className="text-sm text-green-800">Publications</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{(member.awards && member.awards.length) || 0}</div>
                    <div className="text-sm text-purple-800">Awards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {member.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a 
                      href={`mailto:${member.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {member.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {member.linkedin && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">Social Media</p>
                <div className="flex items-center space-x-4">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    title="LinkedIn profile"
                  >
                    <Linkedin className="w-4 h-4 text-gray-600" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Biography */}
        {member.bio && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Biography</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">{member.bio}</p>
            </div>
          </div>
        )}

        {/* Expertise */}
        {member.expertise.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Areas of Expertise
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Education */}
        {member.education.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-500" />
                Education
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {member.education.map((edu, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{edu}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Awards */}
        {member.awards && member.awards.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Awards & Recognition
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {member.awards.map((award, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{award}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
