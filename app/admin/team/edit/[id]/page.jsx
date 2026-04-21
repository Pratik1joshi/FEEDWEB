'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';
import FileUpload from '../../../../../components/FileUpload';
import { teamApi, teamSettingsApi } from '../../../../../src/lib/api-team';
import {
  TEAM_FORM_INITIAL_STATE,
  DEFAULT_TEAM_ROLE_OPTIONS,
  DEFAULT_TEAM_DEPARTMENT_OPTIONS,
  validateTeamForm,
  cleanTeamData,
} from '../../../../../lib/team-form-config';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  MapPin, 
  Calendar,
  Mail,
  Phone,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Github,
  AlertCircle
} from 'lucide-react';

export default function EditTeamMember() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  
  // Form data matching database schema
  const [formData, setFormData] = useState(TEAM_FORM_INITIAL_STATE);
  const [roleOptions, setRoleOptions] = useState(DEFAULT_TEAM_ROLE_OPTIONS);
  const [departmentOptions, setDepartmentOptions] = useState(DEFAULT_TEAM_DEPARTMENT_OPTIONS);

  // Form data is initialized with defaults above

  useEffect(() => {
    const loadTeamSettings = async () => {
      try {
        const response = await teamSettingsApi.getAll();
        const payload = response?.data && !Array.isArray(response.data) ? response.data : response;

        const roles = Array.isArray(payload?.roles)
          ? payload.roles.filter((option) => option.is_active).map((option) => option.label)
          : [];

        const departments = Array.isArray(payload?.departments)
          ? payload.departments.filter((option) => option.is_active).map((option) => option.label)
          : [];

        if (roles.length > 0) {
          setRoleOptions(roles);
        }

        if (departments.length > 0) {
          setDepartmentOptions(departments);
        }
      } catch (error) {
        console.error('Error loading team settings options:', error);
      }
    };

    loadTeamSettings();
  }, []);
  
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
          const member = response.data;
          console.log('Loaded team member:', member);
          
          setFormData({
            name: member.name || '',
            position: member.position || '',
            department: member.department || '',
            bio: member.bio || '',
            image_url: member.image_url || '',
            email: member.email || '',
            linkedin: member.linkedin || '',
            expertise: Array.isArray(member.expertise) ? member.expertise : [],
            education: Array.isArray(member.education) ? member.education : [],
            awards: Array.isArray(member.awards) ? member.awards : [],
            languages: Array.isArray(member.languages) ? member.languages : [],
            publications: member.publications || 0,
            years_experience: member.years_experience || 0,
            is_active: member.is_active !== undefined ? member.is_active : true,
            sort_order: member.sort_order || 0
          });
        } else if (response.name) {
          // Direct response format
          const member = response;
          console.log('Loaded team member (direct):', member);
          
          setFormData({
            name: member.name || '',
            position: member.position || '',
            department: member.department || '',
            bio: member.bio || '',
            image_url: member.image_url || '',
            email: member.email || '',
            linkedin: member.linkedin || '',
            expertise: Array.isArray(member.expertise) ? member.expertise : [],
            education: Array.isArray(member.education) ? member.education : [],
            awards: Array.isArray(member.awards) ? member.awards : [],
            languages: Array.isArray(member.languages) ? member.languages : [],
            publications: member.publications || 0,
            years_experience: member.years_experience || 0,
            is_active: member.is_active !== undefined ? member.is_active : true,
            sort_order: member.sort_order || 0
          });
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] ? prev[field].map((item, i) => i === index ? value : item) : []
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] ? prev[field].filter((_, i) => i !== index) : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const validation = validateTeamForm(formData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSaving(false);
        return;
      }
      
      setErrors({});
      const cleanedData = cleanTeamData(formData);

      console.log('Updating team member:', cleanedData);
      
      const response = await teamApi.update(params.id, cleanedData);
      
      if (response.success || response.data) {
        console.log('Team member updated successfully:', response);
        router.push('/admin/team');
      } else {
        throw new Error('Failed to update team member');
      }
    } catch (error) {
      console.error('Error updating team member:', error);
      alert('Error updating team member: ' + error.message);
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

  const departmentSelectOptions = [...new Set([formData.department, ...departmentOptions].filter(Boolean))];
  const roleInputOptions = [...new Set([formData.position, ...roleOptions].filter(Boolean))];

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
            
            {/* Validation Errors Box */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Please fix the following validation errors:
                    </h3>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {Object.entries(errors).map(([field, errorMsg]) => (
                        <li key={field}>{errorMsg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  list="team-role-options"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <datalist id="team-role-options">
                  {roleInputOptions.map((role) => (
                    <option key={role} value={role} />
                  ))}
                </datalist>
                <p className="text-xs text-gray-500 mt-1">
                  Need a new role?{' '}
                  <Link href="/admin/team/settings" className="text-[#1A365D] hover:underline">
                    Manage team settings
                  </Link>
                  .
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departmentSelectOptions.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Need a new department?{' '}
                  <Link href="/admin/team/settings" className="text-[#1A365D] hover:underline">
                    Manage team settings
                  </Link>
                  .
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Join Date
                </label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief biography or description..."
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
                  Add
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
                      placeholder="Area of expertise"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('expertise', index)}
                      className="text-red-600 hover:text-red-800"
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
                  Add
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
                      placeholder="Degree or qualification"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('education', index)}
                      className="text-red-600 hover:text-red-800"
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
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {formData.awards && formData.awards.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('awards', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Award or recognition"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('awards', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Image */}
            <div className="border-t pt-6 mb-8">
              <div className="md:col-span-2">
                <FileUpload
                  label="Profile Image *"
                  uploadType="image"
                  value={formData.image_url}
                  onChange={(value) => handleInputChange('image_url', value)}
                  placeholder="https://example.com/profile.jpg"
                />
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Member
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
