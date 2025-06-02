import { Download, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Publications() {
  const sidePublications = [
    {
      thumbnail:
        "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20wind%20turbines%20on%20an%20offshore%20wind%20farm%20with%20a%20dramatic%20sunset%20and%20ocean%20backdrop.%20The%20scene%20should%20show%20modern%20renewable%20energy%20technology%20with%20a%20beautiful%20natural%20setting%2C%20highlighting%20the%20scale%20and%20elegance%20of%20wind%20energy%20infrastructure&width=300&height=200&seq=publication-thumb-001&orientation=landscape",
      date: "April 27, 2025",
      type: "Policy Brief",
      title: "Offshore Wind Development: Policy Frameworks for Sustainable Expansion",
      excerpt:
        "An analysis of regulatory approaches that can accelerate offshore wind deployment while addressing environmental and stakeholder concerns.",
    },
    {
      thumbnail:
        "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20electric%20vehicles%20charging%20at%20a%20modern%20charging%20station%20with%20solar%20panels%20overhead.%20The%20scene%20should%20show%20advanced%20transportation%20technology%20with%20clean%20design%20elements%2C%20highlighting%20the%20connection%20between%20renewable%20energy%20and%20sustainable%20transportation&width=300&height=200&seq=publication-thumb-002&orientation=landscape",
      date: "March 18, 2025",
      type: "White Paper",
      title: "Electric Vehicle Infrastructure: Planning for Mass Adoption",
      excerpt:
        "This paper outlines strategies for developing charging networks that can support the rapid growth of electric vehicles in urban and rural areas.",
    },
    {
      thumbnail:
        "https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20a%20diverse%20group%20of%20people%20in%20a%20conference%20room%20discussing%20environmental%20policy%2C%20with%20presentation%20screens%20showing%20climate%20data%20and%20graphs.%20The%20scene%20should%20depict%20serious%20professional%20collaboration%20with%20modern%20office%20aesthetics%20and%20engaged%20participants&width=300&height=200&seq=publication-thumb-003&orientation=landscape",
      date: "February 5, 2025",
      type: "Case Study",
      title: "Community-Led Energy Transitions: Lessons from Five Global Regions",
      excerpt:
        "Examining successful community energy projects and extracting replicable models for local energy sovereignty and climate resilience.",
    },
  ]

  return (
    <section className="py-20 bg-white" id="publications">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">Latest Publications</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our research papers, policy briefs, and reports that provide valuable insights on energy and
            environmental challenges.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 bg-gray-50 rounded-lg overflow-hidden shadow-md">
            <div className="h-64 overflow-hidden">
              <img
                src="https://readdy.ai/api/search-image?query=A%20professional%20image%20of%20researchers%20in%20a%20modern%20laboratory%20analyzing%20environmental%20data%20with%20advanced%20equipment%20and%20computer%20displays%20showing%20graphs%20and%20charts.%20The%20scene%20should%20depict%20scientific%20research%20in%20progress%20with%20a%20clean%2C%20high-tech%20aesthetic%20and%20focused%20professionals&width=800&height=500&seq=publication-image-001&orientation=landscape"
                alt="Featured Publication"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-500">May 15, 2025</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm font-medium text-[#B22234]">Research Report</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-3">
                The Future of Renewable Energy Integration: Challenges and Opportunities
              </h3>
              <p className="text-gray-600 mb-6">
                This comprehensive report examines the technical, economic, and policy challenges of integrating high
                levels of renewable energy into existing power systems, with case studies from around the world.
              </p>
              <a
                href="#"
                className="inline-block bg-[#0396FF] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="inline mr-2 w-4 h-4" /> Download Full Report
              </a>
            </div>
          </div>
          <div className="lg:col-span-3 space-y-6">
            {sidePublications.map((publication, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden rounded-lg">
                  <img
                    src={publication.thumbnail || "/placeholder.svg"}
                    alt={publication.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="md:w-2/3">
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-gray-500">{publication.date}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-sm font-medium text-[#B22234]">{publication.type}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#1A365D] mb-2">{publication.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{publication.excerpt}</p>
                  <a
                    href={`/publications/${publication.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[#1A365D] font-medium inline-flex items-center hover:text-[#B22234] transition-colors duration-300 cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More <ArrowRight className="ml-2 w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <Link
                href="/publications"
                className="inline-block bg-[#0396FF] text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap"              >
                View All Publications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
