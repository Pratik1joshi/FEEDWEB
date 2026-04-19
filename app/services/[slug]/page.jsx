"use client";

import React, { useState, useEffect } from 'react'
import { servicesApi } from '../../../src/lib/api';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import RichContentRenderer from '../../../components/RichContentRenderer';
import { 
  Building, 
  Zap, 
  Cpu, 
  Cloud, 
  FileText, 
  BookOpen, 
  ArrowRight, 
  Check, 
  Loader,
  Leaf,
  Users,
  Target,
  Globe,
  TrendingUp,
  Star,
  Lightbulb,
  Heart,
  Shield,
  Settings
} from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
// import { servicesApi } from '@/lib/api'

export default function ServiceDetailPage({ params }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping for dynamic icons
  const iconComponents = {
    Building, Zap, Cpu, Cloud, FileText, BookOpen, Leaf, Users, Target, Globe, TrendingUp, Star, Lightbulb, Heart, Shield, Settings
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await servicesApi.getById(params.slug);

        if (response.success) {
          setService(response.data);
        } else {
          setError('Service not found');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchService();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-[#0396FF]" />
              <p className="text-gray-600">Loading service...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !service) {
    return (
      <>
        <Header />
        <main>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
              <p className="text-gray-600 mb-8">{error || 'The service you are looking for does not exist.'}</p>
              <Link
                href="/services"
                className="inline-flex items-center bg-[#0396FF] text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300"
              >
                View All Services
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const ServiceIcon = iconComponents[service.icon] || Building;

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] w-full">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={service.image || "/photo-1617280137702-32e761be8b26.jpg"}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-6 pt-20">
            <div className="w-20 h-20 bg-[#0396FF] text-white rounded-full flex items-center justify-center mb-6">
              <ServiceIcon className="w-10 h-10" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-center">
              {service.title}
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl opacity-90">
              <RichContentRenderer content={service.description} />
            </p>
          </div>
        </section>

        {/* Service Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Image Side */}
                <div className="order-2 md:order-1">
                  <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={service.image || "/photo-1617280137702-32e761be8b26.jpg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content Side */}
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-6">Overview</h2>
                  <div className="prose prose-lg max-w-none text-gray-600 mb-8">
                    {service.long_description ? (
                      <RichContentRenderer content={service.long_description} />
                    ) : (
                      <RichContentRenderer content={service.description} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-12 text-center">Key Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {service.features && service.features.length > 0 ? (
                  service.features.map((feature, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-[#0396FF]/10 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-6 h-6 text-[#0396FF]" />
                      </div>
                      <p className="text-gray-700 font-medium">{feature}</p>
                    </div>
                  ))
                ) : (
                  // Fallback features if none are provided
                  [
                    "Sustainable infrastructure planning and design",
                    "Resource-efficient construction methodologies",
                    "Energy-efficient infrastructure solutions",
                    "Environmental impact minimization strategies",
                    "Climate-resilient infrastructure development",
                    "Infrastructure for SDGs achievement"
                  ].map((feature, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-[#0396FF]/10 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-6 h-6 text-[#0396FF]" />
                      </div>
                      <p className="text-gray-700 font-medium">{feature}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#0396FF]/10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-6">Interested in Our {service.title}?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Contact us today to discuss how we can help you achieve your sustainability goals through our expertise in {service.title.toLowerCase()}.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium"
                >
                  Contact Us
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center border-2 border-[#0396FF] text-[#0396FF] px-8 py-3 rounded-full hover:bg-[#0396FF] hover:text-white transition-all duration-300 text-lg font-medium"
                >
                  Explore Other Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
