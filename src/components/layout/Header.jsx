import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Search, ShoppingCart, Heart, User, Menu, X,
  Phone, ChevronDown, Pill, LogOut,
  Home, Package, Bell, UserPlus, LayoutDashboard,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import axiosClient from '../../utils/axiosClient';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const searchWrapRef = useRef(null);
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

  // Debounced smart search suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchQuery.trim().length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axiosClient.get(`/medicines?search=${encodeURIComponent(searchQuery)}&limit=5`);
        const meds = data.medicines || data.data || [];
        setSuggestions(meds.slice(0, 5));
        setShowSuggestions(true);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const pickSuggestion = (med) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/product/${med._id || med.id}`);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const categories = [
    { name: 'أدوية', icon: '💊' },
    { name: 'فيتامينات', icon: '🌿' },
    { name: 'عناية شخصية', icon: '🧴' },
    { name: 'أجهزة طبية', icon: '🩺' },
    { name: 'منتجات الأطفال', icon: '👶' },
    { name: 'مستلزمات طبية', icon: '🏥' },
  ];

  return (
    <>
      {/* ===== MAIN HEADER ===== */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-lg' : 'shadow-sm'
        }`}
        style={{ borderBottom: '1px solid rgba(31,181,201,0.12)' }}
      >
        <div className="max-w-screen-xl mx-auto px-6 h-[74px] flex items-center gap-5">

          {/* ── LOGO (right in RTL) ── */}
          <Link
            to="/"
            className="flex items-center gap-3 flex-shrink-0 order-last group"
          >
            <div
              className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(145deg,#0f3460,#1FB5C9)',
                boxShadow: '0 4px 16px rgba(31,181,201,0.3)',
              }}
            >
              <img
                src="/logo.png"
                alt="صيدلية الأنصار"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <Pill className="w-6 h-6 text-white hidden" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span
                className="text-[17px] font-black"
                style={{
                  background: 'linear-gradient(135deg,#0f3460,#1FB5C9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                صيدلية الأنصار
              </span>
              <span
                className="text-[8px] font-bold tracking-[2.5px] uppercase"
                style={{ color: '#1FB5C9' }}
              >
                ALANSAR PHARMACY
              </span>
            </div>
          </Link>

          {/* ── SEARCH (middle) ── */}
          <div className="flex-1 order-2 relative" ref={searchWrapRef}>
          <form onSubmit={handleSearch}>
            <div
              className="flex items-center h-[48px] rounded-[16px] overflow-hidden transition-all duration-300"
              style={{
                background: '#f4f7fb',
                border: '1.5px solid #e4eaf2',
              }}
              onFocus={(e) =>
                e.currentTarget.style.cssText +=
                  'border-color:#1FB5C9;background:white;box-shadow:0 0 0 4px rgba(31,181,201,0.1)'
              }
              onBlur={(e) =>
                (e.currentTarget.style.cssText =
                  'background:#f4f7fb;border:1.5px solid #e4eaf2;')
              }
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="ابحث عن الأدوية، الفيتامينات، العناية الشخصية..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-gray-700 text-right"
                style={{ fontFamily: 'inherit' }}
                aria-label="بحث عن المنتجات"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
              />
              <button
                type="submit"
                className="w-[52px] h-full flex items-center justify-center flex-shrink-0 transition-opacity duration-200 hover:opacity-85"
                style={{
                  background: 'linear-gradient(135deg,#0f3460,#1FB5C9)',
                }}
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>

          {/* Smart search suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full right-0 left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden" role="listbox">
              {suggestions.map((med) => {
                const id    = med._id || med.id;
                const price = med.finalPrice ?? med.price;
                const img   = med.images?.[0];
                return (
                  <button key={id} onClick={() => pickSuggestion(med)} role="option"
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-50/60 text-right transition-colors">
                    {img
                      ? <img src={img} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-gray-50" />
                      : <div className="w-9 h-9 rounded-lg bg-cyan-50 flex-shrink-0 flex items-center justify-center"><Package className="w-4 h-4 text-pharmacy-cyan/40" /></div>
                    }
                    <span className="flex-1 text-sm text-gray-700 text-right truncate">{med.name}</span>
                    {price != null && <span className="text-xs font-bold text-pharmacy-cyan flex-shrink-0">{Number(price).toFixed(0)} ر.س</span>}
                  </button>
                );
              })}
              <button onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-pharmacy-cyan hover:bg-cyan-50 font-semibold border-t border-gray-100 transition-colors">
                <Search className="w-3.5 h-3.5" />
                عرض كل نتائج &quot;{searchQuery}&quot;
              </button>
            </div>
          )}
          </div>

          {/* ── ICON ACTIONS (left) ── */}
          <div className="flex items-center gap-1 order-1">

            {/* Wishlist */}
            <Link
              to="/favorites"
              className="relative w-11 h-11 rounded-[12px] flex items-center justify-center text-gray-500 hover:bg-[rgba(31,181,201,0.1)] hover:text-[#1FB5C9] transition-all duration-200 group"
              title="المفضلة"
            >
              <Heart className="w-[22px] h-[22px]" />
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-[#0f3460] text-white text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                المفضلة
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-11 h-11 rounded-[12px] flex items-center justify-center text-gray-500 hover:bg-[rgba(31,181,201,0.1)] hover:text-[#1FB5C9] transition-all duration-200 group"
              title="السلة"
            >
              <ShoppingCart className="w-[22px] h-[22px]" />
              {cartCount > 0 && (
                <span
                  className="absolute top-[6px] left-[6px] w-4 h-4 rounded-full text-white text-[8px] font-black flex items-center justify-center border-2 border-white"
                  style={{ background: 'linear-gradient(135deg,#f56565,#ed64a6)' }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-[#0f3460] text-white text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                السلة
              </span>
            </Link>

            {/* Notifications */}
            <button
              className="relative w-11 h-11 rounded-[12px] flex items-center justify-center text-gray-500 hover:bg-[rgba(31,181,201,0.1)] hover:text-[#1FB5C9] transition-all duration-200 group"
              title="الإشعارات"
            >
              <Bell className="w-[22px] h-[22px]" />
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-[#0f3460] text-white text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                الإشعارات
              </span>
            </button>

            {/* Divider */}
            <div className="w-px h-7 bg-gray-200 mx-1" />

            {/* User / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-11 h-11 rounded-[12px] flex items-center justify-center text-[#0f3460] transition-all duration-200 group"
                  style={{
                    background: 'rgba(15,52,96,0.06)',
                    border: '1.5px solid rgba(15,52,96,0.1)',
                  }}
                  title={user.name}
                >
                  <User className="w-[22px] h-[22px]" />
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div
                      className="absolute left-0 mt-2 w-52 rounded-xl shadow-xl z-50 overflow-hidden"
                      style={{
                        background: 'white',
                        border: '1px solid rgba(31,181,201,0.15)',
                      }}
                    >
                      <div
                        className="px-4 py-3 border-b"
                        style={{
                          background:
                            'linear-gradient(135deg,rgba(31,181,201,0.08),rgba(15,52,96,0.05))',
                        }}
                      >
                        <p className="text-sm font-bold text-[#0f3460] truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      {[
                        ...(user.role === 'admin' ? [{ to: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم' }] : []),
                        { to: '/profile', icon: User, label: 'ملفي' },
                        { to: '/orders', icon: Package, label: 'طلباتي' },
                        { to: '/favorites', icon: Heart, label: 'المفضلة' },
                      ].map(({ to, icon: Icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[rgba(31,181,201,0.07)] hover:text-[#1FB5C9] transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Login icon */}
                <Link
                  to="/login"
                  className="w-11 h-11 rounded-[12px] flex items-center justify-center text-[#0f3460] transition-all duration-200 hover:bg-[#0f3460] hover:text-white group"
                  style={{
                    background: 'rgba(15,52,96,0.05)',
                    border: '1.5px solid rgba(15,52,96,0.1)',
                  }}
                  title="دخول"
                >
                  <User className="w-[22px] h-[22px]" />
                  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-[#0f3460] text-white text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    دخول
                  </span>
                </Link>

                {/* Register icon */}
                <Link
                  to="/register"
                  className="relative w-11 h-11 rounded-[12px] flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-0.5 group"
                  style={{
                    background: 'linear-gradient(135deg,#0f3460,#1FB5C9)',
                    boxShadow: '0 4px 14px rgba(31,181,201,0.35)',
                  }}
                  title="تسجيل"
                >
                  <UserPlus className="w-[22px] h-[22px]" />
                  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-[#1FB5C9] text-white text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    تسجيل
                  </span>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-11 h-11 rounded-[12px] flex items-center justify-center text-[#0f3460] hover:bg-[rgba(31,181,201,0.1)] transition-colors mr-1"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== NAV BAR ===== */}
      <nav className="hidden lg:block bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center h-[50px] gap-1">

          {/* Categories button */}
          <div className="relative ml-4">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2 rounded-[11px] transition-all duration-200 hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg,#0f3460,#1a5a96)',
                boxShadow: '0 3px 12px rgba(15,52,96,0.25)',
              }}
            >
              <Menu className="w-4 h-4" />
              جميع الفئات
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  categoriesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {categoriesOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCategoriesOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl z-50 overflow-hidden"
                  style={{
                    background: 'white',
                    border: '1px solid rgba(31,181,201,0.15)',
                  }}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[rgba(31,181,201,0.07)] hover:text-[#1FB5C9] transition-colors"
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Nav links */}
          {[
            { to: '/', label: 'الرئيسية' },
            { to: '/products', label: 'المنتجات' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-4 py-3 text-sm font-semibold text-gray-500 hover:text-[#1FB5C9] relative group transition-colors"
            >
              {label}
              <span
                className="absolute bottom-0 right-1/2 left-1/2 h-[2.5px] rounded-full transition-all duration-300 group-hover:right-[10%] group-hover:left-[10%]"
                style={{ background: 'linear-gradient(90deg,#0f3460,#1FB5C9)' }}
              />
            </Link>
          ))}

          {/* Flash offers */}
          <Link
            to="/products?filter=offers"
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-black text-red-500 hover:text-red-600 relative group transition-colors"
          >
            <span
              className="text-[9px] font-black text-white px-1.5 py-0.5 rounded-[5px]"
              style={{ background: 'linear-gradient(135deg,#e53e3e,#ed64a6)' }}
            >
              HOT
            </span>
            عروض فلاش 🔥
            <span
              className="absolute bottom-0 right-1/2 left-1/2 h-[2.5px] rounded-full transition-all duration-300 group-hover:right-[10%] group-hover:left-[10%]"
              style={{ background: 'linear-gradient(90deg,#e53e3e,#ed64a6)' }}
            />
          </Link>

          {[
            { to: '/about', label: 'من نحن' },
            { to: '/contact', label: 'تواصل معنا' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-4 py-3 text-sm font-semibold text-gray-500 hover:text-[#1FB5C9] relative group transition-colors"
            >
              {label}
              <span
                className="absolute bottom-0 right-1/2 left-1/2 h-[2.5px] rounded-full transition-all duration-300 group-hover:right-[10%] group-hover:left-[10%]"
                style={{ background: 'linear-gradient(90deg,#0f3460,#1FB5C9)' }}
              />
            </Link>
          ))}

          {/* Phone */}
          <a
            href="tel:+966500000000"
            className="mr-auto flex items-center gap-2 px-4 py-1.5 rounded-[10px] text-[#0f3460] text-[13px] font-black transition-all duration-200 hover:opacity-80 flex-shrink-0"
            dir="ltr"
            style={{
              background:
                'linear-gradient(135deg,rgba(31,181,201,0.07),rgba(15,52,96,0.04))',
              border: '1px solid rgba(31,181,201,0.15)',
            }}
          >
            <Phone className="w-[14px] h-[14px] text-[#1FB5C9]" />
            966 50 000 0000+
          </a>
        </div>
      </nav>

      {/* ===== MOBILE MENU DRAWER ===== */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4"
              style={{
                background: 'linear-gradient(135deg,#0f3460,#1FB5C9)',
              }}
            >
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <img src="/logo.png" alt="" className="h-10 w-auto bg-white rounded-lg p-1" />
                <div className="text-white font-bold text-sm leading-tight">
                  <div>صيدلية الأنصار</div>
                  <div className="text-[9px] opacity-80 tracking-widest">ALANSAR PHARMACY</div>
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Links */}
            <div className="p-4 space-y-1">
              {[
                { to: '/', icon: Home, label: 'الرئيسية' },
                { to: '/products', icon: Package, label: 'المنتجات' },
                { to: '/favorites', icon: Heart, label: 'المفضلة' },
                { to: '/cart', icon: ShoppingCart, label: 'السلة' },
              ].map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-[rgba(31,181,201,0.08)] hover:text-[#1FB5C9] transition-colors font-medium text-sm"
                >
                  <Icon className="w-5 h-5 text-[#1FB5C9]" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Auth */}
            {!user && (
              <div className="p-4 border-t border-gray-100 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border-2 border-[#0f3460] text-[#0f3460] font-bold text-sm transition-all hover:bg-[#0f3460] hover:text-white"
                >
                  دخول
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-white font-bold text-sm"
                  style={{
                    background: 'linear-gradient(135deg,#0f3460,#1FB5C9)',
                    boxShadow: '0 4px 14px rgba(31,181,201,0.3)',
                  }}
                >
                  تسجيل
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}