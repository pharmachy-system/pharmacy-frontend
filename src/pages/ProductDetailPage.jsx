import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Shield, Truck, Award, Star, Plus, Minus, ArrowRight, CheckCircle, AlertCircle, Package } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../components/ui/Toast";
import { ProductDetailSkeleton } from "../components/ui/Skeleton";
import { getProductById, getAllProducts } from "../api/productsApi";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isWished, setIsWished] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [addedAnim, setAddedAnim] = useState(false);

  useEffect(() => {
    setLoading(true); setQty(1); window.scrollTo(0,0);
    const load = async () => {
      const res = await getProductById(id);
      if (res.success) {
        setProduct(res.product);
        const all = await getAllProducts();
        if (all.success) setRelated(all.products.filter(p => p.category === res.product.category && p.id !== id).slice(0,4));
      } else navigate("/products");
      setLoading(false);
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast(product.name + " أضيف للسلة", "success");
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const disc = product && product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/20 pt-6" dir="rtl">
      <div className="container mx-auto px-4"><ProductDetailSkeleton /></div>
    </div>
  );
  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/20" dir="rtl">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <nav className="flex items-center gap-1 text-sm text-gray-400 mb-6">
          <Link to="/products" className="hover:text-cyan-500">المنتجات</Link>
          <span> / </span>
          <span className="text-gray-700">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} className="relative">
            <div className="rounded-3xl overflow-hidden aspect-square flex items-center justify-center relative" style={{background: product.color || "#1FB5C9"}}>
              {disc && <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">{disc}% خصم</span>}
              {product.isNew && <span className="absolute top-4 left-4 bg-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full">جديد</span>}
              <div className="text-center p-8">
                <p className="text-white/60 text-sm mb-2">{product.brand}</p>
                <h2 className="text-white text-3xl font-bold">{product.nameEn || product.name}</h2>
              </div>
            </div>
            <button onClick={() => { setIsWished(!isWished); toast(isWished ? "حُذف من المفضلة" : "أضيف للمفضلة", "success"); }} className={(isWished ? "bg-red-500 text-white" : "bg-white/90 text-gray-500") + " absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow"}>
              <Heart className="w-5 h-5" fill={isWished ? "currentColor" : "none"} />
            </button>
          </motion.div>
          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="flex flex-col gap-4">
            <p className="text-cyan-500 text-sm font-medium">{product.brand}</p>
            <h1 className="text-2xl font-bold text-blue-900">{product.name}</h1>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(s => <Star key={s} className={(s <= Math.round(product.rating||0) ? "text-amber-400 fill-amber-400" : "text-gray-200") + " w-4 h-4"} />)}
              <span className="text-sm text-gray-500">{product.rating} ({(product.reviewCount||0).toLocaleString()})</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-blue-900">{product.price} ر.س</span>
              {product.oldPrice && <span className="text-gray-400 line-through">{product.oldPrice} ر.س</span>}
            </div>
            <div className={(product.inStock ? "text-emerald-600" : "text-red-500") + " flex items-center gap-2 text-sm font-medium"}>
              {product.inStock ? <><CheckCircle className="w-4 h-4" />متوفر</> : <><AlertCircle className="w-4 h-4" />غير متوفر</>}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            {product.inStock && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2">
                  <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-8 h-8 rounded-xl hover:bg-white flex items-center justify-center"><Minus className="w-4 h-4 text-blue-900" /></button>
                  <span className="w-8 text-center font-bold text-blue-900">{qty}</span>
                  <button onClick={() => setQty(q => q+1)} className="w-8 h-8 rounded-xl hover:bg-white flex items-center justify-center"><Plus className="w-4 h-4 text-blue-900" /></button>
                </div>
                <motion.button whileTap={{scale:0.97}} onClick={handleAddToCart} className={(addedAnim ? "bg-emerald-500" : "bg-gradient-to-l from-cyan-500 to-blue-900") + " flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white"}>
                  {addedAnim ? <><CheckCircle className="w-5 h-5" />تمت الإضافة!</> : <><ShoppingCart className="w-5 h-5" />أضف للسلة</>}
                </motion.button>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              {[["توصيل سريع"],["منتج أصلي"],["جودة معتمدة"]].map(([t],i) => (
                <div key={i} className="flex flex-col items-center gap-1 bg-cyan-50 border border-cyan-100 rounded-2xl p-3 text-center">
                  <span className="text-xs text-blue-900 font-medium">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="mb-8">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {["details","usage","warnings","reviews"].map((tab,i) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={(activeTab===tab ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-500") + " px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"}>
                {["التفاصيل","الاستخدام","التحذيرات","التقييمات"][i]}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="bg-white/60 rounded-3xl p-6 border border-gray-100">
              {activeTab==="details" && <div>{[["التصنيف",product.category],["الماركة",product.brand],["يحتاج وصفة",product.requiresPrescription?"نعم":"لا"]].map(([k,v]) => <div key={k} className="flex justify-between py-2 border-b border-gray-100 last:border-0"><span className="text-gray-400">{k}</span><span className="font-medium text-blue-900">{v}</span></div>)}</div>}
              {activeTab==="usage" && <p className="text-sm text-gray-600">{product.usage || "يستخدم حسب إرشادات الطبيب أو الصيدلاني."}</p>}
              {activeTab==="warnings" && <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200"><AlertCircle className="w-5 h-5 text-amber-500 shrink-0" /><p className="text-sm text-amber-800">{product.warnings || "احفظ بعيداً عن متناول الأطفال."}</p></div>}
              {activeTab==="reviews" && <div className="text-center py-8 text-gray-400"><Package className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>لا توجد تقييمات بعد</p></div>}
            </motion.div>
          </AnimatePresence>
        </div>
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-blue-900">منتجات مشابهة</h2>
              <Link to="/products" className="text-cyan-500 text-sm flex items-center gap-1">عرض الكل <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p.id} to={"/product/"+p.id} className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow block">
                  <div className="h-24 flex items-center justify-center text-white font-bold text-sm" style={{background:p.color||"#1FB5C9"}}>{p.nameEn||p.name}</div>
                  <div className="p-3"><p className="text-xs text-gray-600 truncate">{p.name}</p><p className="text-blue-900 font-bold text-sm">{p.price} ر.س</p></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}