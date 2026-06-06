export default function FlashSalesSection() {
  const products = [
    { id: 'p001', nameAr: 'فيتامين سي', price: 45, oldPrice: 60, color: '#fef3c7', emoji: '🍊' },
    { id: 'p002', nameAr: 'أوميغا 3', price: 89, oldPrice: 120, color: '#dbeafe', emoji: '🐟' },
    { id: 'p003', nameAr: 'زنك وماغنيسيوم', price: 35, oldPrice: 50, color: '#dcfce7', emoji: '💊' },
    { id: 'p004', nameAr: 'كولاجين', price: 110, oldPrice: 150, color: '#fce7f3', emoji: '✨' },
  ];

  return (
    <section className="py-16 bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-pharmacy-blue mb-4">
          🔥 تخفيضات سريعة
        </h2>
        <p className="text-center text-gray-500 mb-12">عروض محدودة الوقت</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-5xl text-center mb-4">{p.emoji}</div>
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