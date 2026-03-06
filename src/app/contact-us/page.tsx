export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-white text-black px-6 py-12 md:px-12 lg:px-24 font-sans">
      <div className="max-w-3xl mx-auto border-t-4 border-black pt-8">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">
          Contact Us
        </h1>
        
        <p className="text-lg leading-relaxed mb-12 border-l-2 border-black pl-6">
          If you have any questions, concerns, or feedback, please feel free to
          reach out to us. We are here to assist you and ensure you have the best
          experience with our products and services.
        </p>

        <section className="mt-16">
          <h2 className="text-2xl font-bold uppercase mb-4">
            Customer Support
          </h2>
          <p className="text-sm mb-8 text-gray-600 uppercase tracking-widest">
            Order inquiries • Product info • General support
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center border border-black p-4 group hover:bg-black hover:text-white transition-colors duration-300">
              <span className="font-bold w-32 uppercase text-xs mb-1 md:mb-0">Email</span>
              <a href="mailto:christabel1596@gmail.com" className="text-lg break-all">
                christabel1596@gmail.com
              </a>
            </div>

            <div className="flex flex-col md:flex-row md:items-center border border-black p-4 group hover:bg-black hover:text-white transition-colors duration-300">
              <span className="font-bold w-32 uppercase text-xs mb-1 md:mb-0">WhatsApp</span>
              <a href="https://wa.me/2349156378129" className="text-lg">
                +234 915 637 8129
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}