'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { timelineApi } from '../../../../../lib/api-services'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Clock,
  Award,
  MapPin,
  Users,
  Star,
  Calendar,
  Flag,
  Heart,
  FileText,
  Building,
  Globe,
  Target,
  TrendingUp,
  Lightbulb,
  Zap,
  Leaf,
  BookOpen
} from 'lucide-react';

export default function EditTimelineItem() {
  const router = useRouter();
  const params = useParams();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    title: '',
    description: '',
    icon: 'Clock',
    category: '',
    featured: false,
    images: [''],
    location: '',
    impact: '',
    participants: [''],
    achievements: [''],
    tags: ['']
  });

  // Available icons with their components
  const iconOptions = [
    { name: 'Clock', component: Clock, label: 'Clock' },
    { name: 'Flag', component: Flag, label: 'Flag' },
    { name: 'Award', component: Award, label: 'Award' },
    { name: 'Heart', component: Heart, label: 'Heart' },
    { name: 'FileText', component: FileText, label: 'Document' },
    { name: 'Building', component: Building, label: 'Building' },
    { name: 'Globe', component: Globe, label: 'Globe' },
    { name: 'Users', component: Users, label: 'Users' },
    { name: 'Target', component: Target, label: 'Target' },
    { name: 'MapPin', component: MapPin, label: 'Location' },
    { name: 'TrendingUp', component: TrendingUp, label: 'Growth' },
    { name: 'Star', component: Star, label: 'Star' },
    { name: 'Lightbulb', component: Lightbulb, label: 'Innovation' },
    { name: 'Zap', component: Zap, label: 'Energy' },
    { name: 'Leaf', component: Leaf, label: 'Environment' },
    { name: 'BookOpen', component: BookOpen, label: 'Education' }
  ];

  const categories = [
    'Milestone',
    'Funding', 
    'Partnership',
    'Policy',
    'Infrastructure',
    'Achievement',
    'Research',
    'Community',
    'Technology',
    'Award',
    'Expansion',
    'Innovation'
  ];

  useEffect(() => {
    const loadTimelineItem = async () => {
      try {
        setLoading(true);
        const response = await timelineApi.getById(params.id);
        
        if (response.success) {
          // Ensure all required fields are present with defaults
          const itemData = {
            year: response.data.year || new Date().getFullYear().toString(),
            title: response.data.title || '',
            description: response.data.description || '',
            icon: response.data.icon || 'Clock',
            category: response.data.category || '',
            featured: response.data.featured || false,
            images: response.data.images || [''],
            location: response.data.location || '',
            impact: response.data.impact || '',
            participants: response.data.participants || [''],
            achievements: response.data.achievements || [''],
            tags: response.data.tags || ['']
          };
          
          setFormData(itemData);
        } else {
          console.error('Failed to fetch timeline item:', response.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading timeline item:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadTimelineItem();
    }
  }, [params.id]);

  // Helper functions for array management
  const addArrayItem = (arrayName, template = '') => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleArrayChange = (arrayName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean up arrays
      const cleanImages = formData.images.filter(img => img.trim() !== '');
      const cleanParticipants = formData.participants.filter(p => p.trim() !== '');
      const cleanAchievements = formData.achievements.filter(a => a.trim() !== '');
      const cleanTags = formData.tags.filter(tag => tag.trim() !== '');
      
      const submitData = {
        ...formData,
        images: cleanImages,
        participants: cleanParticipants,
        achievements: cleanAchievements,
        tags: cleanTags
      };

      // Call API to update timeline item
      const response = await timelineApi.update(params.id, submitData);
      
      if (response.success) {
        console.log('Timeline item updated successfully');
        router.push('/admin/timeline');
      } else {
        console.error('Failed to update timeline item:', response.message);
        alert('Failed to update timeline item: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating timeline item:', error);
      alert('Failed to update timeline item');
    } finally {
      setSaving(false);
    }
  };

  const getSelectedIcon = () => {
    const selected = iconOptions.find(option => option.name === formData.icon);
    return selected ? selected.component : Clock;
  };

  const SelectedIconComponent = getSelectedIcon();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
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
                  Edit Timeline Item
                </h1>
              </div>
            </div>
          </div>

          {/* Form - Same as Add form but with pre-filled data */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Year *
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2024"
                    min="1900"
                    max="2100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter timeline item title"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what happened during this timeline item"
                    required
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="w-4 h-4 inline mr-1" />
                    Key Impact
                  </label>
                  <input
                    type="text"
                    value={formData.impact}
                    onChange={(e) => handleInputChange('impact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief summary of the main impact"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
              <MultipleImageUpload
                label="Timeline Images"
                images={formData.images}
                onChange={(images) => handleInputChange('images', images)}
                maxImages={5}
              />
            </div>

            {/* Icon Selection */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Visual Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Icon *
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {iconOptions.map((option) => {
                      const IconComponent = option.component;
                      return (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => handleInputChange('icon', option.name)}
                          className={`p-3 border rounded-lg flex flex-col items-center space-y-1 transition-all ${
                            formData.icon === option.name
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="text-xs">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 flex items-center text-sm text-gray-900">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    Featured Item (will be highlighted in timeline)
                  </label>
                </div>
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
                      Update Timeline Item
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


