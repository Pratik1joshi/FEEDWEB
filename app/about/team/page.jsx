"use client"

import { Mail, Linkedin, Twitter, ArrowRight } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Image from "next/image"

export default function TeamPage() {
  // Leadership team data
  const leadershipTeam = [
    {
      name: "Dr. Sarah Johnson",
      role: "Executive Director",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Leading expert in renewable energy policy with 15+ years of experience in international development.",
      longBio: "Dr. Johnson has led multiple UN climate initiatives and advised governments on renewable energy policy implementation across Asia and Africa. Her research on sustainable energy solutions has been published in top scientific journals.",
      education: "Ph.D. in Environmental Policy, Harvard University",
      socialLinks: {
        email: "sarah.johnson@feedorganization.org",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Prof. Michael Chen",
      role: "Chief Research Officer",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Renowned environmental scientist specializing in carbon capture and climate adaptation strategies.",
      longBio: "Professor Chen brings 20 years of academic and field experience to FEED. His groundbreaking work on climate adaptation has influenced policy development in over 15 countries. He leads our research division, ensuring our recommendations are based on cutting-edge science.",
      education: "Ph.D. in Environmental Engineering, MIT",
      socialLinks: {
        email: "michael.chen@feedorganization.org",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Policy Director",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Former UN advisor with expertise in sustainable development and environmental governance.",
      longBio: "With extensive experience at UNEP and UNDP, Dr. Rodriguez bridges scientific research with practical policy implementation. She has developed environmental frameworks adopted by multiple governments and international organizations.",
      education: "Ph.D. in Public Policy, Princeton University",
      socialLinks: {
        email: "emily.rodriguez@feedorganization.org",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "James Wilson",
      role: "Technology Innovation Lead",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Engineering leader focused on clean energy infrastructure and smart grid technologies.",
      longBio: "James has pioneered several renewable energy projects, including award-winning solar implementations in rural communities. His expertise in smart grid technologies has helped develop sustainable energy systems in developing regions.",
      education: "M.S. in Electrical Engineering, Stanford University",
      socialLinks: {
        email: "james.wilson@feedorganization.org",
        linkedin: "#",
        twitter: "#"
      }
    },
  ]

  // Technical team data
  const technicalTeam = [
    {
      name: "Dr. Aisha Patel",
      role: "Senior Environmental Scientist",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Specializes in ecosystem analysis and biodiversity conservation with 12+ years of experience.",
      education: "Ph.D. in Ecology, University of California"
    },
    {
      name: "David Nakamura",
      role: "Renewable Energy Engineer",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Expert in solar and wind energy system design with experience in 20+ countries.",
      education: "M.S. in Renewable Energy, Technical University of Denmark"
    },
    {
      name: "Maria Gonzalez",
      role: "Climate Policy Analyst",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Former climate negotiator with expertise in international environmental agreements.",
      education: "M.A. in International Relations, Georgetown University"
    },
    {
      name: "Robert Kim",
      role: "Data Science Lead",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Applies machine learning to environmental monitoring and climate prediction models.",
      education: "Ph.D. in Computer Science, Carnegie Mellon University"
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
              alt="FEED team working together"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
          </div>
          
          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto pt-16">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-center">
              Our Team
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl opacity-90">
              Meet the dedicated professionals working to create a sustainable future
            </p>
          </div>
        </section>

        {/* Team Introduction */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-[#0396FF] mb-6">The People Behind Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our diverse team combines scientific expertise, policy knowledge, and technical skills to 
                develop innovative solutions for today's most pressing environmental challenges. With decades 
                of collective experience across multiple disciplines, we bring a comprehensive approach to 
                sustainable development.
              </p>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-4">Leadership Team</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our organization is led by experts with extensive experience in their respective fields
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              {leadershipTeam.map((member, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/5 p-6">
                    <h3 className="text-2xl font-serif font-bold text-[#0396FF] mb-1">{member.name}</h3>
                    <p className="text-[#0396FF]/80 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 mb-4">{member.longBio}</p>
                    <p className="text-gray-500 text-sm mb-4">{member.education}</p>
                    
                    <div className="flex space-x-3">
                      <a href={`mailto:${member.socialLinks.email}`} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#0396FF] hover:text-white transition-colors duration-300">
                        <Mail className="w-4 h-4" />
                      </a>
                      <a href={member.socialLinks.linkedin} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#0396FF] hover:text-white transition-colors duration-300">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href={member.socialLinks.twitter} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#0396FF] hover:text-white transition-colors duration-300">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Technical Team */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-4">Technical Experts</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our specialized professionals bring technical expertise to every project
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {technicalTeam.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="h-64 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-[#0396FF] mb-1">{member.name}</h3>
                    <p className="text-[#0396FF]/80 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                    <p className="text-gray-500 text-xs">{member.education}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Join Our Team CTA */}
        <section className="py-16 bg-[#0396FF]/10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-[#0396FF] mb-6">Join Our Team</h2>
              <p className="text-lg text-gray-600 mb-8">
                We're always looking for talented individuals who are passionate about environmental 
                sustainability and renewable energy. Join us in our mission to create a more sustainable future.
              </p>
              <a 
                href="/about/careers" 
                className="inline-flex items-center bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium"
              >
                View Open Positions <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
