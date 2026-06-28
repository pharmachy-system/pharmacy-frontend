import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  ChevronRight, Pill, TrendingUp, Warehouse, Tag,
  BarChart2, Layers, Award, Zap, MapPin, Settings, BookOpen,
} from 'lucide-react';

const NAV = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Overview',   end: true },
  { to: '/admin/products',     icon: Package,         label: 'Products' },
  { to: '/admin/orders',       icon: ShoppingCart,    label: 'Orders' },
  { to: '/admin/users',        icon: Users,           label: 'Users' },
  { to: '/admin/analytics',    icon: TrendingUp,      label: 'Analytics' },
  { to: '/admin/inventory',    icon: Warehouse,       label: 'Inventory' },
  { to: '/admin/coupons',      icon: Tag,             label: 'Coupons' },
  { to: '/admin/reports',      icon: BarChart2,       label: 'Reports' },
  { to: '/admin/categories',   icon: Layers,          label: 'Categories' },
  { to: '/admin/brands',       icon: Award,           label: 'Brands' },
  { to: '/admin/flash-sales',  icon: Zap,             label: 'Flash Sales' },
  { to: '/admin/delivery-zones', icon: MapPin,        label: 'Delivery' },
  { to: '/admin/articles',     icon: BookOpen,        label: 'Articles' },
  { to: '/admin/settings',     icon: Settings,        label: 'Settings' },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50" dir="ltr">

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-100 flex-shrink-0">
        {/* Logo strip */}
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#0f3460,#1FB5C9)' }}>
            <Pill className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-black text-gray-800">Admin Panel</p>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider">Alansar Pharmacy</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`
              }>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          <NavLink to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" />
            Back to Store
          </NavLink>
        </div>
      </aside>

      {/* ── Mobile top nav ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-cyan-600' : 'text-gray-400'
              }`
            }>
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto pb-16 lg:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
