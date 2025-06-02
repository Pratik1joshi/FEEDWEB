import { ArrowRight, MapPin, Calendar, Users } from "lucide-react"
import Link from "next/link"

export default function FeaturedProjects() {
  const projects = [
    {
      images: [
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop"
      ],
      title: "Solar Integration Network",
      description: "Developing smart grid solutions for optimal integration of distributed solar resources across multiple regions.",
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
      category: "Climate Action",
      location: "Texas, USA",
      duration: "30 months",
      teamSize: "20 researchers",
      status: "Research Phase"
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800"
      case "In Progress": return "bg-blue-100 text-blue-800"
      case "Research Phase": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <section id="projects" className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <div className="max-w-3xl">
            <div className="inline-block bg-[#0396FF] text-white text-sm font-medium px-4 py-2 rounded-full mb-4">
              Innovation Showcase
            </div>
            <h2 className="text-5xl font-serif font-bold text-[#1A365D] mb-6 leading-tight">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Explore our innovative initiatives that are making a real impact in energy and environmental sectors
              around the world, driving sustainable change for future generations.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-[#0396FF] font-semibold hidden lg:inline-flex items-center hover:bg-[#0396FF] hover:text-white transition-all duration-300 px-6 py-3 rounded-full border-2 border-[#0396FF] cursor-pointer whitespace-nowrap group"
          >
            View All Projects 
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100"
            >
              {/* Image Gallery */}
              <div className="relative h-72 bg-gray-100">
                {/* Main Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Small Images Overlay */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {project.images.slice(1).map((img, imgIndex) => (
                    <div 
                      key={imgIndex}
                      className="w-16 h-12 rounded-lg overflow-hidden border-2 border-white shadow-lg opacity-90 hover:opacity-100 transition-opacity duration-300"
                    >
                      <img
                        src={img}
                        alt={`${project.title} ${imgIndex + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-[#B22234] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    {project.category}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full shadow-lg ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-4 group-hover:text-[#0396FF] transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-base mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Project Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#0396FF]" />
                    <span className="text-sm text-gray-600 font-medium">{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#0396FF]" />
                    <span className="text-sm text-gray-600 font-medium">{project.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#0396FF]" />
                    <span className="text-sm text-gray-600 font-medium">{project.teamSize}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                  <Link
                    href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[#0396FF] font-semibold inline-flex items-center hover:bg-[#0396FF] hover:text-white transition-all duration-300 px-6 py-3 rounded-full border border-[#0396FF] cursor-pointer group/btn"
                  >
                    Learn More 
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center lg:hidden">
          <a
            href="/projects"
            className="text-[#B22234] font-semibold inline-flex items-center hover:bg-[#B22234] hover:text-white transition-all duration-300 px-8 py-4 rounded-full border-2 border-[#B22234] cursor-pointer group"
            target="_blank"
            rel="noopener noreferrer"
          >
            View All Projects 
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  )
}