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
  CheckCircle,
} from 'lucide-react';

// ============ Social SVG Icons ============
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

// ============ Payment Badge ============
const PaymentBadge = ({ label, text = 'text-gray-800' }) => (
  <div className={`bg-white ${text} h-10 px-3 rounded-lg flex items-center justify-center font-bold text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border border-gray-100 min-w-[64px]`}>
    {label}
  </div>
);

// ============ Trust Badge ============
const TrustBadge = ({ label, sub, color = 'from-pharmacy-cyan to-pharmacy-blue' }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-100 px-3 py-2 flex flex-col items-center justify-center min-w-[80px] hover:shadow-lg hover:-translate-y-0.5 transition-all">
    <span className={`text-[10px] font-bold bg-gradient-to-l ${color} bg-clip-text text-transparent`}>
      {label}
    </span>
    {sub && <span className="text-[8px] text-gray-500 mt-0.5">{sub}</span>}
  </div>
);

// ============ App Store Badge ============
const AppBadge = ({ store, line1, line2 }) => (
  <a
    href="#"
    className="flex items-center gap-2 bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-4 py-2.5 rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl"
  >
    {store === 'apple' ? (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ) : (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 20.5V3.5c0-.7.3-1.3.8-1.7l9.7 10.2-9.7 10.2c-.5-.4-.8-1-.8-1.7zm10.7-8.7L5.4 2.1 17 8.8l-3.3 3zm6.8 3l-2.6 1.5-3.4-3.3 3.4-3.3 2.6 1.5c1 .6 1 1.4 0 2v1.6zm-15.3 8.7L13.7 12l3.3 3-11.6 6.7c-.6.4-1.2.4-1.8-.2z" />
      </svg>
    )}
    <div className="leading-tight text-right">
      <div className="text-[9px] opacity-80">{line1}</div>
      <div className="text-sm font-bold">{line2}</div>
    </div>
  </a>
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
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-cyan-50/40 to-blue-50/50 text-gray-800">
      {/* Decorative gradient circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-pharmacy-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pharmacy-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* ============ Trust Badges Row ============ */}
      <div className="relative border-b border-pharmacy-cyan/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { Icon: Truck, title: 'توصيل سريع', sub: 'خلال ساعات قليلة' },
              { Icon: Shield, title: 'منتجات أصلية 100%', sub: 'من مصادر موثوقة' },
              { Icon: Award, title: 'جودة معتمدة', sub: 'وفق المعايير الصحية' },
              { Icon: CheckCircle, title: 'دفع آمن', sub: 'جميع طرق الدفع' },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg p-4 flex items-center gap-3 border border-white transition-all hover:-translate-y-0.5 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-pharmacy-cyan/20">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-pharmacy-blue">{title}</h4>
                  <p className="text-xs text-gray-600">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Newsletter ============ */}
      <div className="relative border-b border-pharmacy-cyan/10">
        <div className="container mx-auto px-4 py-10">
          <div className="bg-gradient-to-l from-pharmacy-cyan/15 via-white to-pharmacy-blue/10 rounded-3xl p-6 md:p-8 shadow-md border border-white/80">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-right">
                <h3 className="text-2xl font-bold mb-1 bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue bg-clip-text text-transparent">
                  اشترك في النشرة البريدية ✨
                </h3>
                <p className="text-gray-600">احصل على أحدث العروض والخصومات الحصرية</p>
              </div>
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  required
                  className="flex-1 md:w-80 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pharmacy-cyan focus:border-pharmacy-cyan shadow-sm transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-l from-pharmacy-blue to-pharmacy-cyan hover:from-pharmacy-blue hover:to-pharmacy-blue text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:shadow-pharmacy-cyan/30 hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">اشترك</span>
                </button>
              </form>
            </div>
            {subscribed && (
              <p className="text-pharmacy-cyan text-sm mt-3 text-center md:text-right font-semibold">
                ✓ تم الاشتراك بنجاح! شكراً لانضمامك إلينا
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ============ Main Footer Content ============ */}
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img
                src="/logo.png"
                alt="صيدلية الأنصار"
                className="h-14 w-auto group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-12 h-12 rounded-full bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue items-center justify-center" style={{ display: 'none' }}>
                <Pill className="w-7 h-7 text-white" />
              </div>
              <div className="leading-tight border-r-2 border-pharmacy-cyan/30 pr-3">
                <div className="text-lg font-bold bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue bg-clip-text text-transparent">
                  صيدلية الأنصار
                </div>
                <div className="text-[10px] text-pharmacy-cyan tracking-widest font-semibold" dir="ltr">
                  ALANSAR PHARMACY
                </div>
              </div>
            </Link>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              شريكك الموثوق للحصول على أفضل المنتجات الصحية والدوائية بأعلى جودة وأفضل الأسعار. صحتك تهمنا.
            </p>
            <div className="flex items-center gap-2 text-sm bg-gradient-to-l from-pharmacy-cyan/10 to-pharmacy-blue/5 px-3 py-2 rounded-xl w-fit border border-pharmacy-cyan/20">
              <Heart className="w-4 h-4 text-pharmacy-cyan animate-pulse" fill="currentColor" />
              <span className="text-pharmacy-blue font-semibold">صحتك غايتنا</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-pharmacy-blue">
              <span className="w-1 h-5 bg-gradient-to-b from-pharmacy-cyan to-pharmacy-blue rounded-full" />
              روابط سريعة
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'الرئيسية' },
                { to: '/products', label: 'المنتجات' },
                { to: '/about', label: 'من نحن' },
                { to: '/contact', label: 'تواصل معنا' },
                { to: '/orders', label: 'طلباتي' },
                { to: '/favorites', label: 'المفضلة' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-700 hover:text-pharmacy-cyan text-sm flex items-center gap-1.5 transition-all hover:translate-x-1 group"
                  >
                    <ChevronRight className="w-3 h-3 text-pharmacy-cyan group-hover:text-pharmacy-blue transition-colors" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-pharmacy-blue">
              <span className="w-1 h-5 bg-gradient-to-b from-pharmacy-cyan to-pharmacy-blue rounded-full" />
              الأقسام
            </h4>
            <ul className="space-y-2.5">
              {[
                'الأدوية',
                'العناية الشخصية',
                'الفيتامينات والمكملات',
                'مستحضرات التجميل',
                'مستلزمات الأطفال',
                'الأجهزة الطبية',
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-gray-700 hover:text-pharmacy-cyan text-sm flex items-center gap-1.5 transition-all hover:translate-x-1 group"
                  >
                    <ChevronRight className="w-3 h-3 text-pharmacy-cyan group-hover:text-pharmacy-blue transition-colors" />
                    <span>{cat}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-pharmacy-blue">
              <span className="w-1 h-5 bg-gradient-to-b from-pharmacy-cyan to-pharmacy-blue rounded-full" />
              تواصل معنا
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-gray-700 hover:text-pharmacy-cyan transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pharmacy-cyan/20 to-pharmacy-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-pharmacy-cyan" />
                </div>
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-700 hover:text-pharmacy-cyan transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pharmacy-cyan/20 to-pharmacy-blue/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4 text-pharmacy-cyan" />
                </div>
                <a href="tel:+966500000000" dir="ltr">+966 50 000 0000</a>
              </li>
              <li className="flex items-center gap-2.5 text-gray-700 hover:text-pharmacy-cyan transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pharmacy-cyan/20 to-pharmacy-blue/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4 text-pharmacy-cyan" />
                </div>
                <a href="mailto:info@ansarpharmacy.com" className="break-all">info@ansarpharmacy.com</a>
              </li>
              <li className="flex items-start gap-2.5 text-gray-700 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pharmacy-cyan/20 to-pharmacy-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4 text-pharmacy-cyan" />
                </div>
                <span>24/7 خدمة على مدار الساعة</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============ App Download + Social ============ */}
      <div className="relative border-t border-pharmacy-cyan/10 bg-gradient-to-l from-white/60 via-cyan-50/30 to-white/60">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* App Download */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
              <h4 className="font-bold text-lg mb-1 text-pharmacy-blue">حمّل التطبيق الآن 📱</h4>
              <p className="text-gray-600 text-sm mb-4">تسوّق بسهولة من أي مكان وفي أي وقت</p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <AppBadge store="apple" line1="حمّل من" line2="App Store" />
                <AppBadge store="google" line1="حمّل من" line2="Google Play" />
              </div>
            </div>

            {/* Social */}
            <div className="flex flex-col items-center lg:items-end text-center lg:text-left">
              <h4 className="font-bold text-lg mb-1 text-pharmacy-blue">تابعنا على وسائل التواصل</h4>
              <p className="text-gray-600 text-sm mb-4">كن أول من يعرف عروضنا وأخبارنا</p>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                {[
                  { Icon: FacebookIcon, label: 'Facebook', href: 'https://facebook.com', hover: 'hover:bg-[#1877F2]' },
                  { Icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com', hover: 'hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600' },
                  { Icon: TwitterIcon, label: 'Twitter', href: 'https://twitter.com', hover: 'hover:bg-black' },
                  { Icon: TikTokIcon, label: 'TikTok', href: 'https://tiktok.com', hover: 'hover:bg-black' },
                  { Icon: SnapchatIcon, label: 'Snapchat', href: 'https://snapchat.com', hover: 'hover:bg-[#FFFC00] hover:text-black' },
                  { Icon: YoutubeIcon, label: 'YouTube', href: 'https://youtube.com', hover: 'hover:bg-[#FF0000]' },
                ].map(({ Icon, label, href, hover }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-11 h-11 rounded-xl bg-white shadow-md text-pharmacy-blue flex items-center justify-center ${hover} hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300 border border-gray-100`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Payment Methods + Trust Certifications ============ */}
      <div className="relative bg-white border-t border-pharmacy-cyan/10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Payment methods */}
            <div>
              <h4 className="font-bold text-pharmacy-blue text-sm mb-3 text-center lg:text-right flex items-center gap-2 justify-center lg:justify-start">
                <span className="w-1 h-4 bg-gradient-to-b from-pharmacy-cyan to-pharmacy-blue rounded-full" />
                طرق الدفع المتاحة
              </h4>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <PaymentBadge label="VISA" text="text-[#1A1F71]" />
                <PaymentBadge label="Mastercard" text="text-[#EB001B]" />
                <PaymentBadge label="AMEX" text="text-[#006FCF]" />
                <PaymentBadge label="مدى mada" text="text-[#84BD00]" />
                <PaymentBadge label="Apple Pay" text="text-black" />
                <PaymentBadge label="STC Pay" text="text-[#4F2D7F]" />
                <PaymentBadge label="tamara" text="text-[#E50571]" />
                <PaymentBadge label="الدفع عند الاستلام" text="text-pharmacy-blue" />
              </div>
            </div>

            {/* Trust certifications */}
            <div>
              <h4 className="font-bold text-pharmacy-blue text-sm mb-3 text-center lg:text-right flex items-center gap-2 justify-center lg:justify-start">
                <span className="w-1 h-4 bg-gradient-to-b from-pharmacy-cyan to-pharmacy-blue rounded-full" />
                الجهات المعتمدة
              </h4>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <TrustBadge label="SFDA" sub="الغذاء والدواء" />
                <TrustBadge label="معروف" sub="موثوق" color="from-green-600 to-green-400" />
                <TrustBadge label="VAT" sub="ضريبة القيمة" color="from-purple-600 to-pink-500" />
                <TrustBadge label="937" sub="بلاغات الصحة" color="from-red-600 to-orange-500" />
                <TrustBadge label="SSL" sub="موقع آمن" color="from-emerald-600 to-teal-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Legal Info Bar ============ */}
      <div className="relative bg-gradient-to-l from-slate-100 via-white to-slate-100 text-gray-600 border-t border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <p className="text-center text-xs">
            <span className="font-semibold text-pharmacy-blue">رقم السجل التجاري:</span> 1010XXXXXX
            <span className="mx-2 text-gray-300">|</span>
            <span className="font-semibold text-pharmacy-blue">الرقم الضريبي:</span> 3000XXXXXXXX003
            <span className="mx-2 text-gray-300">|</span>
            <span className="font-semibold text-pharmacy-blue">رقم الترخيص:</span> XXX-2026
          </p>
        </div>
      </div>

      {/* ============ Bottom Copyright Bar ============ */}
      <div className="relative bg-gradient-to-l from-pharmacy-blue via-pharmacy-blue/95 to-pharmacy-cyan">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white">
            <p className="flex items-center gap-2">
              © {new Date().getFullYear()}
              <span className="font-bold">صيدلية الأنصار</span>
              <span className="hidden sm:inline opacity-90">— جميع الحقوق محفوظة</span>
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-pharmacy-cyan transition-colors opacity-90 hover:opacity-100">سياسة الخصوصية</Link>
              <span className="opacity-40">•</span>
              <Link to="/terms" className="hover:text-pharmacy-cyan transition-colors opacity-90 hover:opacity-100">الشروط والأحكام</Link>
              <span className="opacity-40">•</span>
              <Link to="/sitemap" className="hover:text-pharmacy-cyan transition-colors opacity-90 hover:opacity-100 hidden md:inline">خريطة الموقع</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
