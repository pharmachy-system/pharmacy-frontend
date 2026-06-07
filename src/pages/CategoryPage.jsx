import { useParams, Link } from 'react-router-dom';

const categoryProducts = {
  'فيتامينات': [
    { id: 'p001', nameAr: 'فيتامين سي 1000mg', price: 45, emoji: '🍊' },
    { id: 'p005', nameAr: 'فيتامين د3', price: 55, emoji: '☀️' },
    { id: 'p007', nameAr: 'فيتامين ب12', price: 40, emoji: '💉' },
  ],
  'مكملات': [
    { id: 'p002', nameAr: 'أوميغا 3', price: 89, emoji: '🐟' },
    { id: 'p003', nameAr: 'زنك وماغنيسيوم', price: 35, emoji: '💊' },
    { id: 'p008', nameAr: 'بروتين واي', price: 180, emoji: '💪' },
  ],
  'تجميل': [
    { id: 'p004', nameAr: 'كولاجين بيبتيد', price: 110, emoji: '✨' },
    { id: 'p009', nameAr: 'كريم مرطب', price: 52, emoji: '🧴' },
  ],
  'جلدية': [
    { id: 'p006', nameAr: 'مرهم ديرموفيت', price: 38, emoji: '🧴' },
    { id: 'p010', nameAr: 'كريم SPF 50', price: 75, emoji: '🌞' },
  ],
};

const categoryColors = {
  'فيتامينات': '#fef9c3',
  'مكملات': '#dcfce7',
  'تجميل': '#fce7f3',
  'جلدية': '#dbeafe',
};

export default function CategoryPage() {
  const { category } = useParams();
  const products = categoryProducts[category] || [];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:underline">الرئيسية</Link>
          <span>/</span>
          <Link to="/products" className="hover:underline">المنتجات</Link>
          <span>/</span>
          <span className="font-bold" style={{color:'#1FB5C9'}}>{category}</span>
        </div>

        <div className="rounded-2xl p-6 mb-8" style={{backgroundColor: categoryColors[category] || '#f3f4f6'}}>
          <h1 className="text-3xl font-black text-gray-800 mb-1">{category}</h1>
          <p className="text-gray-600">{products.length} منتج متوفر</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">لا توجد منتجات في هذه الفئة</h2>
            <Link to="/products" className="px-8 py-3 rounded-full text-white font-bold mt-4 inline-block" style={{background:'linear-gradient(135deg,#1FB5C9,#1B3D6F)'}}>
              تصفح جميع المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-5xl text-center mb-3">{p.emoji}</div>
                <h3 className="font-bold text-center text-gray-800 mb-2">{p.nameAr}</h3>
                <p className="text-center font-black text-xl" style={{color:'#1FB5C9'}}>{p.price} ر.س</p>
                <button className="w-full mt-3 py-2 rounded-xl text-white font-bold text-sm" style={{background:'linear-gradient(135deg,#1FB5C9,#1B3D6F)'}}>
                  أضف للسلة
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}