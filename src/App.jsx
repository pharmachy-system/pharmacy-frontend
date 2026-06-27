import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AdminLayout from './components/layout/AdminLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OTPVerificationPage from './pages/OTPVerificationPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminAnalyticsPage from './pages/AdminAnalyticsPage'
import AdminInventoryPage from './pages/AdminInventoryPage'
import AccountPage from './pages/AccountPage'
import OrdersPage from './pages/OrdersPage'
import PrescriptionsPage from './pages/PrescriptionsPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import './index.css'
import DrugInteractionPage from "./pages/DrugInteractionPage";
import CategoryPage from "./pages/CategoryPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import WishlistPage from "./pages/WishlistPage";
import ConsultationPage from "./pages/ConsultationPage";
import ReviewsPage from "./pages/ReviewsPage";
import FAQPage from "./pages/FAQPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SupportPage from "./pages/SupportPage";
import OffersPage from "./pages/OffersPage";
import LoyaltyPage from "./pages/LoyaltyPage";
import WalletPage from "./pages/WalletPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import AddressesPage from "./pages/AddressesPage";
import ReturnsPage from './pages/ReturnsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import PrescriptionUploadPage from './pages/PrescriptionUploadPage';
import OrderDetailPage from "./pages/OrderDetailPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import NotFoundPage from "./pages/NotFoundPage";

function StoreLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>

            {/* ── Admin routes (sidebar layout, no store header/footer) ── */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
            </Route>

            {/* ── Store routes (pharmacy header + footer) ── */}
            <Route element={<StoreLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<OTPVerificationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/medicines" element={<ProductsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/orders/:id/tracking" element={<OrderTrackingPage />} />
              <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionsPage /></ProtectedRoute>} />
              <Route path="/drug-interactions" element={<DrugInteractionPage />} />
              <Route path="/consultation" element={<ConsultationPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/loyalty" element={<LoyaltyPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfileEditPage />} />
              <Route path="/profile/edit" element={<ProfileEditPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/addresses" element={<AddressesPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/prescription-upload" element={<PrescriptionUploadPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/favorites" element={<WishlistPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
