"use client"

import { useState } from "react"
import { Play, ArrowRight, Download } from "lucide-react"
import Link from "next/link"

export default function MediaSection() {
  const [activeFilter, setActiveFilter] = useState("All")

  const mediaItems = [
    {
      image:
        "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20climate%20conference%20with%20speakers%20on%20stage%20and%20an%20engaged%20audience%20in%20a%20modern%20conference%20hall.%20The%20scene%20should%20show%20formal%20presentation%20with%20projection%20screens%2C%20professional%20lighting%2C%20and%20diverse%20attendees%20in%20business%20attire&width=600&height=400&seq=media-image-001&orientation=landscape",
      type: "News",
      date: "June 10, 2025",
      title: "FEED to Host International Climate Finance Summit",
      excerpt: "Leading experts will gather to discuss innovative funding mechanisms for climate adaptation projects.",
    },
    {
      image:
        "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20TV%20news%20interview%20with%20an%20environmental%20expert%20speaking%20to%20a%20journalist%20in%20a%20studio%20setting%20with%20monitors%20showing%20energy%20data%20in%20the%20background.%20The%20scene%20should%20depict%20professional%20media%20communication%20with%20clean%20studio%20lighting%20and%20broadcast%20equipment&width=600&height=400&seq=media-image-002&orientation=landscape",
      type: "News",
      date: "May 22, 2025",
      title: "FEED Research Featured in Global Climate Report",
      excerpt:
        "Our groundbreaking study on carbon sequestration techniques has been highlighted in the UN's annual climate assessment.",
    },
    {
      image:
        "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20modern%20podcast%20recording%20studio%20with%20hosts%20and%20a%20guest%20discussing%20environmental%20topics%2C%20featuring%20professional%20microphones%2C%20headphones%2C%20and%20recording%20equipment.%20The%20scene%20should%20show%20engaged%20conversation%20in%20a%20professional%20media%20production%20environment&width=600&height=400&seq=media-image-003&orientation=landscape",
      type: "Videos",
      date: "April 15, 2025",
      title: "New Video Series: Energy Transitions Explained",
      excerpt: "Our educational series breaks down complex energy concepts for policymakers and the public.",
    },
    {
      image:
        "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20formal%20partnership%20signing%20ceremony%20between%20government%20officials%20and%20energy%20company%20executives%20with%20handshakes%20and%20document%20signing.%20The%20scene%20should%20depict%20a%20significant%20business%20agreement%20with%20professional%20atmosphere%2C%20flags%2C%20and%20formal%20business%20attire&width=600&height=400&seq=media-image-004&orientation=landscape",
      type: "Press Releases",
      date: "March 30, 2025",
      title: "FEED Announces Partnership with Global Energy Alliance",
      excerpt: "Strategic collaboration aims to accelerate clean energy deployment in developing regions.",
    },
    {
      image:
        "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20researchers%20conducting%20field%20work%20in%20a%20forest%20ecosystem%2C%20measuring%20carbon%20sequestration%20with%20scientific%20equipment%20and%20taking%20samples.%20The%20scene%20should%20show%20environmental%20science%20in%20action%20with%20researchers%20in%20appropriate%20field%20gear%20working%20methodically%20in%20nature&width=600&height=400&seq=media-image-005&orientation=landscape",
      type: "Publications",
      date: "February 18, 2025",
      title: "The Future of Renewable Energy Integration",
      excerpt: "Comprehensive report examining technical and policy challenges of integrating renewable energy into power systems.",
    },
    {
      image:
        "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20community%20workshop%20on%20energy%20efficiency%20with%20diverse%20participants%20examining%20solar%20equipment%20and%20energy-saving%20devices.%20The%20scene%20should%20show%20educational%20outreach%20with%20interactive%20demonstrations%20and%20engaged%20community%20members%20in%20a%20bright%2C%20welcoming%20space&width=600&height=400&seq=media-image-006&orientation=landscape",
      type: "Publications",
      date: "January 25, 2025",
      title: "Community-Led Energy Transitions: Global Case Studies",
      excerpt: "Analysis of successful community energy projects and replicable models for local energy sovereignty.",
    },
  ]

  const filteredItems = activeFilter === "All" 
    ? mediaItems 
    : mediaItems.filter(item => item.type === activeFilter)

  return (
    <section className="py-20 px-12 bg-gray-50" id="media">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">Media & News</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest news, events, and media coverage on energy and environmental issues.
          </p>
        </div>
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
            {["All", "News", "Publications", "Videos", "Press Releases"].map((filter, index) => (
              <button
                key={index}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  filter === activeFilter ? "bg-[#1A365D] text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-[#B22234] text-white text-xs font-medium px-3 py-1 rounded-full">
                  {item.type}
                </div>
                {item.type === "Video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer group-hover:bg-[#B22234] transition-colors duration-300">
                      <Play className="w-6 h-6 text-[#1A365D] group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.excerpt}</p>
                <a
                  href={`/media/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-[#1A365D] font-medium inline-flex items-center group-hover:text-[#B22234] transition-colors duration-300 cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More <ArrowRight className="ml-2 w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/media"
            className="inline-block bg-[#0396FF] text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap"
            rel="noopener noreferrer"
          >
            View All Media
          </Link>
        </div>
      </div>
    </section>
  )
}
