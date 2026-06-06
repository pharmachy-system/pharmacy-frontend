import { Link } from 'react-router-dom';

const categories = [
  { emoji: '💊', label: 'مكملات' },
  { emoji: '🩺', label: 'سكري' },
  { emoji: '✨', label: 'تجميل' },
  { emoji: '🦷', label: 'عناية فموية' },
];

export default function HeroSection() {
  return (
    <section dir="rtl" style={{background:'linear-gradient(135deg,#e8f4fd,#c8e6f9)',minHeight:'520px'}} className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{minHeight:'520px'}}>
        <div className="flex-1 z-10 py-12">
          <h1 className="text-5xl font-black text-gray-800 mb-4">
            صيدليتك الموثوقة<br/>
            <span style={{color:'#1FB5C9'}}>أونلاين</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md">أدوية أصلية، توصيل سريع، وإرشاد صيدلاني متخصص.</p>
          <div className="flex gap-4 mb-10 flex-wrap">
            <Link to="/products" className="px-6 py-3 rounded-full text-white font-bold shadow-lg" style={{background:'linear-gradient(135deg,#1FB5C9,#1B3D6F)'}}>🛒 تسوق الأدوية</Link>
            <Link to="/prescription" className="px-6 py-3 rounded-full font-bold border-2 bg-white" style={{borderColor:'#1FB5C9',color:'#1FB5C9'}}>📋 ارفع روشتتك</Link>
          </div>
          <div className="flex gap-3 flex-wrap">
            {categories.map((c, i) => (
              <div key={i} className="flex flex-col items-center bg-white rounded-2xl px-4 py-3 shadow-md cursor-pointer hover:scale-105 transition-all">
                <span className="text-2xl mb-1">{c.emoji}</span>
                <span className="text-xs font-bold text-gray-700">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center items-end" style={{maxWidth:'460px'}}>
          <img src="/pharmacist-hero.jpg" alt="صيدلانية" style={{maxHeight:'500px',width:'100%',mixBlendMode:'multiply'}} className="drop-shadow-2xl"/>
        </div>
      </div>
    </section>
  );
}