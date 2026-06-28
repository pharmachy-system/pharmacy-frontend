import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

// Contexts
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { FeatureFlagProvider } from './contexts/FeatureFlagContext'

// Layouts (small, load eagerly)
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AdminLayout from './components/layout/AdminLayout'
import PharmacistLayout from './components/layout/PharmacistLayout'
import DeliveryLayout from './components/layout/DeliveryLayout'

// Route guards (small, load eagerly)
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import PharmacistRoute from './components/PharmacistRoute'
import DeliveryRoute from './components/DeliveryRoute'

// Shared
import ErrorBoundary from './components/shared/ErrorBoundary'

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
// Auth
const LoginPage              = lazy(() => import('./pages/LoginPage'))
const RegisterPage           = lazy(() => import('./pages/RegisterPage'))
const OTPVerificationPage    = lazy(() => import('./pages/OTPVerificationPage'))
const ForgotPasswordPage     = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage      = lazy(() => import('./pages/ResetPasswordPage'))

// Store
const HomePage               = lazy(() => import('./pages/HomePage'))
const ProductsPage           = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage      = lazy(() => import('./pages/ProductDetailPage'))
const CategoryPage           = lazy(() => import('./pages/CategoryPage'))
const SearchResultsPage      = lazy(() => import('./pages/SearchResultsPage'))
const CartPage               = lazy(() => import('./pages/CartPage'))
const CheckoutPage           = lazy(() => import('./pages/CheckoutPage'))
const PaymentResultPage      = lazy(() => import('./pages/PaymentResultPage'))
const OffersPage             = lazy(() => import('./pages/OffersPage'))

// Customer account
const AccountPage            = lazy(() => import('./pages/AccountPage'))
const OrdersPage             = lazy(() => import('./pages/OrdersPage'))
const OrderDetailPage        = lazy(() => import('./pages/OrderDetailPage'))
const OrderTrackingPage      = lazy(() => import('./pages/OrderTrackingPage'))
const PrescriptionsPage      = lazy(() => import('./pages/PrescriptionsPage'))
const PrescriptionUploadPage = lazy(() => import('./pages/PrescriptionUploadPage'))
const WishlistPage           = lazy(() => import('./pages/WishlistPage'))
const NotificationsPage      = lazy(() => import('./pages/NotificationsPage'))
const ProfileEditPage        = lazy(() => import('./pages/ProfileEditPage'))
const AddressesPage          = lazy(() => import('./pages/AddressesPage'))
const LoyaltyPage            = lazy(() => import('./pages/LoyaltyPage'))
const WalletPage             = lazy(() => import('./pages/WalletPage'))
const ReferralPage           = lazy(() => import('./pages/ReferralPage'))
const SettingsPage           = lazy(() => import('./pages/SettingsPage'))
const ReturnsPage            = lazy(() => import('./pages/ReturnsPage'))
const SubscriptionsPage      = lazy(() => import('./pages/SubscriptionsPage'))
const ReviewsPage            = lazy(() => import('./pages/ReviewsPage'))

// Medical / AI
const DrugInteractionPage    = lazy(() => import('./pages/DrugInteractionPage'))
const ConsultationPage       = lazy(() => import('./pages/ConsultationPage'))
const AIMedicalChatPage      = lazy(() => import('./pages/AIMedicalChatPage'))
const AISymptomCheckerPage   = lazy(() => import('./pages/AISymptomCheckerPage'))

// Static
const AboutPage              = lazy(() => import('./pages/AboutPage'))
const ContactPage            = lazy(() => import('./pages/ContactPage'))
const FAQPage                = lazy(() => import('./pages/FAQPage'))
const SupportPage            = lazy(() => import('./pages/SupportPage'))
const PrivacyPolicyPage      = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsPage              = lazy(() => import('./pages/TermsPage'))
const NotFoundPage           = lazy(() => import('./pages/NotFoundPage'))

// Admin pages
const AdminDashboard         = lazy(() => import('./pages/AdminDashboard'))
const AdminProductsPage      = lazy(() => import('./pages/AdminProductsPage'))
const AdminOrdersPage        = lazy(() => import('./pages/AdminOrdersPage'))
const AdminUsersPage         = lazy(() => import('./pages/AdminUsersPage'))
const AdminAnalyticsPage     = lazy(() => import('./pages/AdminAnalyticsPage'))
const AdminInventoryPage     = lazy(() => import('./pages/AdminInventoryPage'))
const AdminCouponsPage       = lazy(() => import('./pages/admin/AdminCouponsPage'))
const AdminReportsPage       = lazy(() => import('./pages/admin/AdminReportsPage'))
const AdminCategoriesPage    = lazy(() => import('./pages/admin/AdminCategoriesPage'))
const AdminBrandsPage        = lazy(() => import('./pages/admin/AdminBrandsPage'))
const AdminFlashSalesPage    = lazy(() => import('./pages/admin/AdminFlashSalesPage'))
const AdminDeliveryZonesPage = lazy(() => import('./pages/admin/AdminDeliveryZonesPage'))
const AdminSettingsPage      = lazy(() => import('./pages/admin/AdminSettingsPage'))
const AdminArticlesPage      = lazy(() => import('./pages/admin/AdminArticlesPage'))

// Articles
const ArticlesPage           = lazy(() => import('./pages/ArticlesPage'))
const ArticleDetailPage      = lazy(() => import('./pages/ArticleDetailPage'))

// Pharmacist pages
const PharmacistDashboard          = lazy(() => import('./pages/pharmacist/PharmacistDashboard'))
const PharmacistPrescriptionsPage  = lazy(() => import('./pages/pharmacist/PharmacistPrescriptionsPage'))
const PharmacistOrdersPage         = lazy(() => import('./pages/pharmacist/PharmacistOrdersPage'))
const PharmacistInventoryPage      = lazy(() => import('./pages/pharmacist/PharmacistInventoryPage'))

// Delivery pages
const DeliveryDashboard    = lazy(() => import('./pages/delivery/DeliveryDashboard'))
const DeliveryOrdersPage   = lazy(() => import('./pages/delivery/DeliveryOrdersPage'))

// ─── Loading fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// ─── Store layout (header + footer) ──────────────────────────────────────────
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

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <ThemeProvider>
      <FeatureFlagProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>

              {/* Global toaster */}
              <Toaster position="top-center" richColors closeButton duration={3000} />

              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>

                    {/* ── Admin routes ────────────────────────────────────── */}
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                      <Route index              element={<AdminDashboard />} />
                      <Route path="products"   element={<AdminProductsPage />} />
                      <Route path="orders"     element={<AdminOrdersPage />} />
                      <Route path="users"      element={<AdminUsersPage />} />
                      <Route path="analytics"  element={<AdminAnalyticsPage />} />
                      <Route path="inventory"  element={<AdminInventoryPage />} />
                      <Route path="coupons"    element={<AdminCouponsPage />} />
                      <Route path="reports"    element={<AdminReportsPage />} />
                      <Route path="categories" element={<AdminCategoriesPage />} />
                      <Route path="brands"     element={<AdminBrandsPage />} />
                      <Route path="flash-sales" element={<AdminFlashSalesPage />} />
                      <Route path="delivery-zones" element={<AdminDeliveryZonesPage />} />
                      <Route path="settings"   element={<AdminSettingsPage />} />
                      <Route path="articles"   element={<AdminArticlesPage />} />
                    </Route>

                    {/* ── Pharmacist routes ────────────────────────────────── */}
                    <Route path="/pharmacist" element={<PharmacistRoute><PharmacistLayout /></PharmacistRoute>}>
                      <Route index                  element={<PharmacistDashboard />} />
                      <Route path="prescriptions"   element={<PharmacistPrescriptionsPage />} />
                      <Route path="orders"          element={<PharmacistOrdersPage />} />
                      <Route path="inventory"       element={<PharmacistInventoryPage />} />
                    </Route>

                    {/* ── Delivery routes ─────────────────────────────────── */}
                    <Route path="/delivery" element={<DeliveryRoute><DeliveryLayout /></DeliveryRoute>}>
                      <Route index          element={<DeliveryDashboard />} />
                      <Route path="orders"  element={<DeliveryOrdersPage />} />
                    </Route>

                    {/* ── Store routes (header + footer) ──────────────────── */}
                    <Route element={<StoreLayout />}>
                      {/* Public */}
                      <Route path="/"                  element={<HomePage />} />
                      <Route path="/login"             element={<LoginPage />} />
                      <Route path="/register"          element={<RegisterPage />} />
                      <Route path="/verify-otp"        element={<OTPVerificationPage />} />
                      <Route path="/forgot-password"   element={<ForgotPasswordPage />} />
                      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                      {/* Catalogue */}
                      <Route path="/medicines"         element={<ProductsPage />} />
                      <Route path="/products"          element={<ProductsPage />} />
                      <Route path="/product/:id"       element={<ProductDetailPage />} />
                      <Route path="/category/:category" element={<CategoryPage />} />
                      <Route path="/search"            element={<SearchResultsPage />} />
                      <Route path="/offers"            element={<OffersPage />} />

                      {/* Shopping */}
                      <Route path="/cart"              element={<CartPage />} />
                      <Route path="/checkout"          element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                      <Route path="/payment/result"    element={<PaymentResultPage />} />
                      <Route path="/payment/result/:orderId" element={<PaymentResultPage />} />
                      <Route path="/wishlist"          element={<WishlistPage />} />
                      <Route path="/favorites"         element={<WishlistPage />} />

                      {/* Customer account */}
                      <Route path="/account"           element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                      <Route path="/orders"            element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                      <Route path="/orders/:id"        element={<OrderDetailPage />} />
                      <Route path="/orders/:id/tracking" element={<OrderTrackingPage />} />
                      <Route path="/prescriptions"     element={<ProtectedRoute><PrescriptionsPage /></ProtectedRoute>} />
                      <Route path="/prescription-upload" element={<ProtectedRoute><PrescriptionUploadPage /></ProtectedRoute>} />
                      <Route path="/notifications"     element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                      <Route path="/profile"           element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
                      <Route path="/profile/edit"      element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
                      <Route path="/addresses"         element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
                      <Route path="/loyalty"           element={<ProtectedRoute><LoyaltyPage /></ProtectedRoute>} />
                      <Route path="/wallet"            element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
                      <Route path="/referral"          element={<ProtectedRoute><ReferralPage /></ProtectedRoute>} />
                      <Route path="/settings"          element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                      <Route path="/returns"           element={<ProtectedRoute><ReturnsPage /></ProtectedRoute>} />
                      <Route path="/subscriptions"     element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
                      <Route path="/reviews"           element={<ReviewsPage />} />

                      {/* Articles */}
                      <Route path="/articles"          element={<ArticlesPage />} />
                      <Route path="/articles/:slug"    element={<ArticleDetailPage />} />

                      {/* Medical & AI */}
                      <Route path="/drug-interactions" element={<DrugInteractionPage />} />
                      <Route path="/consultation"      element={<ConsultationPage />} />
                      <Route path="/ai/chat"           element={<AIMedicalChatPage />} />
                      <Route path="/ai/symptom-checker" element={<AISymptomCheckerPage />} />

                      {/* Static */}
                      <Route path="/about"             element={<AboutPage />} />
                      <Route path="/contact"           element={<ContactPage />} />
                      <Route path="/faq"               element={<FAQPage />} />
                      <Route path="/support"           element={<SupportPage />} />
                      <Route path="/privacy"           element={<PrivacyPolicyPage />} />
                      <Route path="/terms"             element={<TermsPage />} />

                      <Route path="*"                  element={<NotFoundPage />} />
                    </Route>

                  </Routes>
                </Suspense>
              </ErrorBoundary>

            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
      </FeatureFlagProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
