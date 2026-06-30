import { Link } from "wouter";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  }

  return (
    <footer className="bg-foreground text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-serif text-2xl tracking-widest" style={{ letterSpacing: "0.15em" }}>ELARA</span>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Celebrating the artistry of Indian ethnic fashion. Each piece tells a story of craft, tradition, and timeless elegance.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Instagram size={18} /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-5 text-white/80">Collections</h3>
            <ul className="space-y-3">
              {["Sarees", "Lehengas", "Kurtas", "Gowns", "Suits", "Dupattas"].map((item) => (
                <li key={item}>
                  <Link href={`/category/${item.toLowerCase()}`} className="text-sm text-white/60 hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-5 text-white/80">Customer Care</h3>
            <ul className="space-y-3">
              {["Size Guide", "Shipping & Returns", "Care Instructions", "FAQs", "Track Order", "Contact Us"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-5 text-white/80">Newsletter</h3>
            <p className="text-sm text-white/60 mb-4">Join our world — be the first to know about new collections and exclusive offers.</p>
            {subscribed ? (
              <p className="text-sm text-primary font-medium">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm px-4 py-2.5 outline-none focus:border-white/50 transition-colors"
                  data-testid="input-newsletter-email"
                />
                <button type="submit" className="bg-primary text-primary-foreground text-sm px-4 py-2.5 hover:bg-primary/90 transition-colors font-medium tracking-wider" data-testid="button-newsletter-subscribe">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">&copy; 2024 Elara. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
