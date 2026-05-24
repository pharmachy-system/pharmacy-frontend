import API from './axios.js'

export const getAllProducts = async (params = {}) => {
  const response = await API.get('/medicines', { params })
  return response.data
}

export const getProductById = async (id) => {
  const response = await API.get(`/medicines/${id}`)
  return response.data
}

export const getCategories = async () => {
  const response = await API.get('/medicines/categories')
  return response.data
}

export const searchProducts = async (query) => {
  const response = await API.get(`/medicines/search?q=${encodeURIComponent(query)}`)
  return response.data
}