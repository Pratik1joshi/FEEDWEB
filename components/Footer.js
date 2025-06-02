import { Twitter, Facebook, Linkedin, Instagram, CreditCard } from "lucide-react"

export default function Footer() {
  const quickLinks = ["About Us", "Our Services", "Projects", "Publications", "Media Center", "Contact Us"]
  const resources = [
    "Research Papers",
    "Policy Briefs",
    "Case Studies",
    "Annual Reports",
    "Energy Data",
    "Climate Resources",
  ]
  const legal = ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility", "Disclaimer"]

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="text-2xl font-bold font-serif mb-6">
              <span className="text-white">F</span>
              <span className="text-[#B22234]">E</span>
              <span className="text-white">E</span>
              <span className="text-[#B22234]">D</span>
            </div>
            <p className="text-gray-400 mb-6">
              The Forum for Energy and Environment Development is dedicated to creating sustainable solutions through
              research, policy advocacy, and community engagement.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#B22234] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Resources</h3>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Legal</h3>
            <ul className="space-y-3">
              {legal.map((legalItem, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
                    {legalItem}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">We Accept</h3>
              <div className="flex space-x-3">
                {[1, 2, 3, 4].map((index) => (
                  <CreditCard key={index} className="w-8 h-8 text-gray-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Forum for Energy and Environment Development. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors duration-300 text-sm cursor-pointer"
            >
              Privacy Policy
            </a>
            <span className="mx-2 text-gray-600">|</span>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors duration-300 text-sm cursor-pointer"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
