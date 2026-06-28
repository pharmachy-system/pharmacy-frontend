import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, MapPin, LogOut, Truck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../shared/LanguageSwitcher';

const NAV = [
  { to: '/delivery',        icon: LayoutDashboard, label: 'نظرة عامة', end: true },
  { to: '/delivery/orders', icon: Package,         label: 'توصيلاتي' },
];

export default function DeliveryLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-l border-gray-100 flex-shrink-0">
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)' }}>
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-black text-gray-800">لوحة التوصيل</p>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider">Delivery Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`
              }>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700">
              {user?.name?.[0] ?? 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400">مندوب توصيل</p>
            </div>
          </div>
          <LanguageSwitcher compact />
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-3 h-3" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-violet-600' : 'text-gray-400'
              }`
            }>
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>

      <main className="flex-1 overflow-auto pb-16 lg:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
