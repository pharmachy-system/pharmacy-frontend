import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

const LABELS = {
  products:            'المنتجات',
  medicines:           'الأدوية',
  cart:                'سلة التسوق',
  checkout:            'إتمام الطلب',
  orders:              'طلباتي',
  profile:             'الملف الشخصي',
  wishlist:            'قائمة الرغبات',
  'drug-interactions': 'تفاعلات الدواء',
  categories:          'التصنيفات',
  search:              'نتائج البحث',
  prescriptions:       'الوصفات الطبية',
  notifications:       'الإشعارات',
  settings:            'الإعدادات',
  addresses:           'العناوين',
  loyalty:             'نقاط الولاء',
  wallet:              'المحفظة',
  referral:            'الإحالة',
  account:             'حسابي',
  consultation:        'الاستشارة',
  articles:            'المقالات',
};

export default function Breadcrumbs({ custom = [] }) {
  const location = useLocation();

  const crumbs = custom.length > 0
    ? custom
    : location.pathname
        .split('/')
        .filter(Boolean)
        .map((seg, i, arr) => ({
          label: LABELS[seg] || decodeURIComponent(seg),
          path: '/' + arr.slice(0, i + 1).join('/'),
        }));

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm text-white/40 mb-6" dir="rtl">
      <Link to="/" className="flex items-center gap-1 hover:text-pharmacy-cyan transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>الرئيسية</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
          {i === crumbs.length - 1
            ? <span className="text-white/70 font-medium">{crumb.label}</span>
            : <Link to={crumb.path} className="hover:text-pharmacy-cyan transition-colors">{crumb.label}</Link>
          }
        </span>
      ))}
    </nav>
  );
}
