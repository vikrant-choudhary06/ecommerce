function ContactUs() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[60vh]">
      <h1 className="text-4xl font-serif font-bold mb-8">Contact Us</h1>
      <p className="text-zinc-600 mb-8 max-w-2xl text-lg">
        We'd love to hear from you. Please fill out the form below or reach out to us at support@brandlifestore.com.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input type="text" id="name" className="w-full border border-zinc-300 rounded-md p-2 focus:ring-black focus:border-black" placeholder="Your Name" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input type="email" id="email" className="w-full border border-zinc-300 rounded-md p-2 focus:ring-black focus:border-black" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <textarea id="message" rows="5" className="w-full border border-zinc-300 rounded-md p-2 focus:ring-black focus:border-black" placeholder="How can we help you?"></textarea>
          </div>
          <button type="button" className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-zinc-800 transition-colors">
            Send Message
          </button>
        </form>
        
        <div className="space-y-8 bg-zinc-50 p-8 rounded-lg">
          <div>
            <h3 className="font-bold text-lg mb-2">Customer Service</h3>
            <p className="text-zinc-600">Email: support@brandlifestore.com</p>
            <p className="text-zinc-600">Phone: 1-800-BRAND-LIFE</p>
            <p className="text-zinc-600">Hours: Mon-Fri 9am - 5pm EST</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Headquarters</h3>
            <p className="text-zinc-600">123 Fashion Avenue<br />New York, NY 10001<br />United States</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
