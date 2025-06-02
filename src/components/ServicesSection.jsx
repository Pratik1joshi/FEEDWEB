import React from 'react';
import { Building, Zap, Cpu, Cloud, FileText, BookOpen, ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function ServicesSection() {
  const services = [
    {
      icon: Building,
      title: "Infrastructure Services",
      description:
        "We create innovative solutions for planning, designing, and constructing infrastructure that minimizes environmental impact, maximizes resource efficiency, and promotes energy efficiency.",
    },
    {
      icon: Zap,
      title: "Green Energy & Governance",
      description:
        "We promote renewable energy technology to drive rural development, reduce poverty, and support the preservation of functional ecosystems for long-term environmental health.",
    },
    {
      icon: Cpu,
      title: "Emerging Frontier Technologies",
      description:
        "We utilize cutting-edge technologies like drones to gain insights on complex problems, generating high-resolution images and data for effective sustainable development solutions.",
    },
    {
      icon: Cloud,
      title: "Disaster & Ecosystem",
      description:
        "We prioritize Disaster Risk Reduction and Climate Change Adaptation initiatives aimed at achieving sustainable development through nature-based solutions.",
    },
    {
      icon: FileText,
      title: "Policy & Institutional Development",
      description:
        "We focus on initiatives that reduce disaster risk and adapt to climate change while promoting sustainable development through technology and multidisciplinary approaches.",
    },
    {
      icon: BookOpen,
      title: "Research, Training & Development",
      description:
        "We offer training on GIS mapping, UAV surveying, and data analysis, providing customized programs for students, researchers, and government officials.",
    },
  ];

  return (
    <section className="py-20 bg-white" id='services'>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sustainable solutions for a better future through innovative approaches to environmental challenges.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-[#0396FF] text-white rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0396FF]/80 transition-colors duration-300">
                <service.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <Link
                href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                className="text-[#B22234] font-medium inline-flex items-center group-hover:translate-x-2 transition-transform duration-300 cursor-pointer"
              >
                Read More <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
