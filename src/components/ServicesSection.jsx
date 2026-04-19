import React from 'react';
import { Building, Zap, Cpu, Cloud, FileText, BookOpen, ArrowRight, Loader, Users, Target, Globe, TrendingUp, Star, Lightbulb, Heart, Shield, Settings } from "lucide-react";
import Link from 'next/link';
import { useServices } from '../hooks/useApi';
import { services as fallbackServices } from '../data/services';

export default function ServicesSection() {
  const { data: servicesResponse, loading, error } = useServices({ status: 'active', limit: 6 });
  const services = servicesResponse?.data || fallbackServices;

  // Icon mapping for dynamic icons
  const iconComponents = {
    Building, Zap, Cpu, Cloud, FileText, BookOpen, Users, Target, Globe, TrendingUp, Star, Lightbulb, Heart, Shield, Settings
  };

  // Default services as fallback
  const defaultServices = [
    {
      icon: 'Building',
      title: "Infrastructure Services",
      description: "We create innovative solutions for planning, designing, and constructing infrastructure that minimizes environmental impact, maximizes resource efficiency, and promotes energy efficiency.",
      slug: "infrastructure-services"
    },
    {
      icon: 'Zap',
      title: "Green Energy & Governance",
      description: "We promote renewable energy technology to drive rural development, reduce poverty, and support the preservation of functional ecosystems for long-term environmental health.",
      slug: "green-energy-governance"
    },
    {
      icon: 'Cpu',
      title: "Emerging Frontier Technologies",
      description: "We utilize cutting-edge technologies like drones to gain insights on complex problems, generating high-resolution images and data for effective sustainable development solutions.",
      slug: "emerging-frontier-technologies"
    },
    {
      icon: 'Cloud',
      title: "Disaster & Ecosystem",
      description: "We prioritize Disaster Risk Reduction and Climate Change Adaptation initiatives aimed at achieving sustainable development through nature-based solutions.",
      slug: "disaster-ecosystem"
    },
    {
      icon: 'FileText',
      title: "Policy & Institutional Development",
      description: "We focus on initiatives that reduce disaster risk and adapt to climate change while promoting sustainable development through technology and multidisciplinary approaches.",
      slug: "policy-institutional-development"
    },
    {
      icon: 'BookOpen',
      title: "Research, Training & Development",
      description: "We offer training on GIS mapping, UAV surveying, and data analysis, providing customized programs for students, researchers, and government officials.",
      slug: "research-training-development"
    },
  ];

  // Use API data if available, otherwise fallback to default
  const displayServices = services.length > 0 ? services : defaultServices;

  if (loading) {
    return (
      <section className="py-12 bg-white" id='services'>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1A365D] mb-3">Our Services</h2>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto">
              Sustainable solutions for a better future through innovative approaches to environmental challenges.
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-[#0396FF]" />
          </div>
        </div>
      </section>
    );
  }

  if (error && services.length === 0) {
    console.warn('Error loading services, using fallback data:', error);
  }

  return (
    <section className="py-12 bg-white" id='services'>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1A365D] mb-3">Our Services</h2>
          <p className="text-sm text-gray-600 max-w-3xl mx-auto">
            Sustainable solutions for a better future through innovative approaches to environmental challenges.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service, index) => {
            // Get the icon component - either from API data or default mapping
            const IconComponent = iconComponents[service.icon] || Building;
            const serviceSlug = service.slug || service.title?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and') || `service-${index + 1}`;

            return (
              <div
                key={service.id || index}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#0396FF] text-white rounded-full flex items-center justify-center mb-4 group-hover:bg-[#0396FF]/80 transition-colors duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1A365D] mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {service.short_description || service.description || 'Service description not available.'}
                </p>
                <Link
                  href={`/services/${serviceSlug}`}
                  className="text-[#B22234] font-medium inline-flex items-center group-hover:translate-x-2 transition-transform duration-300 cursor-pointer text-sm"
                >
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
