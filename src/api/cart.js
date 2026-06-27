import API from './axios.js'

export const getCart = async () => {
  const response = await API.get('/cart')
  return response.data
}

export const addItemToCart = async (medicineId, quantity) => {
  const response = await API.post('/cart/items', { medicineId, quantity })
  return response.data
}

export const updateCartItem = async (itemId, quantity) => {
  const response = await API.put(`/cart/items/${itemId}`, { quantity })
  return response.data
}

export const removeCartItem = async (itemId) => {
  const response = await API.delete(`/cart/items/${itemId}`)
  return response.data
}

export const clearCart = async () => {
  const response = await API.delete('/cart')
  return response.data
}

export const applyCoupon = async (couponCode) => {
  const response = await API.post('/cart/coupon', { couponCode })
  return response.data
}

export const removeCoupon = async () => {
  const response = await API.delete('/cart/coupon')
  return response.data
}

export const getCheckoutSummary = async (payload) => {
  const response = await API.post('/cart/checkout-summary', payload)
  return response.data
}
