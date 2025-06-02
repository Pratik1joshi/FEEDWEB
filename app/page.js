"use client"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import AboutUs from "@/components/AboutUs"
import FocusAreas from "@/components/FocusAreas"
import FeaturedProjects from "@/components/FeaturedProjects"
import Publications from "@/components/Publications"
import Timeline from "@/components/Timeline"
import MediaSection from "@/components/MediaSection"
import ContactSection from "@/components/ContactSection"
import Newsletter from "@/components/Newsletter"
import Footer from "@/components/Footer"
import BackToTop from "@/components/BackToTop"
import ServicesSection from "@/src/components/ServicesSection"
import WorkingAreasMap from "@/components/WorkingAreasMap"

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <HeroSection />
      <AboutUs />
      <ServicesSection/>
      {/* <FocusAreas /> */}
      <FeaturedProjects />
      <WorkingAreasMap />
      <Publications />
      <Timeline />
      <MediaSection />
      <ContactSection />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  )
}
