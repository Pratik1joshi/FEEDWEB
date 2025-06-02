"use client"

import { Users, Target, Eye, Award, Globe, Lightbulb, Heart } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Image from "next/image"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "We drive cutting-edge research and development in sustainable energy technologies.",
    },
    {
      icon: Heart,
      title: "Collaboration",
      description: "We believe in the power of partnerships to create lasting environmental solutions.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Our work spans continents, addressing energy challenges in diverse communities.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We maintain open communication and accountability in all our initiatives.",
    },
  ]

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Executive Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Leading expert in renewable energy policy with 15+ years of experience in international development.",
    },
    {
      name: "Prof. Michael Chen",
      role: "Chief Research Officer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Renowned environmental scientist specializing in carbon capture and climate adaptation strategies.",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Policy Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Former UN advisor with expertise in sustainable development and environmental governance.",
    },
    {
      name: "James Wilson",
      role: "Technology Innovation Lead",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Engineering leader focused on clean energy infrastructure and smart grid technologies.",
    },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[35vh] min-h-[350px] w-full">
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
          <div className="relative h-full flex flex-col items-center justify-center text-white container mx-auto pt-16">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-center max-w-4xl">
              FEED aims to co-create sustainable solutions to any problems.
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl opacity-90">
              FEED aims to co-create sustainable solutions to any problems.
            </p>
          </div>
        </section>

        {/* Company History Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-4xl font-serif font-bold text-[#0396FF]">Feed Pvt Ltd</h2>
                  <p className="text-2xl text-gray-600">How we started</p>
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    After realizing the essence of a Research and Consulting Company in the field of Engineering, Energy 
                    and Environment to deliver high quality professional services, the like minded and highly motivated 
                    professionals initiated FEED in 1999.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    FEED (P) Ltd. envisions to deliver science based research and professional services in the field of 
                    sustainable development, climate and climate change impacts, adaptations, to contribute for disaster 
                    risk reduction; bridging academic research with professionals and policymakers for sustainable development.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    FEED team believes in coupling the enthusiasm and ambition of youth, with its lack of fear and 
                    innovative techniques, with the gardened knowledge of experience to work for the change.
                  </p>
                </div>
                <button className="mt-8 bg-[#0396FF] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium">
                  Get in Touch
                </button>
              </div>

              {/* Image Container */}
              <div className="relative h-[600px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/about.jpg"
                  alt="FEED Company History"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About FEED Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="max-w-5xl mx-auto text-center mb-16">
              <h2 className="text-2xl text-gray-600 mb-2">About</h2>
              <h3 className="text-4xl font-serif font-bold text-[#0396FF] mb-8">FEED</h3>
              <p className="text-xl text-gray-600 leading-relaxed">
                Forum for Energy and Environment Development (FEED) P. Ltd. is one of the leading consulting companies in Nepal 
                initiated by the Engineers' and development planners' with a vision of providing best research and consulting 
                services in developing the risk informed societies. FEED is driven by strong and diverse professionals with 
                proven expertise and experience in handling large and complex projects across sectors.
              </p>
            </div>

            {/* Establishment Info */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  FEED was established in September 1999 under the Company Act of Nepal at the Office of the Company Registrar, 
                  Kathmandu and Tax/VAT Office of the Government of Nepal. FEED has been engaging actively in Nepal in providing 
                  a diverse range of services in the engineering sector through the latest and cutting edge technology for more 
                  than a couple of decades. Over the years, FEED has gained valuable expertise and experiences in the field of 
                  project management, Hydropower, Energy, Ecosystem, Environment and Nature based solutions, Water resources, 
                  Infrastructure and Planning, climate change, disaster risk reduction and so on. Alongside the government agencies, 
                  FEED has a healthy experiences of working with the NGOs, INGOs, and donor agencies.
                </p>
              </div>
              <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/about2.jpg"
                  alt="FEED Establishment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Vision and Values */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl md:order-1 order-2">
                <Image
                  src="/about3.jpg"
                  alt="FEED Vision"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-6 md:order-2 order-1">
                <p className="text-lg text-gray-600 leading-relaxed">
                  FEED believes in working closely with the customers to understand the holistic nature of their requirements 
                  and put forth a comprehensive plan in place. Through the adequate research, successful piloting and reference 
                  of best practices, FEED aims to co-create sustainable solutions to any problems. For this, FEED prioritizes 
                  interdisciplinary collaboration, quality assurance, resource optimization for devising cost effective solutions, 
                  and sound interaction with the stakeholders. Further, FEED has been maintaining high level of professional ethics 
                  and anti-corruption policy that lead transparent and zero-tolerance environment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="w-16 h-16 bg-[#0396FF] rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#0396FF] mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To accelerate the global transition to sustainable energy systems while protecting our environment for
                  future generations through evidence-based research, innovative policy solutions, and strategic stakeholder
                  engagement that bridges the gap between scientific knowledge and practical implementation.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="w-16 h-16 bg-[#0396FF] rounded-full flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#0396FF] mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  A world where clean, affordable energy powers sustainable development, environmental stewardship drives
                  policy decisions, and collaborative governance ensures equitable access to resources while preserving our
                  planet's natural systems for generations to come.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif font-bold text-[#0396FF] mb-4">Our Core Values</h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  The principles that guide our work and shape our approach to sustainable development
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-[#0396FF] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#0396FF]/80 transition-colors duration-300">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-serif font-bold text-[#0396FF] mb-3">{value.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership Team */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif font-bold text-[#0396FF] mb-4">Leadership Team</h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Meet the experts driving our mission forward with decades of combined experience
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-64 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-serif font-bold text-[#0396FF] mb-1">{member.name}</h4>
                      <p className="text-[#0396FF]/80 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* History & Achievements */}
            <div className="bg-gray-50 rounded-lg p-12">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-serif font-bold text-[#0396FF] mb-4">Our Story</h3>
                  <p className="text-lg text-gray-600">
                    From humble beginnings to global impact - the journey of FEED
                  </p>
                </div>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p className="mb-6">
                    Founded in 2015 by a group of passionate researchers and policy experts, the Forum for Energy and
                    Environment Development emerged from a shared vision: to bridge the critical gap between scientific
                    research and practical policy implementation in the energy and environmental sectors.
                  </p>
                  <p className="mb-6">
                    What started as a small think tank with a focus on renewable energy integration has evolved into a
                    globally recognized organization that influences policy decisions across 30+ countries. Our
                    interdisciplinary approach combines cutting-edge research with real-world application, ensuring that our
                    recommendations are both scientifically sound and practically feasible.
                  </p>
                  <p className="mb-6">
                    Today, FEED stands at the forefront of the global sustainability movement, working with governments,
                    international organizations, and private sector partners to accelerate the transition to clean energy
                    while protecting our planet's precious ecosystems. Our commitment to evidence-based solutions and
                    collaborative governance continues to drive meaningful change in communities around the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
} 