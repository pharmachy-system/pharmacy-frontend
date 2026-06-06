import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const mockProducts = [
  { id: 'p001', nameAr: 'فيتامين سي 1000mg', price: 45, emoji: '🍊', category: 'فيتامينات' },
  { id: 'p002', nameAr: 'أوميغا 3', price: 89, emoji: '🐟', category: 'مكملات' },
  { id: 'p003', nameAr: 'زنك وماغنيسيوم', price: 35, emoji: '💊', category: 'مكملات' },
  { id: 'p004', nameAr: 'كولاجين بيبتيد', price: 110, emoji: '✨', category: 'تجميل' },
  { id: 'p005', nameAr: 'فيتامين د3', price: 55, emoji: '☀️', category: 'فيتامينات' },
  { id: 'p006', nameAr: 'مرهم ديرموفيت', price: 38, emoji: '🧴', category: 'جلدية' },
];

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      const filtered = mockProducts.filter(p =>
        p.nameAr.includes(query) || p.category.includes(query)
      );
      setResults(filtered);
    } else {
      setResults(mockProducts);
    }
  }, [query]);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <Search size={24} style={{color:'#1FB5C9'}}/>
          <h1 className="text-2xl font-black text-gray-800">نتائج البحث</h1>
        </div>
        {query && (
          <p className="text-gray-500 mb-8">
            نتائج البحث عن: <span className="font-bold text-gray-800">"{query}"</span>
            {' '}— {results.length} نتيجة
          </p>
        )}

        {results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h2>
            <p className="text-gray-500 mb-6">جرب كلمات بحث مختلفة</p>
            <Link to="/products" className="px-8 py-3 rounded-full text-white font-bold" style={{background:'linear-gradient(135deg,#1FB5C9,#1B3D6F)'}}>
              تصفح جميع المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {results.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-5xl text-center mb-3">{p.emoji}</div>
                <h3 className="font-bold text-center text-gray-800 mb-1">{p.nameAr}</h3>
                <p className="text-center text-xs text-gray-400 mb-2">{p.category}</p>
                <p className="text-center font-black text-xl" style={{color:'#1FB5C9'}}>{p.price} ر.س</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}