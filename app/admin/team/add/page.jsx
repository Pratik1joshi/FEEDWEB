'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../../components/AdminLayout';
import FileUpload from '../../../../components/FileUpload';
import BasicRichTextEditor from '../../../../components/rich-text-editor/BasicRichTextEditor';
import { teamApi, teamSettingsApi } from '../../../../src/lib/api-team';
import {
  TEAM_FORM_INITIAL_STATE,
  DEFAULT_TEAM_ROLE_OPTIONS,
  DEFAULT_TEAM_DEPARTMENT_OPTIONS,
  validateTeamForm,
  cleanTeamData,
} from '../../../../lib/team-form-config';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  User,
  Mail,
  Briefcase,
  MapPin,
  AlertCircle
} from 'lucide-react';

export default function AddTeamMember() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form data matching database schema
  const [formData, setFormData] = useState(TEAM_FORM_INITIAL_STATE);
  const [roleOptions, setRoleOptions] = useState(DEFAULT_TEAM_ROLE_OPTIONS);
  const [departmentOptions, setDepartmentOptions] = useState(DEFAULT_TEAM_DEPARTMENT_OPTIONS);

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
    setLoading(true);

    try {
      const validation = validateTeamForm(formData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      setErrors({});
      const cleanedData = cleanTeamData(formData);

      console.log('Creating team member:', cleanedData);
      
      // Call real API
      const response = await teamApi.create(cleanedData);
      
      if (response.success || response.data) {
        console.log('Team member created successfully:', response);
        router.push('/admin/team');
      } else {
        throw new Error('Failed to create team member');
      }
      
    } catch (error) {
      console.error('Error adding team member:', error);
      alert('Failed to add team member: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add Team Member">
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
                  Add New Team Member
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
                    list="team-role-options"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Executive Director"
                    required
                  />
                  <datalist id="team-role-options">
                    {roleOptions.map((role) => (
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
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
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
                    value={formData.years_experience}
                    onChange={(e) => handleInputChange('years_experience', e.target.value)}
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

                <div className="md:col-span-2">
                  <FileUpload
                    label="Profile Image"
                    uploadType="image"
                    value={formData.image_url}
                    onChange={(value) => handleInputChange('image_url', value)}
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="border-t pt-6">
              <BasicRichTextEditor
                label="👤 Professional Biography"
                value={formData.bio}
                onChange={(value) => handleInputChange('bio', value)}
                placeholder="Write a comprehensive professional biography including achievements, experience, research interests, and background..."
                height="400px"
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
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Team Member
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
