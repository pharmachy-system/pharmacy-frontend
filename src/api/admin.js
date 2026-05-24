import API from './axios.js'

export const getAllUsers = async () => {
  const response = await API.get('/admin/users')
  return response.data
}

export const getAllOrders = async () => {
  const response = await API.get('/admin/orders')
  return response.data
}

export const updateOrderStatus = async (orderId, status) => {
  const response = await API.put(`/admin/orders/${orderId}/status`, {
    status
  })
  return response.data
}

export const addProduct = async (productData) => {
  const response = await API.post('/admin/medicines', productData)
  return response.data
}

export const updateProduct = async (id, productData) => {
  const response = await API.put(`/admin/medicines/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id) => {
  const response = await API.delete(`/admin/medicines/${id}`)
  return response.data
}