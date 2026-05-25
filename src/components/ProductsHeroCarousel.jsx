import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'عروض حصرية',
    subtitle: 'خصومات تصل لـ 40%',
    description: 'على مجموعة مختارة من الأدوية والمكمّلات الغذائية',
    cta: 'تسوّق الآن',
    image: 'https://placehold.co/800x600/1FB5C9/ffffff?text=Pharmacy+Offers',
    bgGradient: 'from-cyan-50 via-white to-blue-50',
    accent: '#1FB5C9',
  },
  {
    id: 2,
    title: 'فيتامينات ومكمّلات',
    subtitle: 'استثمر في صحّتك',
    description: 'تشكيلة كاملة من العلامات التجارية العالمية الموثوقة',
    cta: 'اكتشف المزيد',
    image: 'https://placehold.co/800x600/10B981/ffffff?text=Vitamins',
    bgGradient: 'from-emerald-50 via-white to-cyan-50',
    accent: '#10B981',
  },
  {
    id: 3,
    title: 'العناية بالبشرة',
    subtitle: 'منتجات أصلية 100%',
    description: 'لاروش بوزيه، فيشي، يوسرين وأكثر',
    cta: 'تسوّق الآن',
    image: 'https://placehold.co/800x600/F59E0B/ffffff?text=Skincare',
    bgGradient: 'from-amber-50 via-white to-rose-50',
    accent: '#F59E0B',
  },
];

const ProductsHeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const current = SLIDES[activeIndex];

  return (
    <div className={`relative w-full h-[420px] md:h-[480px] overflow-hidden rounded-3xl bg-gradient-to-br ${current.bgGradient} transition-colors duration-700`}>
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
           style={{ backgroundColor: current.accent }} />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-15 blur-3xl"
           style={{ backgroundColor: current.accent }} />

      <div className="relative h-full container mx-auto px-6 md:px-12 flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid md:grid-cols-2 gap-8 items-center w-full"
          >
            <div className="space-y-4 text-right order-2 md:order-1">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md"
                style={{ backgroundColor: current.accent }}
              >
                {current.subtitle}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-[#1B3D6F] leading-tight"
              >
                {current.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base md:text-lg text-gray-600 max-w-md mr-auto"
              >
                {current.description}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                style={{
                  background: `linear-gradient(135deg, ${current.accent}, #1B3D6F)`,
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                {current.cta}
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative order-1 md:order-2"
            >
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-30"
                   style={{ backgroundColor: current.accent }} />
              <img
                src={current.image}
                alt={current.title}
                className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
        aria-label="السابق"
      >
        <ChevronLeft className="w-5 h-5 text-[#1B3D6F]" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
        aria-label="التالي"
      >
        <ChevronRight className="w-5 h-5 text-[#1B3D6F]" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > activeIndex ? 1 : -1);
              setActiveIndex(idx);
            }}
            className={`h-2 rounded-full transition-all ${
              idx === activeIndex
                ? 'w-8 bg-[#1B3D6F]'
                : 'w-2 bg-[#1B3D6F]/30 hover:bg-[#1B3D6F]/50'
            }`}
            aria-label={`الشريحة ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsHeroCarousel;