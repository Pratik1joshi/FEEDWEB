"use client"

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Building, Zap, Cpu, Cloud, FileText, BookOpen, ArrowRight, Check } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Service data with detailed information
const servicesData = [
  {
    icon: Building,
    slug: "infrastructure-services",
    title: "Infrastructure Services",
    description: "We create innovative solutions for planning, designing, and constructing infrastructure that minimizes environmental impact, maximizes resource efficiency, and promotes energy efficiency.",
    longDescription: `
      Forum for Energy and Environment Development (FEED) understands the importance of infrastructure in achieving sustainable development. We specialize in creating innovative solutions for planning, designing, and constructing infrastructure that minimizes its impact on the environment, maximizes resource efficiency, and promotes energy efficiency.
      
      At FEED, our approach ensures that the infrastructure we create supports the achievement of the Sustainable Development Goals (SDGs), including access to healthcare, education, energy, clean water, and sanitation, while also considering the long-term sustainability of our planet.
    `,
    image: "/services/infrastructure.jpg",
    features: [
      "Sustainable infrastructure planning and design",
      "Resource-efficient construction methodologies",
      "Energy-efficient infrastructure solutions",
      "Environmental impact minimization strategies",
      "Climate-resilient infrastructure development",
      "Infrastructure for SDGs achievement"
    ],
    caseStudies: [
      {
        title: "Climate Resilient Infrastructure for Social Transformation and Adaptation",
        description: "Developing infrastructure that can withstand climate change impacts while supporting community needs.",
        image: "/case-studies/infra-1.jpg"
      },
      {
        title: "Sustainable Urban Water Management System",
        description: "Creating integrated water management solutions for growing urban areas with minimal environmental impact.",
        image: "/case-studies/infra-2.jpg"
      }
    ]
  },
  {
    icon: Zap,
    slug: "green-energy-and-governance",
    title: "Green Energy & Governance",
    description: "We promote renewable energy technology to drive rural development, reduce poverty, and support the preservation of functional ecosystems for long-term environmental health.",
    longDescription: `
      We believe that energy, particularly renewable energy technology, plays a vital role in driving rural development and reducing poverty. By decentralizing energy systems and creating jobs through micro-enterprises, we can empower local communities and promote sustainable economic growth.
      
      Additionally, FEED focuses on green energy and supports the preservation of functional ecosystems, ensuring long-term environmental health and well-being. Our vision is to measure the impact of these efforts across three key dimensions: economic, ecological, and social, working towards a future where sustainable development is accessible to all.
    `,
    image: "/services/green-energy.jpg",
    features: [
      "Renewable energy implementation strategies",
      "Decentralized energy systems design",
      "Micro-enterprise development for job creation",
      "Community empowerment through energy access",
      "Ecosystem preservation frameworks",
      "Triple-bottom-line impact assessment"
    ],
    caseStudies: [
      {
        title: "Rural Solar Microgrids Project",
        description: "Implementing community-managed solar microgrids to provide reliable electricity to remote villages.",
        image: "/case-studies/energy-1.jpg"
      },
      {
        title: "Green Governance Framework for Mountain Communities",
        description: "Developing participatory governance models for sustainable resource management in highland regions.",
        image: "/case-studies/energy-2.jpg"
      }
    ]
  },
  {
    icon: Cpu,
    slug: "emerging-frontier-technologies",
    title: "Emerging Frontier Technologies",
    description: "We utilize cutting-edge technologies like drones to gain insights on complex problems, generating high-resolution images and data for effective sustainable development solutions.",
    longDescription: `
      At FEED, we utilize cutting-edge technologies like drones to gain a bird's eye view of complex problems and generate high-resolution images, digital terrain models, and surveillance data. Our team of experts, including innovators, designers, professionals, surveyors, and mappers, work together to plan, design, develop, and implement effective solutions.
      
      We analyze the collected data from multiple perspectives to provide valuable insights and promote sustainable development, improving people's lives, promoting prosperity, and protecting the planet.
    `,
    image: "/services/frontier-tech.jpg",
    features: [
      "Drone-based data collection and analysis",
      "High-resolution mapping and digital terrain modeling",
      "Remote sensing for environmental monitoring",
      "GIS-based spatial analysis",
      "AI and machine learning for predictive modeling",
      "Technology integration for sustainable development"
    ],
    caseStudies: [
      {
        title: "Drone-Based Disaster Risk Mapping",
        description: "Using UAV technology to create high-precision risk maps for vulnerable communities in mountainous regions.",
        image: "/case-studies/tech-1.jpg"
      },
      {
        title: "AI-Powered Early Warning System",
        description: "Developing machine learning algorithms to predict and alert communities about potential natural hazards.",
        image: "/case-studies/tech-2.jpg"
      }
    ]
  },
  {
    icon: Cloud,
    slug: "disaster-and-ecosystem",
    title: "Disaster & Ecosystem",
    description: "We prioritize Disaster Risk Reduction and Climate Change Adaptation initiatives aimed at achieving sustainable development through nature-based solutions.",
    longDescription: `
      We understand the importance of ecosystems in supporting human well-being. However, human activities have negatively impacted biodiversity and ecosystem function, leading to increased natural hazards and human-induced disasters.
      
      To address these challenges, FEED prioritizes Disaster Risk Reduction and Climate Change Adaptation initiatives aimed at achieving sustainable development. Our research and interventions focus on identifying and implementing nature-based solutions that incorporate technical analysis and multi-disciplinary approaches.
    `,
    image: "/services/disaster-ecosystem.jpg",
    features: [
      "Ecosystem-based disaster risk reduction",
      "Climate change adaptation strategies",
      "Nature-based solutions development",
      "Multi-hazard risk assessment",
      "Community-based disaster preparedness",
      "Ecosystem restoration for risk reduction"
    ],
    caseStudies: [
      {
        title: "Landslide Susceptibility Mapping in Aalital",
        description: "Comprehensive assessment and geotechnical analysis of landslide-prone areas to develop mitigation strategies.",
        image: "/case-studies/disaster-1.jpg"
      },
      {
        title: "Flood Hazard Modeling for Pokhara",
        description: "Developing flood models and risk reduction measures for urban watershed management.",
        image: "/case-studies/disaster-2.jpg"
      }
    ]
  },
  {
    icon: FileText,
    slug: "policy-and-institutional-development",
    title: "Policy & Institutional Development",
    description: "We focus on initiatives that reduce disaster risk and adapt to climate change while promoting sustainable development through technology and multidisciplinary approaches.",
    longDescription: `
      We recognize the crucial role that ecosystems play in ensuring human well-being. Unfortunately, human activities have harmed biodiversity and ecosystem function, resulting in increased natural hazards and man-made disasters.
      
      To tackle these challenges, FEED prioritizes initiatives that aim to reduce the risk of disasters and adapt to climate change, all while promoting sustainable development. Our research focuses on finding and implementing solutions that combine cutting-edge technology with a multidisciplinary approach, all while working closely with nature.
    `,
    image: "/services/policy.jpg",
    features: [
      "Policy analysis and development",
      "Institutional capacity building",
      "Climate change governance frameworks",
      "Disaster risk management policies",
      "Multi-stakeholder engagement processes",
      "Sustainable development policy integration"
    ],
    caseStudies: [
      {
        title: "Climate Policy Integration Framework",
        description: "Helping local governments mainstream climate considerations into sectoral policies and development plans.",
        image: "/case-studies/policy-1.jpg"
      },
      {
        title: "Institutional Capacity Assessment Tool",
        description: "Developing and implementing assessment methodologies to strengthen disaster management institutions.",
        image: "/case-studies/policy-2.jpg"
      }
    ]
  },
  {
    icon: BookOpen,
    slug: "research-training-and-development",
    title: "Research, Training & Development",
    description: "We offer training on GIS mapping, UAV surveying, and data analysis, providing customized programs for students, researchers, and government officials.",
    longDescription: `
      FEED emphasizes the importance of research and development in scientific decision-making. We offer training sessions on various topics such as GIS mapping, UAV surveying, Google Earth Engine, crowdsourcing, and geospatial data analysis.
      
      Additionally, we provide customized training programs for students, researchers, and government officials. We believe in empowering young practitioners and facilitating knowledge transfer between experienced professionals. Our goal is to build sustainable capacity and create ethical, value-driven solutions through collaborative research.
    `,
    image: "/services/research-training.jpg",
    features: [
      "GIS and spatial data analysis training",
      "UAV/drone surveying workshops",
      "Google Earth Engine applications",
      "Crowdsourcing methodologies",
      "Customized technical capacity building",
      "Knowledge management and transfer"
    ],
    caseStudies: [
      {
        title: "Drone Surveying Training Program",
        description: "Comprehensive training on drone operation, data collection, and analysis for environmental monitoring.",
        image: "/case-studies/training-1.jpg"
      },
      {
        title: "GIS for Disaster Risk Management",
        description: "Tailored training program for government officials on using GIS for disaster preparedness and response.",
        image: "/case-studies/training-2.jpg"
      }
    ]
  }
];

export default function ServiceDetailPage({ params }) {
  // Find the service by slug
  const service = servicesData.find(s => s.slug === params.slug);
  
  // If service not found, return 404
  if (!service) {
    notFound();
  }

  const ServiceIcon = service.icon;

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] w-full">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={"/photo-1617280137702-32e761be8b26.jpg"}
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
              {service.description}
            </p>
          </div>
        </section>

        {/* Service Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-8">Overview</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                {service.longDescription.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-8 text-center">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-[#0396FF]/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Check className="w-4 h-4 text-[#0396FF]" />
                    </div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-8 text-center">Case Studies</h2>
              <div className="grid md:grid-cols-2 gap-10">
                {service.caseStudies.map((caseStudy, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-300">
                    <div className="h-56 overflow-hidden relative">
                      <Image
                        src={caseStudy.image || "/placeholder.jpg"}
                        alt={caseStudy.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3">{caseStudy.title}</h3>
                      <p className="text-gray-600 mb-4">{caseStudy.description}</p>
                      <Link
                        href="#"
                        className="text-[#B22234] font-medium inline-flex items-center hover:translate-x-2 transition-transform duration-300"
                      >
                        Read Case Study <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
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
