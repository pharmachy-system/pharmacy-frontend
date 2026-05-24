import API from './axios.js'

export const createOrder = async (orderData) => {
  const response = await API.post('/orders', {
    items: orderData.items,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod
  })
  return response.data
}

export const getMyOrders = async () => {
  const response = await API.get('/orders/my')
  return response.data
}

export const getOrderById = async (id) => {
  const response = await API.get(`/orders/${id}`)
  return response.data
}

export const cancelOrder = async (id) => {
  const response = await API.put(`/orders/${id}/cancel`)
  return response.data
}