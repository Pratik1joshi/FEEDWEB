'use client';
import BasicRichTextEditor from '@/components/rich-text-editor/BasicRichTextEditor';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Trophy,
  Calendar,
  Award,
  Star,
  Users,
  Download,
  X
} from 'lucide-react';

export default function AddAward() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    recipient: '',
    organization: '',
    awardedBy: '',
    description: '',
    significance: '',
    awardDate: '',
    location: '',
    status: 'received',
    featured: false,
    image: '',
    certificateUrl: '',
    pressReleaseUrl: '',
    amount: '',
    currency: 'NPR',
    tags: [''],
    criteria: [''],
    impacts: ['']
  });

  const categories = [
    'Environmental Excellence',
    'Research Innovation',
    'Community Impact',
    'Sustainability Leadership',
    'Climate Action',
    'Biodiversity Conservation',
    'Academic Achievement',
    'Policy Contribution',
    'International Recognition',
    'Lifetime Achievement'
  ];

  const statusOptions = [
    { value: 'received', label: 'Received' },
    { value: 'nominated', label: 'Nominated' },
    { value: 'pending', label: 'Pending' },
    { value: 'declined', label: 'Declined' }
  ];

  const currencies = [
    'NPR', 'USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'
  ];

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
      // Filter out empty array items and clean data
      const cleanedData = {
        ...formData,
        id: Date.now(), // Generate ID for demo
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        criteria: formData.criteria.filter(criterion => criterion.trim() !== ''),
        impacts: formData.impacts.filter(impact => impact.trim() !== '')
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app: await fetch('/api/awards', { method: 'POST', body: JSON.stringify(cleanedData) })
      console.log('New award:', cleanedData);
      
      router.push('/admin/awards');
    } catch (error) {
      console.error('Error adding award:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Add Award">
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
                  Add New Award
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Trophy className="w-4 h-4 inline mr-1" />
                    Award Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter award title"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Recipient
                  </label>
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => handleInputChange('recipient', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Person or team who received the award"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization/Institution
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Recipient's organization"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Awarded By
                  </label>
                  <input
                    type="text"
                    value={formData.awardedBy}
                    onChange={(e) => handleInputChange('awardedBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Organization that gave the award"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Award Date
                  </label>
                  <input
                    type="date"
                    value={formData.awardDate}
                    onChange={(e) => handleInputChange('awardDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
              </div>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the award and what it recognizes"
              />
            </div>

            {/* Significance */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Significance & Achievement
              </label>
              <textarea
                value={formData.significance}
                onChange={(e) => handleInputChange('significance', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Why this award is significant and what achievement it represents"
              />
            </div>

            {/* Award Amount */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Award Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Award Amount (if applicable)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Featured Award
                  </label>
                </div>
              </div>
            </div>

            {/* Criteria */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Award Criteria</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('criteria')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Criterion
                </button>
              </div>
              <div className="space-y-3">
                {formData.criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={criterion}
                      onChange={(e) => handleArrayChange('criteria', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Award criterion or requirement"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('criteria', index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.criteria.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Impacts */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Impact & Outcomes</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('impacts')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Impact
                </button>
              </div>
              <div className="space-y-3">
                {formData.impacts.map((impact, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={impact}
                      onChange={(e) => handleArrayChange('impacts', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Impact or outcome of this achievement"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('impacts', index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.impacts.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('tags')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Tag
                </button>
              </div>
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tag keyword"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={formData.tags.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Media & Links */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Media & Documentation</h3>
              <div className="space-y-6">
                <FileUpload
                  label="Award Certificate or Image"
                  uploadType="image"
                  value={formData.image}
                  onChange={(value) => handleInputChange('image', value)}
                  placeholder="https://example.com/award-certificate.jpg"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate URL
                  </label>
                  <input
                    type="url"
                    value={formData.certificateUrl}
                    onChange={(e) => handleInputChange('certificateUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/certificate.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Press Release URL
                  </label>
                  <input
                    type="url"
                    value={formData.pressReleaseUrl}
                    onChange={(e) => handleInputChange('pressReleaseUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/press-release"
                  />
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
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Award
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
