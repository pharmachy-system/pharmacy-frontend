import API from './axios.js'

export const getCart = async () => {
  const response = await API.get('/cart')
  return response.data
}

export const addItemToCart = async (productId, quantity) => {
  const response = await API.post('/cart', {
    productId,
    quantity
  })
  return response.data
}

export const updateCartItem = async (itemId, quantity) => {
  const response = await API.put(`/cart/${itemId}`, {
    quantity
  })
  return response.data
}

export const removeCartItem = async (itemId) => {
  const response = await API.delete(`/cart/${itemId}`)
  return response.data
}

export const clearCart = async () => {
  const response = await API.delete('/cart')
  return response.data
}