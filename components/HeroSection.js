export default function HeroSection() {
    return (
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A365D]/80 to-transparent"></div>

        {/* Content */}
        <div className="container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl text-white z-10 mt-16">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Shaping the Future of Energy & Environment
            </h1>
            <p className="text-xl mb-8 leading-relaxed">
              FEED is dedicated to developing sustainable solutions that balance environmental protection with energy
              needs. We drive innovation through research, policy advocacy, and community engagement.
            </p>
            <div className="flex space-x-4">
              <button className="bg-[#0396FF] px-8 py-3 text-white font-medium rounded-md hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap">
                Get Involved
              </button>
              <button className="bg-transparent border-2 border-white px-8 py-3 text-white font-medium rounded-md hover:bg-white hover:text-[#1A365D] transition-all duration-300 cursor-pointer whitespace-nowrap">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }
  