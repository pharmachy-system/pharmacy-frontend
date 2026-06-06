export default function HealthConcernsSection() {
  const concerns = [
    { emoji: '💊', title: 'أدوية مزمنة', color: '#fee2e2', textColor: '#991b1b' },
    { emoji: '🌿', title: 'أعشاب طبيعية', color: '#dcfce7', textColor: '#166534' },
    { emoji: '👶', title: 'صحة الأطفال', color: '#dbeafe', textColor: '#1e40af' },
    { emoji: '❤️', title: 'صحة القلب', color: '#fce7f3', textColor: '#9d174d' },
    { emoji: '🦷', title: 'العناية بالأسنان', color: '#ede9fe', textColor: '#5b21b6' },
    { emoji: '👁️', title: 'العناية بالعيون', color: '#fef9c3', textColor: '#854d0e' },
  ];

  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-pharmacy-blue mb-12">
          تصفح حسب الاهتمام الصحي
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {concerns.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: c.color }}
            >
              <div className="text-4xl mb-3">{c.emoji}</div>
              <p className="font-bold text-sm" style={{ color: c.textColor }}>{c.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}