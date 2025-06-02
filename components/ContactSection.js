import { MapPin, Phone, Mail, Twitter, Facebook, Linkedin, Instagram, Youtube } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="py-20 bg-white" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-[#1A365D] mb-6">Get In Touch</h2>
            <p className="text-lg text-gray-600 mb-8">
              Have questions or want to collaborate? Reach out to our team and we'll get back to you as soon as
              possible.
            </p>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all duration-300"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all duration-300"
                  placeholder="Subject of your message"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Your message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#0396FF] text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="lg:pl-10">
            <div className="bg-gray-50 rounded-lg p-8 h-full">
              <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#0396FF] rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-[#1A365D] mb-1">Our Location</h4>
                    <p className="text-gray-600">
                      1234 Environmental Way
                      <br />
                      Sustainable City, SC 98765
                      <br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#0396FF] rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-[#1A365D] mb-1">Call Us</h4>
                    <p className="text-gray-600">
                      +1 (555) 123-4567
                      <br />
                      Monday - Friday, 9am - 5pm EST
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#0396FF] rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-[#1A365D] mb-1">Email Us</h4>
                    <p className="text-gray-600">
                      info@feedorganization.org
                      <br />
                      support@feedorganization.org
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <h4 className="text-lg font-medium text-[#1A365D] mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: Twitter, href: "#" },
                    { icon: Facebook, href: "#" },
                    { icon: Linkedin, href: "#" },
                    { icon: Instagram, href: "#" },
                    { icon: Youtube, href: "#" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1A365D] hover:bg-[#0396FF] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="mt-10 rounded-lg h-64 overflow-hidden shadow-md">
                {/* Google Maps Embed - FEED Pvt. Ltd. location */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.9638655399463!2d85.30972257615835!3d27.687511676193928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19bca03b6dd5%3A0x4f3b7763d3a0b37f!2sFEED%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1748843024752!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="FEED PVT LTD Location"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
