import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
})

// Request interceptor to add authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ansar_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ansar_access_token')
      localStorage.removeItem('ansar_refresh_token')
      localStorage.removeItem('ansar_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API