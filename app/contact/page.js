"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HeroBanner from "@/components/HeroBanner"
import ContactSection from "@/components/ContactSection"
import BackToTop from "@/components/BackToTop"

export default function ContactPage() {
  return (
    <>
      <Header />
      <HeroBanner 
        title="Contact Us" 
        description="We'd love to hear from you. Get in touch with our team today."
      />
      <ContactSection />
      <Footer />
      <BackToTop />
    </>
  )
}
