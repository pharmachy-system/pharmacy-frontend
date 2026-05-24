import { Link } from 'react-router-dom';
import { Pill, MapPin, Phone, Mail, Clock, Heart, Send, ChevronRight, Award, Shield, Truck, Facebook, Instagram, Twitter, Youtube, Linkedin, MessageCircle } from 'lucide-react';
import { useState } from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy' },
  ];

  const categories = [
    { label: 'Prescription Drugs', to: '/products' },
    { label: 'Personal Care', to: '/products' },
    { label: 'Vitamins & Supplements', to: '/products' },
    { label: 'Baby & Mother Care', to: '/products' },
    { label: 'Medical Devices', to: '/products' },
  ];

  const trustBadges = [
    { icon: Shield, label: 'Secure Payment' },
    { icon: Truck, label: 'Fast Delivery' },
    { icon: Award, label: 'Quality Assured' },
  ];

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', color: 'hover:bg-blue-600', Icon: Facebook },
    { name: 'Instagram', url: 'https://instagram.com', color: 'hover:bg-pink-600', Icon: Instagram },
    { name: 'Twitter', url: 'https://twitter.com', color: 'hover:bg-sky-500', Icon: Twitter },
    { name: 'WhatsApp', url: 'https://wa.me/970599123456', color: 'hover:bg-green-500', Icon: MessageCircle },
    { name: 'LinkedIn', url: 'https://linkedin.com', color: 'hover:bg-blue-700', Icon: Linkedin },
    { name: 'YouTube', url: 'https://youtube.com', color: 'hover:bg-red-600', Icon: Youtube },
  ];

  return (
    <footer className="relative bg-secondary text-white mt-auto overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative">
        <div className="border-b border-white/10">
          <div className="container mx-auto px-4 py-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Stay Updated with Health Tips</h3>
                <p className="text-white/70">Subscribe for exclusive offers and wellness advice</p>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button type="submit" className="px-6 py-3 gradient-pharmacy rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform">
                  Subscribe
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            <div>
              <Link to="/" className="flex items-center gap-3 mb-5 group">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl gradient-pharmacy group-hover:scale-110 transition-transform">
                  <Pill className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold leading-none">Alansar</span>
                  <span className="text-xs text-primary mt-0.5">Pharmacy</span>
                </div>
              </Link>
              <p className="text-sm text-white/70 mb-6 leading-relaxed">
                Your trusted partner in health. Quality healthcare products with care.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {trustBadges.map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 border border-white/10">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-[10px] text-white/70 text-center">{badge.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-5 text-lg flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary"></span>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-white/70 hover:text-primary transition-colors inline-flex items-center gap-2 group">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-5 text-lg flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary"></span>
                Categories
              </h3>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.label}>
                    <Link to={cat.to} className="text-sm text-white/70 hover:text-primary transition-colors inline-flex items-center gap-2 group">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-5 text-lg flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary"></span>
                Get in Touch
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="pt-1.5">123 Main Street, City Center</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <a href="tel:+970599123456" className="hover:text-primary">+970 599 123 456</a>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <a href="mailto:info@alansar.com" className="hover:text-primary">info@alansar.com</a>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <span className="pt-1.5">Open 24/7</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h4 className="text-lg font-bold mb-1">Connect With Us</h4>
                <p className="text-sm text-white/60">Follow us on social media</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => {
                  const SocialIcon = social.Icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className={"w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:scale-110 hover:border-transparent " + social.color}
                    >
                      <SocialIcon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/20">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
              <p className="text-white/60">
                © {currentYear} <span className="text-primary font-semibold">Alansar Pharmacy</span>. All rights reserved.
              </p>
              <p className="text-white/60 flex items-center gap-1.5">
                Made with <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" /> for your health
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
export default Footer;
