import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useCart } from '../../contexts/CartContext'
import { formatCurrency } from '../../lib/utils'

export const ProductCard = ({ product }) => {
  const { addItem } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      prescription: product.prescription,
    })
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Discount Badge */}
      {product.discount && (
        <Badge className="absolute top-2 left-2 z-10" variant="destructive">
          {product.discount}% OFF
        </Badge>
      )}

      {/* Prescription Badge */}
      {product.prescription && (
        <Badge className="absolute top-2 right-2 z-10" variant="secondary">
          Rx Required
        </Badge>
      )}

      {/* Wishlist Button */}
      <button
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.preventDefault()
          // Add to wishlist logic
        }}
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Product Image */}
      <div className="aspect-square bg-gray-100 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        {product.genericName && (
          <p className="text-sm text-gray-600 mb-2">{product.genericName}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full"
          variant={product.inStock ? 'default' : 'secondary'}
        >
          {product.inStock ? (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          ) : (
            'Out of Stock'
          )}
        </Button>
      </div>
    </Link>
  )
}