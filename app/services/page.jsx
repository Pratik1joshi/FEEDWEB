"use client"

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Building, Zap, Cpu, Cloud, FileText, BookOpen, ArrowRight } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function ServicesPage() {
  const services = [
    {
      icon: Building,
      title: "Infrastructure Services",
      description:
        "We create innovative solutions for planning, designing, and constructing infrastructure that minimizes environmental impact, maximizes resource efficiency, and promotes energy efficiency.",
      longDescription: `
        Our Infrastructure Services division specializes in sustainable infrastructure solutions that balance environmental responsibility with community needs. We offer comprehensive planning, design, and implementation services for a wide range of infrastructure projects.
        
        Our approach ensures that infrastructure development supports the achievement of the Sustainable Development Goals (SDGs), including access to healthcare, education, energy, clean water, and sanitation, while considering the long-term sustainability of our planet.
        
        Our team of experienced engineers and planners work closely with clients to create infrastructure that is resilient, efficient, and environmentally sound.
      `,
      image: "/services/infrastructure.jpg"
    },
    {
      icon: Zap,
      title: "Green Energy & Governance",
      description:
        "We promote renewable energy technology to drive rural development, reduce poverty, and support the preservation of functional ecosystems for long-term environmental health.",
      longDescription: `
        Our Green Energy & Governance services focus on renewable energy solutions that empower local communities and promote sustainable economic growth. We believe that energy, particularly renewable energy technology, plays a vital role in driving rural development and reducing poverty.
        
        By decentralizing energy systems and creating jobs through micro-enterprises, we empower local communities while reducing environmental impact. Our experts work on projects ranging from small-scale solar installations to community-based renewable energy initiatives.
        
        We measure impact across three key dimensions: economic, ecological, and social, working towards a future where sustainable development is accessible to all.
      `,
      image: "/services/green-energy.jpg"
    },
    {
      icon: Cpu,
      title: "Emerging Frontier Technologies",
      description:
        "We utilize cutting-edge technologies like drones to gain insights on complex problems, generating high-resolution images and data for effective sustainable development solutions.",
      longDescription: `
        Our Emerging Frontier Technologies division leverages the latest technological innovations to address complex environmental and development challenges. We specialize in utilizing drones, remote sensing, AI, and other advanced technologies to collect data, monitor environmental changes, and develop innovative solutions.
        
        Our team of experts, including innovators, designers, professionals, surveyors, and mappers, work together to plan, design, develop, and implement effective technology-driven solutions for sustainable development.
        
        We analyze collected data from multiple perspectives to provide valuable insights that improve people's lives, promote prosperity, and protect the planet.
      `,
      image: "/services/frontier-tech.jpg"
    },
    {
      icon: Cloud,
      title: "Disaster & Ecosystem",
      description:
        "We prioritize Disaster Risk Reduction and Climate Change Adaptation initiatives aimed at achieving sustainable development through nature-based solutions.",
      longDescription: `
        Our Disaster & Ecosystem services focus on understanding and mitigating the risks associated with natural hazards and climate change. We recognize that human activities have negatively impacted biodiversity and ecosystem function, leading to increased natural hazards and human-induced disasters.
        
        Our team of specialists develops comprehensive risk assessment frameworks, early warning systems, and nature-based solutions that incorporate technical analysis and multi-disciplinary approaches. We work with communities, governments, and international organizations to build resilience to disasters and climate change.
        
        Our research and interventions focus on identifying and implementing solutions that work with nature rather than against it.
      `,
      image: "/services/disaster-ecosystem.jpg"
    },
    {
      icon: FileText,
      title: "Policy & Institutional Development",
      description:
        "We focus on initiatives that reduce disaster risk and adapt to climate change while promoting sustainable development through technology and multidisciplinary approaches.",
      longDescription: `
        Our Policy & Institutional Development services help organizations and governments create effective frameworks for sustainable development and environmental protection. We provide policy analysis, institutional capacity building, and governance solutions tailored to the specific needs of our clients.
        
        We recognize the crucial role that well-designed policies and strong institutions play in ensuring human well-being and environmental sustainability. Our experts work closely with stakeholders to develop and implement policies that integrate scientific knowledge with practical considerations.
        
        Our approach combines cutting-edge analysis with a multidisciplinary perspective, all while working closely with nature and respecting local contexts.
      `,
      image: "/services/policy.jpg"
    },
    {
      icon: BookOpen,
      title: "Research, Training & Development",
      description:
        "We offer training on GIS mapping, UAV surveying, Google Earth Engine, crowdsourcing, and geospatial data analysis, providing customized programs for students, researchers, and government officials.",
      longDescription: `
        Our Research, Training & Development division is committed to building capacity and advancing knowledge in sustainable development practices. We emphasize the importance of evidence-based decision-making and continuous learning in addressing environmental challenges.
        
        We offer specialized training sessions on various topics such as GIS mapping, UAV surveying, Google Earth Engine, crowdsourcing, and geospatial data analysis. Additionally, we develop customized training programs for students, researchers, and government officials.
        
        We believe in empowering young practitioners and facilitating knowledge transfer between experienced professionals. Our goal is to build sustainable capacity and create ethical, value-driven solutions through collaborative research.
      `,
      image: "/services/research-training.jpg"
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[40vh] min-h-[400px] w-full">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/services-hero.jpg"
              alt="FEED Services"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
          </div>
          
          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-6 pt-20">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-center">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl opacity-90">
              Innovative solutions for sustainable development and environmental challenges
            </p>
          </div>
        </section>

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <Image
                      src={service.image || "/placeholder.jpg"}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-8">
                    <div className="w-16 h-16 bg-[#0396FF] text-white rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0396FF]/80 transition-colors duration-300">
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <Link
                      href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                      className="text-[#B22234] font-medium inline-flex items-center group-hover:translate-x-2 transition-transform duration-300"
                    >
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
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
