import { Leaf, Zap, Heart, ArrowRight, Building, Cpu, Users } from "lucide-react"
import { useServices } from '../src/hooks/useApi'

const iconMap = {
  Leaf,
  Zap,
  Heart,
  Building,
  Cpu,
  Users
}

export default function FocusAreas() {
  const { data: servicesData, loading, error } = useServices({ featured: true });
  
  // Fallback data in case API fails
  const fallbackFocusAreas = [
    {
      icon: Leaf,
      title: "Environmental Sustainability",
      description:
        "Developing frameworks and solutions that protect our natural resources while meeting the needs of communities worldwide.",
    },
    {
      icon: Zap,
      title: "Clean Energy Transition",
      description:
        "Accelerating the shift to renewable energy sources through research, policy advocacy, and technological innovation.",
    },
    {
      icon: Heart,
      title: "Collaborative Governance",
      description:
        "Building partnerships between governments, businesses, and communities to implement effective environmental policies.",
    },
  ];

  // Use API data if available, otherwise use fallback
  const focusAreas = servicesData?.data?.length > 0 
    ? servicesData.data.slice(0, 3).map(service => ({
        icon: iconMap[service.icon] || Leaf,
        title: service.title,
        description: service.short_description || service.description.substring(0, 200) + '...',
      }))
    : fallbackFocusAreas;

  return (
    <section className="py-20 px-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-4">Our Key Focus Areas</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We work at the intersection of energy innovation, environmental protection, and sustainable development to
            create a better future for all.
          </p>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A365D] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading our focus areas...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Failed to load focus areas</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {focusAreas.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-[#1A365D] text-white rounded-full flex items-center justify-center mb-6 group-hover:bg-[#B22234] transition-colors duration-300">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-4">{item.title}</h3>
              <p className="text-gray-600 mb-6">{item.description}</p>
              <a
                href="#"
                className="text-[#B22234] font-medium inline-flex items-center group-hover:translate-x-2 transition-transform duration-300 cursor-pointer"
              >
                Read More <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
