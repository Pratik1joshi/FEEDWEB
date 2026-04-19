'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { pagesApi } from '@/lib/api-services';

export default function PagesAdmin() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await pagesApi.getAll();
      if (response.success) {
        setPages(response.data);
      }
    } catch (error) {
      console.error('Failed to parse pages', error);
    } finally {
      setLoading(false);
    }
  };

  const pageNames = {
    'hero-section': 'Hero Section (Home Page)',
    'about-section': 'About Us Section (Home Page)',
    'services-section': 'Services Section (Home Page)',
    'events-section': 'Events Section (Home Page)',
    'media-section': 'Media Section (Home Page)',
    'publications-section': 'Publications Section (Home Page)',
    'timeline-section': 'Timeline Section (Home Page)',
    'working-areas-section': 'Working Areas Section (Home Page)',
    'contact-section': 'Contact Section (Home Page)',
    'newsletter-section': 'Newsletter Section (Home Page)',
    'work-with-us': 'Work With Us Section',
    'know-us': 'Know Us Better Section',
    'projects-section': 'Projects Section (Home Page)'
  };

  const requiredSlugs = [
    'hero-section',
    'about-section',
    'projects-section',
    'services-section',
    'events-section',
    'media-section',
    'publications-section',
    'timeline-section',
    'working-areas-section',
    'contact-section',
    'newsletter-section',
    'work-with-us',
    'know-us'
  ];
  const nonLegacyPages = pages.filter((page) => page.slug !== 'about-page');

  const requiredPages = requiredSlugs.map((slug) => {
    const found = nonLegacyPages.find((page) => page.slug === slug);
    if (found) return found;

    return {
      id: `virtual-${slug}`,
      slug,
      title: pageNames[slug] || slug,
      updated_at: null,
    };
  });

  const additionalPages = nonLegacyPages.filter((page) => !requiredSlugs.includes(page.slug));
  const visiblePages = [...requiredPages, ...additionalPages];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Static Pages & Sections Content</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading Content Blocks...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Section Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Identifier Slug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last Updated</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visiblePages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pageNames[page.slug] || page.title || page.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {page.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : 'Not created yet'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/pages/${page.slug}`}
                      className="inline-flex items-center px-3 py-1 bg-[#14234b]/10 text-[#14234b] hover:bg-[#14234b] hover:text-white rounded-md transition-colors"
                    >
                      Edit Content
                    </Link>
                  </td>
                </tr>
              ))}
              {visiblePages.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                    No dynamic content sections found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
