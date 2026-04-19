import fs from 'fs';

const content = \'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import BasicRichTextEditor from '@/components/rich-text-editor/BasicRichTextEditor';
import { pagesApi, uploadApi } from '@/lib/api-services';
import { Trash2, Plus, Image as ImageIcon, Briefcase, Settings } from 'lucide-react';

export default function EditPageContent({ params }) {
  const router = useRouter();
  const slug = params.slug;
  const isAboutSection = slug === 'about-section';
  const isAboutPage = slug === 'about-page';
  const isCareers = slug === 'work-with-us';

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    image_url: '',
    meta_data: { gallery: [], jobs: [], stats: [], clients: [] },
    is_published: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const response = await pagesApi.getBySlug(slug);
      if (response.success && response.data) {
        setFormData({
          title: response.data.title || '',
          subtitle: response.data.subtitle || '',
          content: response.data.content || '',
          image_url: response.data.image_url || '',
          meta_data: response.data.meta_data || { gallery: [], jobs: [], stats: [], clients: [] },
          is_published: response.data.is_published !== false
        });
      }
    } catch (err) {
      console.error('Failed to load page content', err);
      setError('Failed to load content. It may not exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleImageUpload = async (e, targetArray = null, index = null, field = null) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      const res = await uploadApi.uploadImage(formDataUpload);
      
      if (res.success) {
        if (targetArray === 'gallery') {
          const newGallery = [...(formData.meta_data.gallery || [])];
          newGallery[index].src = res.url;
          setFormData(prev => ({ ...prev, meta_data: { ...prev.meta_data, gallery: newGallery }}));
        } else {
          setFormData(prev => ({ ...prev, image_url: res.url }));
        }
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      setError('Error uploading image');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await pagesApi.update(slug, formData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Error saving content');
      }
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setSaving(false);
    }
  };

  // --- JOB POSTINGS HANDLERS ---
  const addJob = () => {
    const newJob = { id: Date.now().toString(), title: '', type: 'Full-time', location: 'Kathmandu, Nepal', deadline: '', description: '' };
    setFormData(prev => ({
      ...prev,
      meta_data: { ...prev.meta_data, jobs: [...(prev.meta_data.jobs || []), newJob] }
    }));
  };

  const updateJob = (index, field, value) => {
    const newJobs = [...(formData.meta_data.jobs || [])];
    newJobs[index][field] = value;
    setFormData(prev => ({
      ...prev,
      meta_data: { ...prev.meta_data, jobs: newJobs }
    }));
  };

  const removeJob = (index) => {
    const newJobs = [...(formData.meta_data.jobs || [])];
    newJobs.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      meta_data: { ...prev.meta_data, jobs: newJobs }
    }));
  };

  // --- GALLERY HANDLERS ---
  const addGalleryImage = () => {
    const newImg = { src: '', title: '', description: '', span: 'md:col-span-1 md:row-span-1' };
    setFormData(prev => ({
      ...prev,
      meta_data: { ...prev.meta_data, gallery: [...(prev.meta_data.gallery || []), newImg] }
    }));
  };

  const updateGallery = (index, field, value) => {
    const newGallery = [...(formData.meta_data.gallery || [])];
    newGallery[index][field] = value;
    setFormData(prev => ({
      ...prev,
      meta_data: { ...prev.meta_data, gallery: newGallery }
    }));
  };

  const removeGallery = (index) => {
    const newGallery = [...(formData.meta_data.gallery || [])];
    newGallery.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      meta_data: { ...prev.meta_data, gallery: newGallery }
    }));
  };

  const pageTitle = {
    'about-section': 'About Us Section (Home Page)',
    'about-page': 'About Us Page',
    'work-with-us': 'Work With Us (Careers)',
    'know-us': 'Know Us Better Section'
  }[slug] || \Edit \\;

  if (loading) return <AdminLayout><div className="p-8 text-center text-gray-500">Loading editor...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        <div className="flex gap-3">
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-4 py-2 hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button onClick={handleSubmit} disabled={saving} className="bg-[#14234b] hover:bg-[#0f1b3b] text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {success && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md"><p className="text-green-700">Content updated successfully!</p></div>}
      {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md"><p className="text-red-700">{error}</p></div>}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-2">
        <button onClick={() => setActiveTab('general')} className={\px-4 py-3 font-medium text-sm border-b-2 flex items-center gap-2 \\}>
          <Settings size={16}/> General Info
        </button>
        
        {isCareers && (
          <>
            <button onClick={() => setActiveTab('jobs')} className={\px-4 py-3 font-medium text-sm border-b-2 flex items-center gap-2 \\}>
              <Briefcase size={16}/> Job Postings
            </button>
            <button onClick={() => setActiveTab('gallery')} className={\px-4 py-3 font-medium text-sm border-b-2 flex items-center gap-2 \\}>
              <ImageIcon size={16}/> Gallery Photos
            </button>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#14234b] focus:border-[#14234b]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (Optional)</label>
                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#14234b] focus:border-[#14234b]" />
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Featured Hero Image</label>
               <div className="flex items-center space-x-4">
                   {formData.image_url && (
                       <div className="relative w-48 h-32 rounded-lg overflow-hidden border bg-gray-50">
                           <img src={formData.image_url.startsWith('http') || formData.image_url.startsWith('/') ? formData.image_url : \http://localhost:5000\\} className="w-full h-full object-cover" />
                       </div>
                   )}
                   <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14234b] file:text-white" />
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Content</label>
              <div className="border rounded-md custom-quill-container bg-white" style={{ minHeight: '400px' }}>
                <BasicRichTextEditor value={formData.content} onChange={handleEditorChange} placeholder="Write the page content here..." />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" name="is_published" id="is_published" checked={formData.is_published} onChange={handleChange} className="h-4 w-4 text-[#14234b] rounded" />
                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700 font-medium">Published (Visible to public)</label>
              </div>
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && isCareers && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Current Job Openings</h3>
              <button type="button" onClick={addJob} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors">
                <Plus size={16}/> Add New Job Link
              </button>
            </div>
            
            {(!formData.meta_data.jobs || formData.meta_data.jobs.length === 0) ? (
              <div className="text-center p-8 bg-gray-50 border-2 border-dashed rounded-lg text-gray-500">
                No job postings currently active. Click the button above to add one.
              </div>
            ) : (
              <div className="space-y-6">
                {formData.meta_data.jobs.map((job, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50 relative">
                    <button type="button" onClick={() => removeJob(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-md flex items-center gap-1 transition-colors text-sm">
                      <Trash2 size={16}/> Remove
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-24">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
                        <input type="text" value={job.title} onChange={e => updateJob(index, 'title', e.target.value)} placeholder="e.g. Senior Researcher" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" value={job.location} onChange={e => updateJob(index, 'location', e.target.value)} placeholder="e.g. Kathmandu, Nepal" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select value={job.type} onChange={e => updateJob(index, 'type', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Consultant">Consultant</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Deadline Date</label>
                        <input type="date" value={job.deadline} onChange={e => updateJob(index, 'deadline', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Short Description</label>
                      <textarea value={job.description} onChange={e => updateJob(index, 'description', e.target.value)} placeholder="Brief requirements or job overview" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && isCareers && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Life at FEED Photo Gallery</h3>
              <button type="button" onClick={addGalleryImage} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors">
                <Plus size={16}/> Add Photo
              </button>
            </div>
            
            {(!formData.meta_data.gallery || formData.meta_data.gallery.length === 0) ? (
              <div className="text-center p-8 bg-gray-50 border-2 border-dashed rounded-lg text-gray-500">
                No gallery photos added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.meta_data.gallery.map((img, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4">
                    <div className="w-1/3 flex flex-col gap-2">
                       {img.src ? (
                           <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                               <img src={img.src.startsWith('http') || img.src.startsWith('/') ? img.src : \http://localhost:5000\\} className="w-full h-full object-cover" />
                           </div>
                       ) : (
                           <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center p-2">No Image</div>
                       )}
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery', index)} className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-200" />
                    </div>
                    
                    <div className="w-2/3 flex flex-col gap-3 relative">
                      <button type="button" onClick={() => removeGallery(index)} className="absolute top-0 right-0 text-red-500 hover:bg-red-100 p-1 rounded transition-colors">
                        <Trash2 size={16}/>
                      </button>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Overlay Title</label>
                        <input type="text" value={img.title} onChange={e => updateGallery(index, 'title', e.target.value)} placeholder="e.g. Team Building" className="w-[85%] px-2 py-1.5 border border-gray-300 rounded text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Sub-text</label>
                        <input type="text" value={img.description} onChange={e => updateGallery(index, 'description', e.target.value)} placeholder="e.g. Growing together..." className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Grid Layout Span (CSS)</label>
                        <select value={img.span} onChange={e => updateGallery(index, 'span', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                          <option value="md:col-span-1 md:row-span-1">1x1 Current (Small)</option>
                          <option value="md:col-span-2 md:row-span-1">2x1 Wide</option>
                          <option value="md:col-span-1 md:row-span-2">1x2 Tall</option>
                          <option value="md:col-span-2 md:row-span-2">2x2 Large Block</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
\;

fs.writeFileSync('app/admin/pages/[slug]/page.jsx', content);
console.log('Slug Admin built');
