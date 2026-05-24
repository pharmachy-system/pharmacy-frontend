import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  MapPin,
  Phone,
  ChevronDown,
  Pill,
  LogOut,
  Home,
  Package,
  Truck,
  Clock,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

// Inline SVG icons
const FlameIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.5 2C9 6 6 8 6 13a6 6 0 0012 0c0-2-1-4-2-5 0 2-2 3-2 1 0-3-1-5-1.5-7zM12 20a3 3 0 01-3-3c0-1.5 1-2.5 2-3 0 1 .5 1.5 1.5 1.5 1 0 1.5-.5 1.5-1.5 1 1 1 2 1 3a3 3 0 01-3 3z" />
  </svg>
);

const GlobeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const SaudiFlagIcon = ({ className = 'w-5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 16" aria-hidden="true">
    <rect width="24" height="16" fill="#006C35" rx="2" />
    <text x="12" y="11" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">SA</text>
  </svg>
);

const categories = [
  { name: 'الأدوية', icon: '💊' },
  { name: 'العناية الشخصية', icon: '🧴' },
  { name: 'الفيتامينات والمكملات', icon: '💪' },
  { name: 'مستحضرات التجميل', icon: '💄' },
  { name: 'مستلزمات الأطفال', icon: '👶' },
  { name: 'العناية بالشعر', icon: '💇' },
  { name: 'العناية بالبشرة', icon: '✨' },
  { name: 'الأجهزة الطبية', icon: '🩺' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('ar');
  const [scrolled, setScrolled] = useState(false);

  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cartCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      {/* Animated promo banner with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pharmacy-cyan via-teal-500 to-pharmacy-blue text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="relative container mx-auto px-4 py-2.5">
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium flex-wrap">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                <Truck className="w-4 h-4" />
              </div>
              <span>توصيل مجاني للطلبات فوق <span className="font-bold">200 ريال</span></span>
            </div>
            <span className="hidden sm:inline text-white/40">•</span>
            <div className="hidden sm:flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                <Clock className="w-4 h-4" />
              </div>
              <span>خدمة <span className="font-bold">24/7</span> على مدار الساعة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top info bar */}
      <div className="hidden md:block bg-gradient-to-r from-pharmacy-blue via-pharmacy-blue/95 to-pharmacy-blue text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <button className="group flex items-center gap-2 hover:text-pharmacy-cyan transition-colors">
                <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>إختر طريقة الشحن</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-2 hover:text-pharmacy-cyan transition-colors group"
              >
                <SaudiFlagIcon />
                <GlobeIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>
            <div className="flex items-center gap-6">
              <a href="tel:+966500000000" className="flex items-center gap-2 hover:text-pharmacy-cyan transition-colors" dir="ltr">
                <Phone className="w-4 h-4" />
                <span>خدمة العملاء: 920000000</span>
              </a>
              <Link to="/orders" className="hover:text-pharmacy-cyan transition-colors flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>تتبع طلبي</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -mr-2 text-pharmacy-blue hover:bg-pharmacy-cyan/10 rounded-lg transition-colors"
              aria-label="فتح القائمة"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo + Brand text */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="صيدلية الأنصار"
                  className="h-14 sm:h-16 w-auto group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-12 h-12 rounded-full bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue items-center justify-center" style={{ display: 'none' }}>
                  <Pill className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="hidden sm:flex flex-col leading-tight border-r-2 border-pharmacy-cyan/30 pr-3">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue bg-clip-text text-transparent">
                  صيدلية الأنصار
                </span>
                <span className="text-[10px] md:text-xs font-semibold text-pharmacy-cyan tracking-widest" dir="ltr">
                  ALANSAR PHARMACY
                </span>
              </div>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-2">
              <div className="relative w-full flex shadow-sm hover:shadow-md transition-shadow rounded-xl">
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1 px-4 bg-gray-50 border border-gray-200 border-l-0 rounded-r-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  <span>كل الفئات</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن الأدوية، الفيتامينات، العناية الشخصية..."
                  className="flex-1 px-4 py-3 border-y border-gray-200 focus:outline-none focus:border-pharmacy-cyan text-sm bg-white"
                />
                <button
                  type="submit"
                  className="px-6 bg-gradient-to-l from-pharmacy-blue to-pharmacy-cyan hover:from-pharmacy-blue hover:to-pharmacy-blue text-white rounded-l-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
                  aria-label="بحث"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Action icons */}
            <div className="flex items-center gap-1 sm:gap-3 mr-auto">
              <Link
                to="/favorites"
                className="hidden sm:flex flex-col items-center px-2 py-1 text-gray-700 hover:text-pharmacy-cyan transition-all hover:-translate-y-0.5 group"
              >
                <div className="relative p-2 group-hover:bg-pharmacy-cyan/10 rounded-full transition-colors">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-[10px] mt-0.5 font-medium">المفضلة</span>
              </Link>

              <Link
                to="/cart"
                className="relative flex flex-col items-center px-2 py-1 text-gray-700 hover:text-pharmacy-cyan transition-all hover:-translate-y-0.5 group"
              >
                <div className="relative p-2 group-hover:bg-pharmacy-cyan/10 rounded-full transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -left-1 bg-gradient-to-br from-red-500 to-pink-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-md animate-pulse">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 font-medium hidden sm:block">السلة</span>
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex flex-col items-center px-2 py-1 text-gray-700 hover:text-pharmacy-cyan transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="p-2 group-hover:bg-pharmacy-cyan/10 rounded-full transition-colors">
                      <User className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] mt-0.5 font-medium hidden sm:block">
                      {user.name?.split(' ')[0] || 'حسابي'}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                        <div className="px-4 py-3 bg-gradient-to-l from-pharmacy-cyan/10 to-pharmacy-blue/5 border-b border-gray-100">
                          <p className="text-sm font-bold text-pharmacy-blue truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pharmacy-cyan/5 hover:text-pharmacy-cyan transition-colors">
                          <User className="w-4 h-4" />
                          الملف الشخصي
                        </Link>
                        <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pharmacy-cyan/5 hover:text-pharmacy-cyan transition-colors">
                          <Package className="w-4 h-4" />
                          طلباتي
                        </Link>
                        <Link to="/favorites" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pharmacy-cyan/5 hover:text-pharmacy-cyan transition-colors">
                          <Heart className="w-4 h-4" />
                          المفضلة
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full text-right px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition-colors">
                          <LogOut className="w-4 h-4" />
                          تسجيل الخروج
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:block px-4 py-2 text-pharmacy-blue hover:text-pharmacy-cyan text-sm font-semibold transition-colors"
                  >
                    دخول
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-gradient-to-l from-pharmacy-blue to-pharmacy-cyan hover:from-pharmacy-blue hover:to-pharmacy-blue text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                  >
                    تسجيل
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          <form onSubmit={handleSearch} className="md:hidden mt-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن المنتجات..."
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:border-pharmacy-cyan focus:ring-2 focus:ring-pharmacy-cyan/20 text-sm shadow-sm"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue text-white rounded-lg shadow-sm"
                aria-label="بحث"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="hidden lg:block bg-gradient-to-l from-gray-50 via-white to-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-l from-pharmacy-blue to-pharmacy-cyan text-white font-bold rounded-t-xl hover:shadow-lg transition-all"
              >
                <Menu className="w-5 h-5" />
                <span>جميع الفئات</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoriesOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCategoriesOpen(false)} />
                  <div className="absolute top-full right-0 w-80 bg-white rounded-b-xl shadow-2xl border border-gray-100 z-50 py-2 overflow-hidden">
                    <div className="bg-gradient-to-l from-pharmacy-cyan/10 to-transparent px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-pharmacy-blue uppercase tracking-wider">تسوّق حسب الفئة</p>
                    </div>
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-l hover:from-pharmacy-cyan/10 hover:to-transparent hover:text-pharmacy-cyan transition-all group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                        <span className="font-medium">{cat.name}</span>
                        <ChevronDown className="w-3 h-3 -rotate-90 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link to="/" className="px-4 py-3.5 text-sm font-semibold text-gray-700 hover:text-pharmacy-cyan transition-colors relative group">
              الرئيسية
              <span className="absolute bottom-0 right-1/2 translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-pharmacy-cyan to-pharmacy-blue group-hover:w-3/4 transition-all duration-300" />
            </Link>
            <Link to="/products" className="px-4 py-3.5 text-sm font-semibold text-gray-700 hover:text-pharmacy-cyan transition-colors relative group">
              المنتجات
              <span className="absolute bottom-0 right-1/2 translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-pharmacy-cyan to-pharmacy-blue group-hover:w-3/4 transition-all duration-300" />
            </Link>
            <Link to="/products?filter=offers" className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
              <FlameIcon className="w-4 h-4 animate-pulse" />
              <span>عروض فلاش</span>
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">HOT</span>
            </Link>
            <Link to="/about" className="px-4 py-3.5 text-sm font-semibold text-gray-700 hover:text-pharmacy-cyan transition-colors relative group">
              من نحن
              <span className="absolute bottom-0 right-1/2 translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-pharmacy-cyan to-pharmacy-blue group-hover:w-3/4 transition-all duration-300" />
            </Link>
            <Link to="/contact" className="px-4 py-3.5 text-sm font-semibold text-gray-700 hover:text-pharmacy-cyan transition-colors relative group">
              تواصل معنا
              <span className="absolute bottom-0 right-1/2 translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-pharmacy-cyan to-pharmacy-blue group-hover:w-3/4 transition-all duration-300" />
            </Link>

            <div className="mr-auto flex items-center gap-2 text-sm font-semibold">
              <div className="flex items-center gap-1.5 bg-gradient-to-l from-pharmacy-cyan/10 to-pharmacy-blue/10 px-3 py-1.5 rounded-full">
                <Phone className="w-4 h-4 text-pharmacy-cyan" />
                <span className="text-pharmacy-blue" dir="ltr">+966 50 000 0000</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto lg:hidden shadow-2xl">
            <div className="bg-gradient-to-l from-pharmacy-blue to-pharmacy-cyan text-white p-4 flex items-center justify-between">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <img src="/logo.png" alt="صيدلية الأنصار" className="h-10 w-auto bg-white rounded-lg p-1" />
                <div className="leading-tight">
                  <div className="font-bold">صيدلية الأنصار</div>
                  <div className="text-[10px] opacity-90" dir="ltr">ALANSAR PHARMACY</div>
                </div>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg" aria-label="إغلاق">
                <X className="w-6 h-6" />
              </button>
            </div>

            {user ? (
              <div className="bg-gradient-to-l from-pharmacy-cyan/10 to-pharmacy-blue/5 p-4 border-b border-gray-100">
                <p className="text-sm font-bold text-pharmacy-blue">مرحباً، {user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            ) : (
              <div className="p-4 border-b border-gray-100 flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 border-2 border-pharmacy-cyan text-pharmacy-cyan font-bold rounded-xl">
                  دخول
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 bg-gradient-to-l from-pharmacy-blue to-pharmacy-cyan text-white font-bold rounded-xl shadow-md">
                  تسجيل
                </Link>
              </div>
            )}

            <div className="py-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pharmacy-cyan/5 hover:text-pharmacy-cyan transition-colors">
                <Home className="w-5 h-5 text-pharmacy-cyan" />
                <span className="font-medium">الرئيسية</span>
              </Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pharmacy-cyan/5 hover:text-pharmacy-cyan transition-colors">
                <Package className="w-5 h-5 text-pharmacy-cyan" />
                <span className="font-medium">جميع المنتجات</span>
              </Link>
              <Link to="/products?filter=offers" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors">
                <FlameIcon className="w-5 h-5 animate-pulse" />
                <span className="font-bold">عروض فلاش</span>
                <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold mr-auto">HOT</span>
              </Link>
              <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pharmacy-cyan/5 hover:text-pharmacy-cyan transition-colors">
                <Heart className="w-5 h-5 text-pharmacy-cyan" />
                <span className="font-medium">المفضلة</span>
              </Link>
              {user && (
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pharmacy-cyan/5 hover:text-pharmacy-cyan transition-colors">
                  <Package className="w-5 h-5 text-pharmacy-cyan" />
                  <span className="font-medium">طلباتي</span>
                </Link>
              )}
            </div>

            <div className="border-t border-gray-100 py-2">
              <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">الفئات</p>
              {categories.map((cat) => (
                <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pharmacy-cyan/5 hover:text-pharmacy-cyan transition-colors">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 py-2">
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                من نحن
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                تواصل معنا
              </Link>
            </div>

            {user && (
              <div className="border-t border-gray-100 p-4">
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">تسجيل الخروج</span>
                </button>
              </div>
            )}

            <div className="bg-gradient-to-l from-pharmacy-cyan/5 to-pharmacy-blue/5 p-4 mt-2 text-sm text-gray-700">
              <a href="tel:+966500000000" className="flex items-center gap-2 mb-2 hover:text-pharmacy-cyan transition-colors" dir="ltr">
                <Phone className="w-4 h-4 text-pharmacy-cyan" />
                <span className="font-semibold">+966 50 000 0000</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pharmacy-cyan" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
