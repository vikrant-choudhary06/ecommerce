import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

function ShoppingFooter() {
  const navigate = useNavigate();

  function handleNavigateToCategory(categoryId) {
    sessionStorage.removeItem("filters");
    const currentFilter = { category: [categoryId] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing?category=${categoryId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="relative bg-zinc-950 text-zinc-100 py-24 px-4 md:px-8 border-t border-white/5 overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="container relative mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* BRAND SECTION */}
          <div className="lg:col-span-4 flex flex-col space-y-8">
            <Link to="/shop/home" className="flex flex-col items-start gap-0 group">
              <span className="text-5xl font-bold tracking-[ -0.05em] leading-none font-serif italic text-white group-hover:text-primary transition-colors duration-500">BL</span>
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase font-sans mt-2 opacity-60">Brand Life Store</span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-light">
              Designing the future of everyday luxury. Our collections are crafted with precision, blending timeless ethics with contemporary silhouettes.
            </p>
            <div className="flex space-x-6 pt-4">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, idx) => (
                <a key={idx} href={social.href} className="text-zinc-500 hover:text-primary transition-all duration-300 transform hover:-translate-y-1">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 hidden lg:block" />

          {/* LINKS SECTIONS */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Shop Collections</h4>
            <div className="flex flex-col space-y-4">
              {['shirts', 'pants', 'outerwear'].map(cat => (
                <span key={cat} onClick={() => handleNavigateToCategory(cat)} className="text-zinc-300 hover:text-white text-sm transition-colors cursor-pointer font-medium uppercase tracking-widest text-[11px] hover:translate-x-1 transform duration-300 inline-block">
                  {cat === 'pants' ? 'Pants & Jeans' : cat}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Client Care</h4>
            <div className="flex flex-col space-y-4">
              {[
                { label: "Contact Us", to: "/shop/contact" },
                { label: "FAQs", to: "/shop/faq" },
                { label: "Shipping & Returns", to: "/shop/returns" },
                { label: "Size Guide", to: "/shop/size-guide" }
              ].map(link => (
                <Link key={link.label} to={link.to} className="text-zinc-300 hover:text-white text-sm transition-colors font-medium uppercase tracking-widest text-[11px] hover:translate-x-1 transform duration-300 inline-block">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="lg:col-span-3 flex flex-col space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Elite Access</h4>
            <div className="space-y-4">
              <p className="text-zinc-400 text-[11px] uppercase tracking-wider font-medium leading-relaxed">
                Join our circle for exclusive drops and private events.
              </p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="JOURNAL@BRANDLIFE.COM"
                  className="w-full bg-white/5 border-b border-white/10 focus:border-primary focus:outline-none text-white px-2 py-4 text-[10px] tracking-[0.2em] transition-all duration-500 bg-transparent uppercase"
                />
                <button className="absolute right-0 bottom-4 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-zinc-500 text-[9px] uppercase tracking-[0.4em] font-bold">
            &copy; {new Date().getFullYear()} Brand Life Store &mdash; ALL RIGHTS RESERVED
          </p>
          <div className="flex space-x-8 text-zinc-500 text-[9px] uppercase tracking-[0.3em] font-bold">
            <a href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Terms of Service</a>
          </div>
          <div className="text-zinc-600 text-[9px] font-bold tracking-[0.2em]">
            USA &bull; UK &bull; FR
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;
