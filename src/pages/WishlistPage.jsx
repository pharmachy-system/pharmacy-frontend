import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const mockWishlist = [
  { id: 'p001', nameAr: 'فيتامين سي 1000mg', price: 45, oldPrice: 60, emoji: '🍊', inStock: true },
  { id: 'p002', nameAr: 'أوميغا 3', price: 89, oldPrice: 120, emoji: '🐟', inStock: true },
  { id: 'p003', nameAr: 'كولاجين بيبتيد', price: 110, oldPrice: 150, emoji: '✨', inStock: false },
];

export default function WishlistPage() {
  const [items, setItems] = useState(mockWishlist);

  const removeItem = (id) => setItems(items.filter(i => i.id !== id));

  if (items.length === 0) return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-6xl mb-4">🤍</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">قائمة الأمنيات فارغة</h2>
      <p className="text-gray-500 mb-6">أضف منتجات تحبها لتجدها هنا</p>
      <Link to="/products" className="px-8 py-3 rounded-full text-white font-bold" style={{background:'linear-gradient(135deg,#1FB5C9,#1B3D6F)'}}>
        تسوق الآن
      </Link>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-red-500 fill-red-500" size={28}/>
          <h1 className="text-2xl font-black text-gray-800">قائمة الأمنيات</h1>
          <span className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full font-bold">{items.length} منتج</span>
        </div>

        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="text-5xl">{item.emoji}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">{item.nameAr}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black" style={{color:'#1FB5C9'}}>{item.price} ر.س</span>
                  <span className="text-sm text-gray-400 line-through">{item.oldPrice}</span>
                </div>
                {!item.inStock && <span className="text-xs text-red-500 font-bold">غير متوفر</span>}
              </div>
              <div className="flex gap-2">
                {item.inStock && (
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm" style={{background:'linear-gradient(135deg,#1FB5C9,#1B3D6F)'}}>
                    <ShoppingCart size={16}/> أضف للسلة
                  </button>
                )}
                <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}