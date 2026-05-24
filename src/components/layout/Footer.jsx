import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Pill,
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  Send,
  ChevronRight,
  Award,
  Shield,
  Truck,
} from 'lucide-react';

// Inline SVG social icons (lucide-react version doesn't include these)
const FacebookIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TwitterIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.1z" />
  </svg>
);

const SnapchatIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.166.151c.18 0 .369.004.555.014 1.715.073 3.32.873 4.404 2.184a6.27 6.27 0 011.412 3.834c.024.515.011 1.044-.012 1.555l-.01.171c-.018.394-.036.802-.044 1.21.083.044.225.092.428.092.31-.013.677-.114 1.06-.292.12-.057.252-.086.388-.086.155 0 .314.03.45.087h.012c.395.142.65.42.658.717.005.387-.346.722-1.04.997-.077.03-.171.061-.27.094-.355.116-.892.293-1.04.642-.075.18-.045.412.087.71l.011.022c.045.105 1.123 2.598 3.555 3.001.197.033.337.21.323.412a.557.557 0 01-.027.143c-.197.46-1.025.798-2.541 1.04-.05.067-.1.295-.131.435-.029.135-.061.272-.105.42-.052.182-.183.27-.412.27h-.022c-.105 0-.256-.018-.45-.056-.276-.057-.553-.086-.84-.086a4.4 4.4 0 00-.685.057c-.4.067-.74.307-1.137.585-.57.4-1.214.852-2.197.852-.034 0-.07-.001-.105-.005h-.115c-.984 0-1.625-.452-2.195-.851-.398-.281-.74-.518-1.137-.585a4.4 4.4 0 00-.682-.057c-.31 0-.557.044-.84.097-.198.039-.347.057-.45.057H4.61c-.252 0-.395-.116-.435-.286-.04-.143-.069-.286-.097-.42-.034-.143-.084-.376-.132-.435-1.524-.244-2.352-.582-2.548-1.038a.583.583 0 01-.024-.142.396.396 0 01.323-.412c2.43-.402 3.51-2.895 3.553-3l.013-.025c.135-.301.166-.532.092-.71-.15-.355-.683-.527-1.04-.643-.097-.034-.193-.064-.27-.094-.95-.376-1.078-.808-1.04-.978.052-.297.348-.55.713-.617a.585.585 0 00.155-.019c.135-.058.293-.085.45-.085.135 0 .265.027.388.084.382.18.715.27 1.054.286.207 0 .355-.041.45-.09a26.6 26.6 0 00-.044-1.21l-.01-.117c-.024-.518-.05-1.054-.025-1.61.124-3.156 2.435-5.305 3.755-5.872.55-.234 1.146-.396 1.768-.486l.275-.034c.276-.034.564-.069.835-.069l.155-.005z" />
  </svg>
);

const YoutubeIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-pharmacy-blue text-white">
      {/* Trust badges */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pharmacy-cyan/20 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-pharmacy-cyan" />
              </div>
              <div>
                <h4 className="font-bold">توصيل سريع</h4>
                <p className="text-sm text-white/70">خلال ساعات قليلة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pharmacy-cyan/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-pharmacy-cyan" />
              </div>
              <div>
                <h4 className="font-bold">منتجات أصلية 100%</h4>
                <p className="text-sm text-white/70">من مصادر موثوقة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pharmacy-cyan/20 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-pharmacy-cyan" />
              </div>
              <div>
                <h4 className="font-bold">جودة معتمدة</h4>
                <p className="text-sm text-white/70">وفق المعايير الصحية</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/10 bg-pharmacy-blue/50">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">اشترك في النشرة البريدية</h3>
              <p className="text-white/70">اعرف أحدث العروض والمنتجات الجديدة</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
                className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pharmacy-cyan"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-pharmacy-cyan hover:bg-pharmacy-cyan/90 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">اشترك</span>
              </button>
            </form>
          </div>
          {subscribed && (
            <p className="text-pharmacy-cyan text-sm mt-3 text-center md:text-right">
              ✓ تم الاشتراك بنجاح!
            </p>
          )}
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-pharmacy-cyan flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Ansar Pharmacy</span>
            </Link>
            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              صيدلية الأنصار، شريكك الموثوق للحصول على أفضل المنتجات الصحية والدوائية بأعلى جودة وأفضل الأسعار.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Heart className="w-4 h-4 text-pharmacy-cyan" />
              <span>صحتك تهمنا</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'الرئيسية' },
                { to: '/products', label: 'المنتجات' },
                { to: '/about', label: 'من نحن' },
                { to: '/contact', label: 'تواصل معنا' },
                { to: '/orders', label: 'طلباتي' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-pharmacy-cyan text-sm flex items-center gap-1 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-4">الأقسام</h4>
            <ul className="space-y-2">
              {[
                'الأدوية',
                'العناية الشخصية',
                'الفيتامينات',
                'مستحضرات التجميل',
                'مستلزمات الأطفال',
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/products"
                    className="text-white/70 hover:text-pharmacy-cyan text-sm flex items-center gap-1 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/70">
                <MapPin className="w-4 h-4 text-pharmacy-cyan mt-0.5 flex-shrink-0" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Phone className="w-4 h-4 text-pharmacy-cyan flex-shrink-0" />
                <a href="tel:+966500000000" className="hover:text-pharmacy-cyan transition-colors" dir="ltr">
                  +966 50 000 0000
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Mail className="w-4 h-4 text-pharmacy-cyan flex-shrink-0" />
                <a href="mailto:info@ansarpharmacy.com" className="hover:text-pharmacy-cyan transition-colors">
                  info@ansarpharmacy.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/70">
                <Clock className="w-4 h-4 text-pharmacy-cyan mt-0.5 flex-shrink-0" />
                <span>24/7 خدمة على مدار الساعة</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm font-semibold">تابعنا على وسائل التواصل</p>
            <div className="flex items-center gap-3">
              {[
                { Icon: FacebookIcon, label: 'Facebook', href: 'https://facebook.com', hover: 'hover:text-[#1877F2]' },
                { Icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com', hover: 'hover:text-[#E4405F]' },
                { Icon: TwitterIcon, label: 'Twitter', href: 'https://twitter.com', hover: 'hover:text-black' },
                { Icon: TikTokIcon, label: 'TikTok', href: 'https://tiktok.com', hover: 'hover:text-black' },
                { Icon: SnapchatIcon, label: 'Snapchat', href: 'https://snapchat.com', hover: 'hover:text-[#FFFC00]' },
                { Icon: YoutubeIcon, label: 'YouTube', href: 'https://youtube.com', hover: 'hover:text-[#FF0000]' },
              ].map(({ Icon, label, href, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 rounded-full bg-white text-pharmacy-blue flex items-center justify-center ${hover} hover:scale-110 transition-all duration-200 shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black/20 border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-white/60">
            <p>© {new Date().getFullYear()} Ansar Pharmacy. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-pharmacy-cyan transition-colors">سياسة الخصوصية</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-pharmacy-cyan transition-colors">الشروط والأحكام</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
