"use client"

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MapPin, Calendar, Users, CheckCircle, ArrowRight, BarChart2, Target, Clock, AlertTriangle, Award } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default function ProjectDetailPage({ params }) {
  // Project data (in a real app, this would come from an API or database)
  const projects = [
    {
      slug: "solar-integration-network",
      title: "Solar Integration Network",
      description: "Developing smart grid solutions for optimal integration of distributed solar resources across multiple regions.",
      fullDescription: `
        The Solar Integration Network project is a groundbreaking initiative aimed at creating a robust infrastructure for effectively integrating distributed solar energy resources into existing power grids. 
        
        As solar adoption grows exponentially, power grids face unprecedented challenges in managing the variable nature of solar generation. This project addresses these challenges through a comprehensive approach combining advanced hardware, software solutions, and innovative grid management techniques.
        
        Our team of electrical engineers, software developers, and energy policy experts has developed a suite of technologies that enable real-time monitoring and control of distributed solar assets, predictive algorithms for solar generation forecasting, and automated grid balancing mechanisms. These solutions collectively enhance grid stability, reduce curtailment of renewable energy, and maximize the economic and environmental benefits of solar power.
        
        Initial implementations in California have demonstrated a 27% improvement in solar integration capacity and a 15% reduction in associated grid management costs.
      `,
      images: [
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1509390144018-4b8def08f716?w=600&h=400&fit=crop"
      ],
      category: "Renewable Energy",
      location: "California, USA",
      duration: "18 months",
      teamSize: "12 experts",
      status: "In Progress",
      clientPartners: "California Energy Commission, SolarTech Industries, Pacific Grid Operators",
      startDate: "March 2023",
      completionDate: "September 2024",
      budget: "$2.4 million",
      goals: [
        "Increase grid capacity for solar integration by 30%",
        "Reduce renewable energy curtailment by 25%",
        "Develop scalable solutions applicable to diverse grid environments",
        "Create open standards for solar grid integration"
      ],
      outcomes: [
        "Advanced forecasting algorithm with 92% accuracy",
        "Real-time monitoring system deployed across 1,200 solar installations",
        "Grid stabilization technology tested in three utility districts",
        "Open-source software toolkit for utility operators"
      ],
      challenges: [
        "Integrating with legacy grid infrastructure",
        "Ensuring cybersecurity of distributed control systems",
        "Adapting to varying regulatory environments",
        "Balancing competing grid priorities"
      ],
      keyMetrics: [
        { label: "Solar Integration Capacity", value: "+27%" },
        { label: "Grid Management Cost Reduction", value: "15%" },
        { label: "Renewable Energy Curtailment", value: "-22%" },
        { label: "System Reliability Improvement", value: "8.5%" }
      ],
      relatedProjects: ["clean-energy-access-initiative", "carbon-capture-innovation"]
    },
    {
      slug: "water-conservation-initiative",
      title: "Water Conservation Initiative",
      description: "Implementing advanced technologies to reduce water waste in agricultural sectors through AI-driven monitoring.",
      fullDescription: `
        The Water Conservation Initiative represents a transformative approach to agricultural water management, leveraging cutting-edge technology to address one of the most pressing challenges in modern farming: efficient water usage.
        
        Agriculture consumes approximately 70% of the world's freshwater resources, yet traditional irrigation methods often lead to significant waste. Our project introduces an intelligent water management system that combines IoT sensors, machine learning algorithms, and automated irrigation controls to optimize water usage based on actual crop needs, soil conditions, and weather patterns.
        
        The system features soil moisture sensors deployed across agricultural fields, weather stations providing localized meteorological data, and crop-specific water requirement models. These components feed into a central AI platform that generates precise irrigation schedules, delivering water only when and where it's needed.
        
        Implementation in pilot sites across Arizona has demonstrated water savings of 25-40% while maintaining or improving crop yields, proving that conservation and productivity can go hand in hand.
      `,
      images: [
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1583435328763-6b229393f09c?w=600&h=400&fit=crop"
      ],
      category: "Water Management",
      location: "Arizona, USA",
      duration: "24 months",
      teamSize: "8 specialists",
      status: "Completed",
      clientPartners: "Arizona Department of Water Resources, Southwest Agricultural Cooperative, AgTech Solutions",
      startDate: "January 2022",
      completionDate: "December 2023",
      budget: "$1.8 million",
      goals: [
        "Reduce agricultural water consumption by 30% without affecting yields",
        "Develop cost-effective monitoring solutions accessible to small-scale farmers",
        "Create a replicable model for water-stressed agricultural regions",
        "Establish data-driven best practices for irrigation management"
      ],
      outcomes: [
        "Water usage reduction of 25-40% across pilot sites",
        "AI prediction model with 94% accuracy for crop water needs",
        "Deployment of 3,500+ low-cost soil moisture sensors",
        "Comprehensive best practices guide for smart irrigation"
      ],
      challenges: [
        "Ensuring technology adoption among traditional farming communities",
        "Developing resilient sensors for harsh agricultural environments",
        "Creating intuitive interfaces for varying levels of technical literacy",
        "Calibrating models for diverse crop types and soil conditions"
      ],
      keyMetrics: [
        { label: "Water Consumption Reduction", value: "32%" },
        { label: "Crop Yield Change", value: "+5%" },
        { label: "Energy Savings from Reduced Pumping", value: "28%" },
        { label: "Return on Investment Period", value: "14 months" }
      ],
      relatedProjects: ["sustainable-agriculture-development", "urban-sustainability-framework"]
    },
    {
      slug: "urban-sustainability-framework",
      title: "Urban Sustainability Framework",
      description: "Creating comprehensive guidelines for cities to reduce emissions while improving quality of life for residents.",
      fullDescription: `
        The Urban Sustainability Framework provides city planners and policymakers with a structured approach to transforming urban environments into more sustainable, resilient, and livable spaces.
        
        As cities continue to grow rapidly worldwide, they face critical challenges related to resource consumption, pollution, climate change vulnerability, and quality of life. Our framework offers a systematic methodology for addressing these challenges while promoting equitable development and economic prosperity.
        
        The framework consists of six interconnected modules: energy systems, transportation networks, building standards, water and waste management, green infrastructure, and community engagement. Each module contains assessment tools, performance indicators, policy templates, and implementation strategies tailored to different urban contexts.
        
        Through pilot implementations in Seattle and surrounding municipalities, the framework has demonstrated significant benefits, including reduced emissions, improved air quality, enhanced mobility options, and strengthened community resilience.
      `,
      images: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=600&h=400&fit=crop"
      ],
      category: "Urban Planning",
      location: "Seattle, WA",
      duration: "12 months",
      teamSize: "15 planners",
      status: "In Progress",
      clientPartners: "Seattle Office of Sustainability & Environment, Urban Innovation Alliance, Regional Planning Consortium",
      startDate: "August 2023",
      completionDate: "July 2024",
      budget: "$1.5 million",
      goals: [
        "Develop adaptable sustainability metrics for diverse urban environments",
        "Create policy toolkits for rapid implementation of sustainable practices",
        "Establish cross-sector collaboration frameworks for coordinated action",
        "Design public engagement strategies for inclusive sustainability planning"
      ],
      outcomes: [
        "Comprehensive assessment toolkit adopted by 5 municipalities",
        "25+ policy recommendations implemented across pilot cities",
        "Integrated performance dashboard tracking 40+ sustainability indicators",
        "Community engagement platform with 3,000+ active participants"
      ],
      challenges: [
        "Reconciling competing priorities among stakeholders",
        "Adapting framework to cities with limited resources",
        "Measuring long-term impacts of policy interventions",
        "Ensuring equity considerations across all framework components"
      ],
      keyMetrics: [
        { label: "GHG Emissions Reduction Potential", value: "22%" },
        { label: "Public Space Accessibility Increase", value: "35%" },
        { label: "Resource Efficiency Improvement", value: "18%" },
        { label: "Climate Resilience Score Improvement", value: "42%" }
      ],
      relatedProjects: ["coastal-resilience-project", "carbon-capture-innovation"]
    },
    {
      slug: "carbon-capture-innovation",
      title: "Carbon Capture Innovation",
      description: "Researching next-generation technologies for efficient carbon dioxide removal and storage solutions.",
      fullDescription: `
        Our Carbon Capture Innovation project explores cutting-edge approaches to removing carbon dioxide from the atmosphere and industrial emissions, addressing one of the most critical challenges in climate change mitigation.
        
        Despite advances in renewable energy and efficiency, carbon capture, utilization, and storage (CCUS) technologies remain essential for meeting global climate targets. Our research program focuses on dramatically improving the efficiency, cost-effectiveness, and scalability of these technologies.
        
        Key research streams include novel sorbent materials with enhanced CO2 selectivity, biomimetic capture mechanisms inspired by natural processes, modular and scalable capture systems for diverse applications, and innovative approaches to carbon mineralization and utilization.
        
        Through laboratory testing, pilot demonstrations, and techno-economic analysis, we're accelerating the development of solutions that can be deployed across various sectors, from power generation to heavy industry, creating pathways to economically viable carbon management at scale.
      `,
      images: [
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1597300804958-abe6fdaab9b7?w=600&h=400&fit=crop"
      ],
      category: "Climate Action",
      location: "Texas, USA",
      duration: "30 months",
      teamSize: "20 researchers",
      status: "Research Phase",
      clientPartners: "Department of Energy, Climate Innovation Fund, Texas Carbon Alliance, Global CCUS Research Network",
      startDate: "April 2023",
      completionDate: "October 2025",
      budget: "$3.7 million",
      goals: [
        "Develop capture materials with >50% lower regeneration energy requirements",
        "Design modular capture systems with 30% lower capital costs",
        "Identify economically viable carbon utilization pathways",
        "Create scalable solutions for direct air capture applications"
      ],
      outcomes: [
        "Novel sorbent material achieving 40% energy reduction in laboratory tests",
        "Prototype modular capture unit demonstrating 25% cost reduction",
        "Three new carbon utilization pathways with positive economic models",
        "Technical blueprints for scaled direct air capture systems"
      ],
      challenges: [
        "Scaling laboratory breakthroughs to industrial applications",
        "Reducing energy intensity of carbon capture processes",
        "Developing durable materials for long-term deployment",
        "Creating economically sustainable business models"
      ],
      keyMetrics: [
        { label: "Capture Efficiency Improvement", value: "45%" },
        { label: "Energy Requirement Reduction", value: "38%" },
        { label: "Capital Cost Reduction", value: "25%" },
        { label: "Technology Readiness Level Advancement", value: "3 levels" }
      ],
      relatedProjects: ["solar-integration-network", "urban-sustainability-framework"]
    }
  ];

  // Find the project based on the slug
  const project = projects.find(p => p.slug === params.slug);
  
  // If no project is found, return 404
  if (!project) {
    notFound();
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800"
      case "In Progress": return "bg-blue-100 text-blue-800"
      case "Research Phase": return "bg-purple-100 text-purple-800"
      case "Ongoing": return "bg-indigo-100 text-indigo-800"
      case "Scaling Up": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Find related projects
  const relatedProjectsData = project.relatedProjects 
    ? project.relatedProjects.map(slug => projects.find(p => p.slug === slug)).filter(Boolean)
    : [];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
          </div>
          
          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-6 pt-20">
            <div className="mb-4">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-center max-w-4xl">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl opacity-90">
              {project.description}
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{project.duration}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>{project.teamSize}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-8">Project Overview</h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  {project.fullDescription.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                  <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-6">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="text-gray-700 font-medium">{project.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Client/Partners</p>
                      <p className="text-gray-700 font-medium">{project.clientPartners}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Timeline</p>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-[#0396FF] mr-2" />
                        <p className="text-gray-700 font-medium">{project.startDate} - {project.completionDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Budget</p>
                      <p className="text-gray-700 font-medium">{project.budget}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Gallery */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-8 text-center">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {project.images.slice(1).map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-md h-64 relative group">
                  <img
                    src={image}
                    alt={`${project.title} - Image ${index + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Goals & Outcomes */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center mb-6">
                  <Target className="w-6 h-6 text-[#0396FF] mr-3" />
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D]">Project Goals</h2>
                </div>
                <ul className="space-y-4">
                  {project.goals.map((goal, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-1 mr-3 text-[#0396FF]">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <p className="text-gray-600">{goal}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center mb-6">
                  <Award className="w-6 h-6 text-[#0396FF] mr-3" />
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D]">Project Outcomes</h2>
                </div>
                <ul className="space-y-4">
                  {project.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-1 mr-3 text-[#0396FF]">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <p className="text-gray-600">{outcome}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics & Challenges */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center mb-8">
                  <BarChart2 className="w-6 h-6 text-[#0396FF] mr-3" />
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D]">Key Metrics</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {project.keyMetrics.map((metric, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                      <p className="text-gray-600 text-sm mb-2">{metric.label}</p>
                      <p className="text-3xl font-bold text-[#0396FF]">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center mb-8">
                  <AlertTriangle className="w-6 h-6 text-[#0396FF] mr-3" />
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D]">Challenges Addressed</h2>
                </div>
                <ul className="space-y-4">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                      <div className="mt-1 mr-3 text-[#0396FF]">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <p className="text-gray-600">{challenge}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjectsData.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-10 text-center">Related Projects</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedProjectsData.map((relatedProject, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={relatedProject.images[0]}
                        alt={relatedProject.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(relatedProject.status)}`}>
                          {relatedProject.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3">{relatedProject.title}</h3>
                      <p className="text-gray-600 mb-4">{relatedProject.description}</p>
                      <Link 
                        href={`/projects/${relatedProject.slug}`}
                        className="text-[#0396FF] font-medium inline-flex items-center hover:text-[#0396FF]/80 transition-colors duration-300"
                      >
                        View Project <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-[#0396FF]/10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-6">Interested in Similar Solutions?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Contact us to learn how we can develop customized sustainable solutions for your organization's unique challenges.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium"
                >
                  Contact Our Team
                </Link>
                <Link 
                  href="/projects" 
                  className="inline-flex items-center border-2 border-[#0396FF] text-[#0396FF] px-8 py-3 rounded-full hover:bg-[#0396FF] hover:text-white transition-all duration-300 text-lg font-medium"
                >
                  Explore All Projects
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
