'use client';
import { useEffect, useState } from 'react';
import { projectsApi } from '../src/lib/api-services';
import { useApi } from '../src/hooks/useApi';

const FeaturedProjects = () => {
  const { data: projectsData, loading, error } = useApi(() => projectsApi.getFeatured(6));
  
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="text-center text-red-600">
            <p>Failed to load projects: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  const projects = projectsData?.data || [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most impactful initiatives in renewable energy, rural development, 
            and sustainable technology across Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {project.images && project.images.length > 0 ? (
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">{project.category}</p>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {project.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.excerpt || project.description}
                </p>
                
                {project.location && (
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {project.location}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {project.budget && (
                      <span className="mr-4">Budget: {project.budget}</span>
                    )}
                  </div>
                  <button 
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                    onClick={() => window.location.href = `/projects/${project.slug}`}
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button 
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
            onClick={() => window.location.href = '/projects'}
          >
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;