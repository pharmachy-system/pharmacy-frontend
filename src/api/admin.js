import API from './axios.js'

// ── Users ──────────────────────────────────────────────────────────────────
export const getAllUsers = async (params = {}) => {
  const response = await API.get('/users', { params })
  return response.data
}

export const getUserById = async (id) => {
  const response = await API.get(`/users/${id}`)
  return response.data
}

export const updateUserRole = async (id, role) => {
  const response = await API.patch(`/users/${id}/role`, { role })
  return response.data
}

export const updateUserStatus = async (id, isActive) => {
  const response = await API.patch(`/users/${id}/status`, { isActive })
  return response.data
}

// ── Orders ─────────────────────────────────────────────────────────────────
export const getAllOrders = async (params = {}) => {
  const response = await API.get('/orders', { params })
  return response.data
}

export const updateOrderStatus = async (orderId, status, note) => {
  const response = await API.put(`/orders/${orderId}/status`, { status, note })
  return response.data
}

// ── Medicines ──────────────────────────────────────────────────────────────
export const addProduct = async (productData) => {
  const response = await API.post('/medicines', productData)
  return response.data
}

export const updateProduct = async (id, productData) => {
  const response = await API.put(`/medicines/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id) => {
  const response = await API.delete(`/medicines/${id}`)
  return response.data
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export const getDashboardStats = async () => {
  const response = await API.get('/admin/dashboard/stats')
  return response.data
}

export const getRecentOrders = async () => {
  const response = await API.get('/admin/dashboard/recent-orders')
  return response.data
}

export const getRevenueData = async () => {
  const response = await API.get('/admin/dashboard/revenue')
  return response.data
}

export const getLowStockAlerts = async () => {
  const response = await API.get('/medicines/alerts/low-stock')
  return response.data
}

// ── Audit ──────────────────────────────────────────────────────────────────
export const getAuditLogs = async (params = {}) => {
  const response = await API.get('/admin/audit', { params })
  return response.data
}
