import API from './axios.js'

export const loginUser = async (email, password) => {
  const response = await API.post('/auth/login', {
    email,
    password
  })
  return response.data
}

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    phone: userData.phone
  })
  return response.data
}

export const getCurrentUser = async () => {
  const response = await API.get('/auth/me')
  return response.data
}