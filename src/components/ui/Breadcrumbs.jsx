import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

const LABELS = {
#  products: .claude .env .git .gitignore README.md eslint.config.js index.html node_modules package-lock.json package.json postcss.config.js public src tailwind.config.js tailwind.config.js.backup vite.config.js .claude .env .git .gitignore README.md eslint.config.js index.html node_modules package-lock.json package.json postcss.config.js public src tailwind.config.js tailwind.config.js.backup vite.config.js ', medicines: '
', cart: '',
  checkout: '''''''''', orders: .claude .env .git .gitignore README.md eslint.config.js index.html node_modules package-lock.json package.json postcss.config.js public src tailwind.config.js tailwind.config.js.backup vite.config.js ', profile: '',
  wishlist: ', ',
  'drug-interactions': .claude .env .git .gitignore README.md eslint.config.js index.html node_modules package-lock.json package.json postcss.config.js public src tailwind.config.js tailwind.config.js.backup vite.config.js .claude .env .git .gitignore README.md eslint.config.js index.html node_modules package-lock.json package.json postcss.config.js public src tailwind.config.js tailwind.config.js.backup vite.config.', categories: '',
  search: .claude .env .git .gitignore README.md eslint.config.js index.html node_modules package-lock.json package.json postcss.config.js public src tailwind.config.js tailwind.config.js.backup vite.config.js  ', '''''',
};

export default function Breadcrumbs({ custom = [] }) {
  const location = useLocation();
  const crumbs = custom.length > 0 ? custom :
    location.pathname.split('/').filter(Boolean).map((seg, i, arr) => ({
      label: LABELS[seg] || decodeURIComponent(seg),
      path: '/' + arr.slice(0, i + 1).join('/'),
    }));
  if (crumbs.length === 0) return null;
  return (
    <nav className="flex items-center gap-1 text-sm text-white/40 mb-6" dir="rtl">
      <Link to="/" className="flex items-center gap-1 hover:text-[#1FB5C9] transition-colors">
        <Home className="w-3.5 h-3.5" /><span></span>
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
          {i === crumbs.length - 1
            ? <span className="text-white/70 font-medium">{crumb.label}</span>
            : <Link to={crumb.path} className="hover:text-[#1FB5C9] transition-colors">{crumb.label}</Link>
          }
        </span>
      ))}
    </nav>
  );
}
