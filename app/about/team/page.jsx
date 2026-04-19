import { ArrowRight } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ParallaxTeamLayout from "@/components/ParallaxTeamLayout"

export default function TeamPage() {
  return (
    <>
      <Header />
      <main>
        {/* Parallax Team Layout */}
        <ParallaxTeamLayout />
      </main>
      <Footer />
    </>
  )
}
