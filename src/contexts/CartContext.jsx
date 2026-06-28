import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const CartContext = createContext()
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    setCartItems(current => {
      const existingItem = current.find(item => item._id === product._id)
      if (existingItem) {
        return current.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...current, {
        _id: product._id,
        name: product.name,
        price: product.finalPrice ?? product.price,
        image: product.image || product.images?.[0] || null,
        quantity,
      }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(current => current.filter(item => item._id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return }
    setCartItems(current =>
      current.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCartItems([])

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0)

  // Merge the local guest cart with the authenticated user's backend cart
  const mergeGuestCart = useCallback(async (accessToken) => {
    if (!cartItems.length || !accessToken) return
    try {
      const guestId = localStorage.getItem('guestId')
      if (guestId) {
        // Use the guest merge endpoint if we have a guestId
        await axios.post(
          `${API}/cart/merge-guest`,
          { guestId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
      } else if (cartItems.length > 0) {
        // Otherwise push localStorage items one by one
        for (const item of cartItems) {
          await axios.post(
            `${API}/cart/items`,
            { medicineId: item._id, quantity: item.quantity },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          ).catch(() => {}) // skip unavailable items silently
        }
      }
      clearCart()
      localStorage.removeItem('guestId')
    } catch {
      // Merge failure is non-critical — user can add items again
    }
  }, [cartItems]) // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    mergeGuestCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
