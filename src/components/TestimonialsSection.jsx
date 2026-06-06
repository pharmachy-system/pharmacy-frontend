import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  { text: 'خدمة ممتازة وتوصيل سريع!', rating: 5, location: 'الرياض' },
  { text: 'صيدلية موثوقة وأسعار منافسة.', rating: 5, location: 'جدة' },
  { text: 'واجهة رائعة ودعم سريع.', rating: 5, location: 'المدينة المنورة' },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-blue-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-pharmacy-blue mb-12">آراء عملائنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
              <Quote className="text-pharmacy-cyan mb-3" size={24} />
              <p className="text-gray-600 mb-4">{r.text}</p>
              <p className="text-sm text-gray-400">{r.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}