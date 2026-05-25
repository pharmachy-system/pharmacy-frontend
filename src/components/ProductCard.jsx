import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, index = 0 }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
    >
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-md">
            جديد
          </span>
        )}
        {product.discount > 0 && (
          <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold rounded-full shadow-md">
            خصم {product.discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="px-3 py-1 bg-gray-700 text-white text-xs font-bold rounded-full shadow-md">
            نفذت الكمية
          </span>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleWishlist}
        className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white transition-colors"
        aria-label="إضافة للمفضّلة"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-600'
          }`}
        />
      </motion.button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            loading="lazy"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center pb-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-sm font-medium text-gray-800 shadow-lg">
              <Eye className="w-4 h-4" />
              <span>عرض سريع</span>
            </div>
          </motion.div>
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <p className="text-xs text-gray-500 font-medium">{product.brand}</p>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-[#1B3D6F] line-clamp-2 min-h-[2.5rem] hover:text-[#1FB5C9] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviewCount.toLocaleString('ar-SA')})
          </span>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold text-[#1FB5C9]">
            {product.price.toFixed(2)}
            <span className="text-xs font-medium mr-1">ر.س</span>
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-[#1FB5C9] to-[#1B3D6F] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.inStock ? 'أضف للسلة' : 'غير متوفّر'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;