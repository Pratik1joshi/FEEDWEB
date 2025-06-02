export default function Newsletter() {
    return (
      <section className="py-16 bg-[#1A365D]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-blue-100 mb-8">
              Stay informed about the latest developments in energy and environmental policy, research, and events.
            </p>
            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                className="flex-grow px-4 py-3 rounded-md focus:outline-none border-none"
                placeholder="Your email address"
              />
              <button
                type="submit"
                className="bg-[#B22234] text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-blue-200 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    )
  }
  