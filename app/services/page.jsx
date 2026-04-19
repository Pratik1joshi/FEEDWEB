"use client"

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import HeroBanner from '../../components/HeroBanner'
import RichContentRenderer from '../../components/RichContentRenderer'
import { servicesApi } from '../../src/lib/api'
import { Building, Zap, Cpu, Cloud, FileText, BookOpen, ArrowRight, Loader, Users, Target, Globe, TrendingUp, Star, Lightbulb, Heart, Shield, Settings, Briefcase } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping for dynamic icons
  const iconComponents = {
    Building, Zap, Cpu, Cloud, FileText, BookOpen, Users, Target, Globe, TrendingUp, Star, Lightbulb, Heart, Shield, Settings
  };

  // Static fallback services
  const fallbackServices = [
    {
      id: 1,
      title: "Infrastructure Services",
      description: "We create innovative solutions for planning, designing, and constructing infrastructure that minimizes environmental impact, maximizes resource efficiency, and promotes energy efficiency.",
      icon: 'Building',
      slug: 'infrastructure-services'
    },
    {
      id: 2,
      title: "Green Energy & Governance",
      description: "We promote renewable energy technology to drive rural development, reduce poverty, and support the preservation of functional ecosystems for long-term environmental health.",
      icon: 'Zap',
      slug: 'green-energy-governance'
    },
    {
      id: 3,
      title: "Emerging Frontier Technologies",
      description: "We utilize cutting-edge technologies like drones to gain insights on complex problems, generating high-resolution images and data for effective sustainable development solutions.",
      icon: 'Cpu',
      slug: 'emerging-frontier-technologies'
    },
    {
      id: 4,
      title: "Disaster & Ecosystem",
      description: "We prioritize Disaster Risk Reduction and Climate Change Adaptation initiatives aimed at achieving sustainable development through nature-based solutions.",
      icon: 'Cloud',
      slug: 'disaster-ecosystem'
    },
    {
      id: 5,
      title: "Policy & Institutional Development",
      description: "We focus on initiatives that reduce disaster risk and adapt to climate change while promoting sustainable development through technology and multidisciplinary approaches.",
      icon: 'FileText',
      slug: 'policy-institutional-development'
    },
    {
      id: 6,
      title: "Research, Training & Development",
      description: "We offer training on GIS mapping, UAV surveying, Google Earth Engine, crowdsourcing, and geospatial data analysis, providing customized programs for students, researchers, and government officials.",
      icon: 'BookOpen',
      slug: 'research-training-development'
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await servicesApi.getAll({ status: 'active' });
        
        if (response.success && response.data) {
          setServices(response.data);
        } else {
          console.warn('Failed to fetch services, using fallback data');
          setServices(fallbackServices);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
        setServices(fallbackServices); // Use fallback data on error
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <HeroBanner
          title="Our Services"
          description="Innovative solutions for sustainable development and environmental challenges"
          badgeText="Excellence in Service"
          badgeIcon={Briefcase}
        />

        {/* Services Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-[#0396FF] mb-6">What We Offer</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At FEED, we provide a comprehensive suite of services designed to address complex 
                environmental and development challenges. Our multidisciplinary team of experts 
                brings decades of experience and innovative approaches to every project.
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-[#0396FF]" />
                  <p className="text-gray-600">Loading services...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <p className="text-gray-600">Showing available services</p>
              </div>
            ) : null}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {services.map((service, index) => {
                const ServiceIcon = iconComponents[service.icon] || Building;
                const serviceSlug = service.slug || service.title?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and') || `service-${service.id}`;
                
                return (
                  <div
                    key={service.id || index}
                    className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <Image
                        src={service.image || "/photo-1617280137702-32e761be8b26.jpg"}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-8">
                      <div className="w-16 h-16 bg-[#0396FF] text-white rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0396FF]/80 transition-colors duration-300">
                        <ServiceIcon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-4">{service.title}</h3>
                      <div className="text-gray-600 mb-6">
                        <RichContentRenderer 
                          content={service.short_description || service.description}
                          maxHeight="96px"
                        />
                      </div>
                      <Link
                        href={`/services/${serviceSlug}`}
                        className="text-[#B22234] font-medium inline-flex items-center group-hover:translate-x-2 transition-transform duration-300"
                      >
                        Learn More <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-[#0396FF]/10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-6">Ready to Work Together?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Whether you need consulting services, technical expertise, or collaborative research, 
                our team is ready to help you achieve your sustainability goals.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
