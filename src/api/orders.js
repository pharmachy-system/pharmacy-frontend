import API from './axios.js'

export const createOrder = async (orderData) => {
  const response = await API.post('/orders', orderData)
  return response.data
}

export const getMyOrders = async () => {
  const response = await API.get('/orders/my-orders')
  return response.data
}

export const getOrderById = async (id) => {
  const response = await API.get(`/orders/${id}`)
  return response.data
}

export const cancelOrder = async (id, reason) => {
  const response = await API.put(`/orders/${id}/cancel`, { reason })
  return response.data
}

export const trackOrder = async (id) => {
  const response = await API.get(`/orders/${id}/track`)
  return response.data
}

export const reorder = async (id) => {
  const response = await API.post(`/orders/${id}/reorder`)
  return response.data
}
