"use client"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import AboutUs from "@/components/AboutUs"
import DynamicServicesSection from "@/components/DynamicServicesSection"
import ProjectCarousel from "@/components/ProjectCarousel"
import DynamicEventsSection from "@/components/DynamicEventsSection"
import TeamSection from "@/components/TeamSection"
import DynamicPublications from "@/components/DynamicPublications"
import Timeline from "@/components/Timeline"
import DynamicMediaSection from "@/components/DynamicMediaSection"
import ContactSection from "@/components/ContactSection"
import Newsletter from "@/components/Newsletter"
import Footer from "@/components/Footer"
import BackToTop from "@/components/BackToTop"
import WorkingAreasMap from "@/components/WorkingAreasMap"

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <HeroSection />
      <main className="home-sections-compact">
        <AboutUs />
        <ProjectCarousel />
        <DynamicServicesSection 
          title="Our Services"
          subtitle="Comprehensive solutions for sustainable development and environmental challenges"
          limit={6}
          layout="grid"
        />
        <DynamicEventsSection 
          title="Upcoming Events"
          subtitle="Join us for conferences, workshops, and community engagement sessions"
          limit={6}
          showPast={false}
        />
        {/* <TeamSection 
          title="Our Team"
          subtitle="Meet the dedicated professionals working to create a sustainable future"
          limit={8}
          layout="grid"
        /> */}
        <WorkingAreasMap />
        <DynamicPublications 
          title="Latest Publications"
          subtitle="Explore our research papers, policy briefs, and reports"
          limit={4}
          showFeatured={true}
        />
        <Timeline />
        <DynamicMediaSection 
          title="Latest News & Media"
          subtitle="Stay updated with our latest developments and industry insights"
          limit={6}
          showType="all"
        />
        <ContactSection />
        <Newsletter />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
