"use client"

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MapPin, Calendar, Users, ArrowRight, Search } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const projects = [
    {
      images: [
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop"
      ],
      title: "Solar Integration Network",
      description: "Developing smart grid solutions for optimal integration of distributed solar resources across multiple regions.",
      longDescription: "This project focuses on creating a unified network that optimizes the integration of distributed solar energy resources into existing power grids. By implementing smart grid technologies and advanced control systems, we enable more efficient energy distribution, reduce transmission losses, and increase grid stability despite the variable nature of solar power generation.",
      category: "Renewable Energy",
      location: "California, USA",
      duration: "18 months",
      teamSize: "12 experts",
      status: "In Progress"
    },
    {
      images: [
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop"
      ],
      title: "Water Conservation Initiative",
      description: "Implementing advanced technologies to reduce water waste in agricultural sectors through AI-driven monitoring.",
      longDescription: "Our Water Conservation Initiative leverages artificial intelligence and IoT sensors to revolutionize agricultural water usage. The system continuously monitors soil moisture levels, weather patterns, and crop water requirements to deliver precise irrigation schedules. This smart approach has reduced water consumption by up to 30% while maintaining or improving crop yields in pilot implementations.",
      category: "Water Management",
      location: "Arizona, USA",
      duration: "24 months",
      teamSize: "8 specialists",
      status: "Completed"
    },
    {
      images: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=300&h=200&fit=crop"
      ],
      title: "Urban Sustainability Framework",
      description: "Creating comprehensive guidelines for cities to reduce emissions while improving quality of life for residents.",
      longDescription: "The Urban Sustainability Framework provides city planners and policymakers with a structured approach to transforming urban environments into more sustainable, resilient, and livable spaces. This comprehensive framework addresses key areas including energy efficiency, green infrastructure, sustainable transportation, waste management, and social inclusion. By integrating these elements into urban planning processes, cities can significantly reduce their carbon footprint while enhancing residents' quality of life.",
      category: "Urban Planning",
      location: "Seattle, WA",
      duration: "12 months",
      teamSize: "15 planners",
      status: "In Progress"
    },
    {
      images: [
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=300&h=200&fit=crop"
      ],
      title: "Carbon Capture Innovation",
      description: "Researching next-generation technologies for efficient carbon dioxide removal and storage solutions.",
      longDescription: "Our Carbon Capture Innovation project explores cutting-edge approaches to removing carbon dioxide from the atmosphere and industrial emissions. The research focuses on developing more energy-efficient and cost-effective carbon capture technologies, novel materials for CO2 adsorption, and sustainable storage solutions. By advancing these technologies, we aim to make carbon capture economically viable at scale, creating a crucial tool for climate change mitigation.",
      category: "Climate Action",
      location: "Texas, USA",
      duration: "30 months",
      teamSize: "20 researchers",
      status: "Research Phase"
    },
    {
      images: [
        "https://images.unsplash.com/photo-1501159599894-155982264a55?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop"
      ],
      title: "Biodiversity Conservation Program",
      description: "Implementing community-based conservation approaches to protect endangered species and their habitats.",
      longDescription: "The Biodiversity Conservation Program works directly with local communities to establish sustainable conservation practices that protect vulnerable ecosystems and endangered species. By combining traditional ecological knowledge with scientific monitoring techniques, we've created a model that balances biodiversity protection with community needs. The program includes habitat restoration, anti-poaching initiatives, sustainable livelihood development, and environmental education components.",
      category: "Conservation",
      location: "Costa Rica",
      duration: "36 months",
      teamSize: "25 conservationists",
      status: "Ongoing"
    },
    {
      images: [
        "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1473881823110-d94cac66318a?w=300&h=200&fit=crop"
      ],
      title: "Clean Energy Access Initiative",
      description: "Bringing affordable renewable energy solutions to underserved communities in developing regions.",
      longDescription: "The Clean Energy Access Initiative aims to bridge the energy divide by deploying affordable, reliable, and sustainable energy solutions in areas lacking access to electricity. Through a combination of solar home systems, mini-grids, and innovative financing mechanisms, we're enabling communities to leapfrog traditional fossil fuel infrastructure. The project also includes training local technicians, establishing maintenance networks, and creating sustainable business models for long-term operation.",
      category: "Energy Access",
      location: "Multiple African Countries",
      duration: "48 months",
      teamSize: "30 specialists",
      status: "Ongoing"
    },
    {
      images: [
        "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1593113598332-cd59a0c3d10b?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=300&h=200&fit=crop"
      ],
      title: "Sustainable Agriculture Development",
      description: "Transforming farming practices to increase resilience to climate change while improving productivity.",
      longDescription: "This project works with farmers to adopt climate-smart agricultural practices that enhance food security, increase farm productivity, and build resilience to climate change. Through a combination of improved crop varieties, efficient irrigation systems, soil conservation techniques, and climate information services, participating farmers have seen significant improvements in yields while reducing their environmental footprint. The program also helps farmers access markets and develop value-added products.",
      category: "Agriculture",
      location: "Southeast Asia",
      duration: "36 months",
      teamSize: "18 agronomists",
      status: "Scaling Up"
    },
    {
      images: [
        "https://images.unsplash.com/photo-1514864151880-d1bef4892f28?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=300&h=200&fit=crop"
      ],
      title: "Coastal Resilience Project",
      description: "Building natural and engineered defenses to protect coastal communities from rising sea levels and extreme weather.",
      longDescription: "The Coastal Resilience Project combines ecosystem restoration with innovative infrastructure solutions to protect vulnerable coastal areas from the impacts of climate change. Key components include mangrove and coral reef restoration, living shorelines, stormwater management systems, and community-based disaster risk reduction. This integrated approach not only reduces physical vulnerability but also strengthens socio-economic resilience through diversified livelihoods and improved governance systems.",
      category: "Climate Adaptation",
      location: "Caribbean Islands",
      duration: "60 months",
      teamSize: "22 experts",
      status: "In Progress"
    },
  ];

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

  const categories = ['All', 'Renewable Energy', 'Water Management', 'Urban Planning', 'Climate Action', 'Conservation', 'Energy Access', 'Agriculture', 'Climate Adaptation'];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[30vh] min-h-[300px] w-full">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/photo-1617280137702-32e761be8b26.jpg"
              alt="FEED Projects"
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
              Our Projects
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl opacity-90">
              Innovative initiatives creating real impact for sustainable development
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-col justify-between items-start gap-6">
              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full md:w-80 pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0396FF] focus:border-[#0396FF] transition duration-150 ease-in-out"
                  placeholder="Search projects..."
                />
              </div>

              <div className="w-full md:w-auto overflow-x-auto">
                <div className="flex space-x-2 pb-3 md:pb-0 min-w-max">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveFilter(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        activeFilter === category
                          ? "bg-[#0396FF] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group border border-gray-100"
                >
                  {/* Image Gallery */}
                  <div className="relative h-64 bg-gray-100">
                    {/* Main Image */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#0396FF] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        {project.category}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full shadow-lg ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3 group-hover:text-[#0396FF] transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 gap-2 mb-5">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#0396FF]" />
                        <span className="text-sm text-gray-600">{project.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#0396FF]" />
                        <span className="text-sm text-gray-600">{project.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-[#0396FF]" />
                        <span className="text-sm text-gray-600">{project.teamSize}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[#0396FF] font-medium inline-flex items-center hover:text-[#0396FF]/80 transition-colors duration-300 group/btn"
                    >
                      Learn More 
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#0396FF]/10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-6">Interested in Collaborating?</h2>
              <p className="text-lg text-gray-600 mb-8">
                We're always looking for partners who share our vision for a sustainable future.
                Whether you're a community organization, government agency, or private company,
                we'd love to explore how we can work together.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
