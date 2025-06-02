"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Image from "next/image"
import { useState } from "react"

export default function CareersPage() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const galleryImages = [
    { 
      src: "/about.jpg", 
      span: "md:col-span-2 md:row-span-2",
      title: "Team Building",
      description: "Growing together through collaboration"
    },
    { 
      src: "/about.jpg", 
      span: "md:col-span-1 md:row-span-1",
      title: "Innovation",
      description: "Pushing boundaries"
    },
    { 
      src: "/about.jpg", 
      span: "md:col-span-1 md:row-span-1",
      title: "Leadership",
      description: "Guiding the way forward"
    },
    { 
      src: "/about.jpg", 
      span: "md:col-span-1 md:row-span-2",
      title: "Research",
      description: "Discovering new possibilities"
    },
    { 
      src: "/about.jpg", 
      span: "md:col-span-2 md:row-span-1",
      title: "Collaboration",
      description: "Working as one"
    },
    { 
      src: "/about.jpg", 
      span: "md:col-span-1 md:row-span-1",
      title: "Development",
      description: "Building the future"
    },
    { 
      src: "/about.jpg", 
      span: "md:col-span-2 md:row-span-1",
      title: "Community",
      description: "Making a difference together"
    },
    { 
      src: "/about.jpg", 
      span: "md:col-span-1 md:row-span-2",
      title: "Growth",
      description: "Nurturing talent"
    },
    { 
      src: "/about.jpg", 
      span: "md:col-span-1 md:row-span-1",
      title: "Excellence",
      description: "Striving for the best"
    },
    { 
      src: "/about.jpg", 
      span: "md:col-span-1 md:row-span-1",
      title: "Sustainability",
      description: "Creating lasting impact"
    }
  ]

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
              alt="Green field under blue sky"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
          </div>
          
          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto px-6 pt-24">
            <h1 className="text-2xl md:text-4xl font-serif font-bold mb-4 text-center">
            Work with us and provide the Contribution to nation and FEED.
            </h1>
            <p className="text-l md:text-xl text-center max-w-3xl opacity-90">
              Join Our Dynamic Team
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0396FF] mb-4">Career</h1>
              <h2 className="text-2xl md:text-3xl text-gray-600 mb-8">Join Our Team</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Joining our team presents an exciting opportunity to contribute to a dynamic and forward-thinking 
                organization. We value individuals who bring their unique skills and experiences to the table, and 
                we believe that you can make a significant impact here. Our team is built on collaboration, innovation, 
                and a shared commitment to excellence. By joining us, you'll have the chance to work alongside dedicated 
                professionals who are passionate about what they do.
              </p>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">Life at FEED</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Experience the dynamic and collaborative environment that makes FEED a great place to work
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
              {galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative group ${image.span} transform transition-all duration-500 hover:z-10`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        hoveredIndex === index ? 'scale-110' : 'scale-100'
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${
                      hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                    }`} />
                  </div>
                  
                  {/* Content Overlay */}
                  <div className={`absolute inset-0 p-6 flex flex-col justify-end text-white transform transition-all duration-500 ${
                    hoveredIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                    <p className="text-sm text-gray-200">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Apply Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-6">
                Apply To Join Our Team
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Joining our team presents an exciting opportunity to contribute to a dynamic and forward-thinking
                organization. We value individuals who bring their unique skills and experiences to the table, and
                we believe that you can make a significant impact here.
              </p>
              <button className="bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium">
                Apply Now
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
} 