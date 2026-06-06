import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">💊</div>
        <h1 className="text-6xl font-black mb-4" style={{color:'#1FB5C9'}}>404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="px-8 py-3 rounded-full text-white font-bold" style={{background:'linear-gradient(135deg,#1FB5C9,#1B3D6F)'}}>
            🏠 الرئيسية
          </Link>
          <Link to="/products" className="px-8 py-3 rounded-full font-bold border-2 bg-white" style={{borderColor:'#1FB5C9',color:'#1FB5C9'}}>
            🛒 تسوق
          </Link>
        </div>
      </div>
    </div>
  );
}