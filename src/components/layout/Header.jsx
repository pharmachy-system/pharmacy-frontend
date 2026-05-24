import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

// Inline SVG for icons not reliably in lucide-react version
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

  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cartCount = getTotalItems();

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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Promo banner */}
      <div className="bg-gradient-to-r from-pharmacy-cyan to-pharmacy-blue text-white text-center text-xs sm:text-sm py-2 px-4">
        <span className="font-semibold">🚚 توصيل مجاني للطلبات فوق 200 ريال</span>
        <span className="hidden sm:inline mx-3">•</span>
        <span className="hidden sm:inline">خدمة 24/7 على مدار الساعة</span>
      </div>

      {/* Top info bar - hidden on mobile */}
      <div className="hidden md:block bg-pharmacy-blue text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 hover:text-pharmacy-cyan transition-colors">
                <MapPin className="w-4 h-4" />
                <span>إختر طريقة الشحن</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-2 hover:text-pharmacy-cyan transition-colors"
              >
                <SaudiFlagIcon />
                <GlobeIcon className="w-4 h-4" />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>
            <div className="flex items-center gap-6">
              <a href="tel:+966500000000" className="flex items-center gap-2 hover:text-pharmacy-cyan transition-colors" dir="ltr">
                <Phone className="w-4 h-4" />
                <span>خدمة العملاء: 920000000</span>
              </a>
              <Link to="/orders" className="hover:text-pharmacy-cyan transition-colors">
                تتبع طلبي
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
              className="lg:hidden p-2 -mr-2 text-pharmacy-blue hover:bg-gray-100 rounded-lg"
              aria-label="فتح القائمة"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="/logo.png"
                alt="صيدلية الأنصار"
                className="h-12 sm:h-14 w-auto"
                onError={(e) => {
                  // Fallback if logo not found
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center gap-2" style={{ display: 'none' }}>
                <div className="w-10 h-10 rounded-full bg-pharmacy-cyan flex items-center justify-center">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-lg font-bold text-pharmacy-blue leading-none">صيدلية الأنصار</div>
                  <div className="text-xs text-pharmacy-cyan">ALANSAR PHARMACY</div>
                </div>
              </div>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full flex">
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1 px-4 bg-gray-50 border border-gray-200 border-l-0 rounded-l-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  <span>كل الفئات</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن الأدوية، الفيتامينات، العناية الشخصية..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-pharmacy-cyan text-sm"
                />
                <button
                  type="submit"
                  className="px-5 bg-pharmacy-cyan hover:bg-pharmacy-cyan/90 text-white rounded-r-lg transition-colors flex items-center justify-center"
                  aria-label="بحث"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Action icons */}
            <div className="flex items-center gap-1 sm:gap-2 mr-auto">
              {/* Favorites */}
              <Link
                to="/favorites"
                className="hidden sm:flex flex-col items-center px-2 py-1 text-gray-700 hover:text-pharmacy-cyan transition-colors"
              >
                <Heart className="w-6 h-6" />
                <span className="text-[10px] mt-0.5">المفضلة</span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex flex-col items-center px-2 py-1 text-gray-700 hover:text-pharmacy-cyan transition-colors"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -left-2 bg-pharmacy-cyan text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 hidden sm:block">السلة</span>
              </Link>

              {/* User menu / Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex flex-col items-center px-2 py-1 text-gray-700 hover:text-pharmacy-cyan transition-colors"
                  >
                    <User className="w-6 h-6" />
                    <span className="text-[10px] mt-0.5 hidden sm:block">
                      {user.name?.split(' ')[0] || 'حسابي'}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-pharmacy-blue truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4" />
                          الملف الشخصي
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Package className="w-4 h-4" />
                          طلباتي
                        </Link>
                        <Link
                          to="/favorites"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Heart className="w-4 h-4" />
                          المفضلة
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                        >
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
                    className="px-4 py-2 bg-pharmacy-cyan hover:bg-pharmacy-cyan/90 text-white text-sm font-semibold rounded-lg transition-colors"
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
                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:border-pharmacy-cyan text-sm"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-pharmacy-cyan"
                aria-label="بحث"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="hidden lg:block bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1">
            {/* Categories megamenu */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-2 px-5 py-3 bg-pharmacy-cyan text-white font-semibold rounded-t-lg hover:bg-pharmacy-cyan/90 transition-colors"
              >
                <Menu className="w-5 h-5" />
                <span>جميع الفئات</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoriesOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCategoriesOpen(false)}
                  />
                  <div className="absolute top-full right-0 w-72 bg-white rounded-b-lg shadow-xl border border-gray-100 z-50 py-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pharmacy-cyan/10 hover:text-pharmacy-cyan transition-colors"
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick nav links */}
            <Link to="/" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-pharmacy-cyan transition-colors">
              الرئيسية
            </Link>
            <Link to="/products" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-pharmacy-cyan transition-colors">
              المنتجات
            </Link>
            <Link to="/products?filter=offers" className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              <FlameIcon className="w-4 h-4" />
              <span>عروض فلاش</span>
            </Link>
            <Link to="/about" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-pharmacy-cyan transition-colors">
              من نحن
            </Link>
            <Link to="/contact" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-pharmacy-cyan transition-colors">
              تواصل معنا
            </Link>

            <div className="mr-auto flex items-center gap-2 text-sm text-gray-500">
              <span>📞</span>
              <span dir="ltr">+966 50 000 0000</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto lg:hidden shadow-2xl">
            {/* Drawer header */}
            <div className="bg-pharmacy-blue text-white p-4 flex items-center justify-between">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <img src="/logo.png" alt="صيدلية الأنصار" className="h-10 w-auto bg-white rounded p-1" />
                <span className="font-bold">صيدلية الأنصار</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
                aria-label="إغلاق القائمة"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User info (mobile) */}
            {user ? (
              <div className="bg-pharmacy-cyan/10 p-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-pharmacy-blue">مرحباً، {user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            ) : (
              <div className="p-4 border-b border-gray-100 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 border-2 border-pharmacy-cyan text-pharmacy-cyan font-semibold rounded-lg"
                >
                  دخول
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-pharmacy-cyan text-white font-semibold rounded-lg"
                >
                  تسجيل
                </Link>
              </div>
            )}

            {/* Main nav links */}
            <div className="py-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                <Home className="w-5 h-5 text-pharmacy-cyan" />
                <span>الرئيسية</span>
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                <Package className="w-5 h-5 text-pharmacy-cyan" />
                <span>جميع المنتجات</span>
              </Link>
              <Link
                to="/products?filter=offers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
              >
                <FlameIcon className="w-5 h-5" />
                <span>عروض فلاش</span>
              </Link>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                <Heart className="w-5 h-5 text-pharmacy-cyan" />
                <span>المفضلة</span>
              </Link>
              {user && (
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                >
                  <Package className="w-5 h-5 text-pharmacy-cyan" />
                  <span>طلباتي</span>
                </Link>
              )}
            </div>

            {/* Categories */}
            <div className="border-t border-gray-100 py-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">الفئات</p>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>

            {/* Bottom links */}
            <div className="border-t border-gray-100 py-2">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                من نحن
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                تواصل معنا
              </Link>
            </div>

            {/* Logout (if logged in) */}
            {user && (
              <div className="border-t border-gray-100 p-4">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}

            {/* Contact info */}
            <div className="bg-gray-50 p-4 mt-2 text-sm text-gray-600">
              <a href="tel:+966500000000" className="flex items-center gap-2 mb-2" dir="ltr">
                <Phone className="w-4 h-4 text-pharmacy-cyan" />
                <span>+966 50 000 0000</span>
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
