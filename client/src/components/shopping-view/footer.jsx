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
    <footer className="bg-muted text-foreground py-16 px-4 md:px-8 border-t border-border">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col space-y-4">
          <Link to="/shop/home" className="flex flex-col items-start gap-0">
            <span className="text-3xl font-bold tracking-tighter leading-none font-serif">BL</span>
            <span className="text-xs font-bold tracking-widest uppercase font-sans mt-1">Brand Life Store</span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mt-2">
            Elevate your everyday style with our premium collection of ethically made, sustainably sourced men's clothing.
          </p>
          <div className="flex space-x-4 pt-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-semibold text-lg">Shop</h4>
          <span onClick={() => handleNavigateToCategory("shirts")} className="text-muted-foreground hover:text-foreground text-sm transition-colors cursor-pointer">Shirts</span>
          <span onClick={() => handleNavigateToCategory("pants")} className="text-muted-foreground hover:text-foreground text-sm transition-colors cursor-pointer">Pants & Jeans</span>
          <span onClick={() => handleNavigateToCategory("outerwear")} className="text-muted-foreground hover:text-foreground text-sm transition-colors cursor-pointer">Outerwear</span>
          <span onClick={() => handleNavigateToCategory("accessories")} className="text-muted-foreground hover:text-foreground text-sm transition-colors cursor-pointer">Accessories</span>
          <span onClick={() => handleNavigateToCategory("footwear")} className="text-muted-foreground hover:text-foreground text-sm transition-colors cursor-pointer">Footwear</span>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-semibold text-lg">Support</h4>
          <Link to="/shop/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact Us</Link>
          <Link to="/shop/faq" className="text-muted-foreground hover:text-foreground text-sm transition-colors">FAQs</Link>
          <Link to="/shop/returns" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Shipping & Returns</Link>
          <Link to="/shop/size-guide" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Size Guide</Link>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-semibold text-lg">Stay in the Loop</h4>
          <p className="text-muted-foreground text-sm">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <div className="flex items-center space-x-2 mt-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground px-4 py-2 rounded-md w-full text-sm"
            />
            <button className="bg-background text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
        <p className="text-muted-foreground text-xs text-center md:text-left">
          &copy; {new Date().getFullYear()} Brand Life Store. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0 text-muted-foreground text-xs">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;
