export default function BestDealsSection() {
  const deals = [
    { id: 'p001', nameAr: 'مرهم ديرموفيت', price: 38, oldPrice: 55, emoji: '🧴', badge: 'الأكثر مبيعاً' },
    { id: 'p002', nameAr: 'شراب فيتامين د', price: 65, oldPrice: 90, emoji: '☀️', badge: 'خصم 28%' },
    { id: 'p003', nameAr: 'كريم مرطب للبشرة', price: 52, oldPrice: 75, emoji: '💆', badge: 'جديد' },
    { id: 'p004', nameAr: 'قطرة عين كولير', price: 24, oldPrice: 35, emoji: '👁️', badge: 'خصم 31%' },
  ];

  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-pharmacy-blue mb-4">
          🏷️ أفضل العروض
        </h2>
        <p className="text-center text-gray-500 mb-12">منتجات مختارة بعناية لك</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {deals.map((p) => (
            <div key={p.id} className="bg-gray-50 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow relative">
              <span className="absolute top-3 right-3 bg-pharmacy-cyan text-white text-xs px-2 py-1 rounded-full">
                {p.badge}
              </span>
              <div className="text-5xl text-center mb-4 mt-4">{p.emoji}</div>
              <h3 className="font-bold text-center text-pharmacy-blue mb-2">{p.nameAr}</h3>
              <div className="text-center">
                <span className="text-xl font-bold text-pharmacy-cyan">{p.price} ر.س</span>
                <span className="text-sm text-gray-400 line-through mr-2">{p.oldPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}