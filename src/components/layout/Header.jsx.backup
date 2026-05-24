import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

function Header() {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const cartItems = getTotalItems()

  return (
    <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <div>
          <Link to="/" className="text-2xl font-bold hover:text-emerald-100">
            Pharmacy
          </Link>
        </div>
        
        <nav className="flex gap-4 items-center">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/medicines" className="hover:underline">
            Products
          </Link>
          
          {user ? (
            <>
              <Link to="/cart" className="hover:underline relative">
                Cart
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hover:underline">
                Orders
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="hover:underline">
                  Admin
                </Link>
              )}
              <span className="text-emerald-100">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export { Header }
export default Header