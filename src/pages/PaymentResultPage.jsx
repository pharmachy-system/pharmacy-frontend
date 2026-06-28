import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ShoppingBag, Home } from 'lucide-react';
import { paymentApi } from '../api/payment';

export default function PaymentResultPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [status,  setStatus]  = useState('loading');
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const id = orderId || searchParams.get('orderId');
      if (!id) { setStatus('error'); return; }
      try {
        const data = await paymentApi.verify(id);
        setPayment(data.payment || data.data || data);
        setStatus(data.payment?.status === 'paid' || data.success ? 'success' : 'failed');
      } catch {
        setStatus('failed');
      }
    };
    verify();
  }, [orderId, searchParams]);

  if (status === 'loading') return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mx-auto mb-4" />
        <p className="text-gray-500">جاري التحقق من الدفع...</p>
      </div>
    </div>
  );

  if (status === 'success') return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">تم الدفع بنجاح!</h1>
        <p className="text-gray-500 mb-1">رقم الطلب: <strong className="text-gray-800">#{payment?.order?.toString().slice(-6).toUpperCase() || orderId?.slice(-6).toUpperCase()}</strong></p>
        {payment?.amount && <p className="text-gray-500 mb-6">المبلغ المدفوع: <strong className="text-gray-800">{payment.amount} ر.س</strong></p>}
        <div className="space-y-2">
          <Link to="/orders"
            className="flex items-center justify-center gap-2 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-semibold transition-colors">
            <ShoppingBag className="w-5 h-5" /> متابعة طلباتي
          </Link>
          <Link to="/"
            className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">
            <Home className="w-5 h-5" /> الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">فشل الدفع</h1>
        <p className="text-gray-500 mb-6">لم يتم إتمام عملية الدفع. يمكنك المحاولة مرة أخرى.</p>
        <div className="space-y-2">
          <Link to="/orders"
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-semibold transition-colors">
            <ShoppingBag className="w-5 h-5" /> طلباتي
          </Link>
          <Link to="/"
            className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">
            <Home className="w-5 h-5" /> الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
