'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  User,
  Mail,
  Briefcase
} from 'lucide-react';

export default function EditTeamMember() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // MATCHING the real data structure from src/data/team.js
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    bio: '',
    expertise: [''],
    education: [''],
    image: '',
    email: '',
    linkedin: '',
    publications: 0,
    yearsExperience: 0,
    languages: [''],
    awards: ['']
  });

  const departments = [
    'Leadership',
    'Engineering', 
    'Research',
    'Operations'
  ];

  useEffect(() => {
    // Simulate loading team member data
    const loadTeamMember = async () => {
      try {
        // In real app, fetch from API: await fetch(`/api/team/${params.id}`)
        // For now, simulate with sample data that matches the real structure
        setTimeout(() => {
          setFormData({
            name: 'Dr. Sarah Chen',
            position: 'Executive Director & Chief Scientist',
            department: 'Leadership',
            bio: 'Dr. Sarah Chen brings over 15 years of experience in environmental science and sustainable development. She holds a PhD in Environmental Engineering from MIT and has led numerous international climate adaptation projects across Asia and Africa.',
            expertise: ['Climate Science', 'Environmental Policy', 'International Development', 'Research Strategy'],
            education: [
              'PhD Environmental Engineering, MIT',
              'MS Environmental Science, Stanford University',
              'BS Chemical Engineering, UC Berkeley'
            ],
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
            email: 'sarah.chen@feed.org.np',
            linkedin: 'https://linkedin.com/in/sarahchen',
            publications: 45,
            yearsExperience: 15,
            languages: ['English', 'Mandarin', 'Nepali'],
            awards: [
              'International Climate Leadership Award 2023',
              'Environmental Excellence Award 2021',
              'Outstanding Research Contribution 2019'
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading team member:', error);
        setLoading(false);
      }
    };

    loadTeamMember();
  }, [params.id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Filter out empty array items
      const cleanedData = {
        ...formData,
        expertise: formData.expertise.filter(item => item.trim() !== ''),
        education: formData.education.filter(item => item.trim() !== ''),
        languages: formData.languages.filter(item => item.trim() !== ''),
        awards: formData.awards.filter(item => item.trim() !== ''),
        publications: parseInt(formData.publications) || 0,
        yearsExperience: parseInt(formData.yearsExperience) || 0
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app: await fetch(`/api/team/${params.id}`, { method: 'PUT', body: JSON.stringify(cleanedData) })
      console.log('Updated team member:', cleanedData);
      
      router.push('/admin/team');
    } catch (error) {
      console.error('Error updating team member:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Team Member">
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Team Member">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
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
                  Edit Team Member
                </h1>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    Position *
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Executive Director"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@feed.org.np"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Publications
                  </label>
                  <input
                    type="number"
                    value={formData.publications}
                    onChange={(e) => handleInputChange('publications', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief professional biography and background"
              />
            </div>

            {/* Expertise */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Areas of Expertise</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('expertise')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Expertise
                </button>
              </div>
              <div className="space-y-3">
                {formData.expertise.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('expertise', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Climate Science"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('expertise', index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.expertise.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Education</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('education')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Education
                </button>
              </div>
              <div className="space-y-3">
                {formData.education.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('education', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., PhD Environmental Engineering, MIT"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('education', index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.education.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Languages</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('languages')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Language
                </button>
              </div>
              <div className="space-y-3">
                {formData.languages.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('languages', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., English"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('languages', index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.languages.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Awards & Recognition</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('awards')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Award
                </button>
              </div>
              <div className="space-y-3">
                {formData.awards.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('awards', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., International Climate Leadership Award 2023"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('awards', index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.awards.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="border-t pt-6">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Team Member
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
