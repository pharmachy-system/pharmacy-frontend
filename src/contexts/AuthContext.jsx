import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      })
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:5000/api/auth/register', userData)
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      return response.data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      
      setUser(response.data.user)
      setToken(storedToken)
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}