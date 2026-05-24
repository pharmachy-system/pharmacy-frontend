import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, Home, Package, ClipboardList, LayoutDashboard, Pill } from 'lucide-react';
import { useState } from 'react';

function Header() {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const totalItems = getTotalItems ? getTotalItems() : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Products', icon: Package },
    ...(user ? [{ to: '/orders', label: 'Orders', icon: ClipboardList }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: LayoutDashboard }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl gradient-pharmacy shadow-pharmacy group-hover:scale-105 transition-transform">
              <Pill className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-gradient-pharmacy leading-none">Alansar</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Pharmacy</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.to} to={link.to} className={isActive(link.to) ? 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary' : 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-all'}>
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors group" aria-label="Cart">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-primary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-8 h-8 rounded-full gradient-pharmacy flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-foreground">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-border py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white gradient-pharmacy rounded-lg shadow-pharmacy">Register</Link>
              </div>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-3">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className={isActive(link.to) ? 'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-primary/10 text-primary' : 'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted'}>
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              {!user && (
                <div className="flex gap-2 pt-2 mt-2 border-t border-border">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 px-4 py-2 text-center text-sm font-medium border border-border rounded-lg">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 px-4 py-2 text-center text-sm font-medium text-white gradient-pharmacy rounded-lg">Register</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export { Header };
export default Header;
