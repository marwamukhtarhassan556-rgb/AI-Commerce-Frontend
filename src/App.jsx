import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/merchant/landing/LandingPage';
import RegisterPage from './pages/Register';
import RegisterStep2Page from './pages/RegisterStep2';
import RegisterStep3Page from './pages/RegisterStep3';
import SignInPage from './pages/SignIn';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import VerifyEmailPage from './pages/VerifyEmail';
import AIDiagnosticPage from './pages/AIDiagnostic';
import BuildingAssistantPage from './pages/BuildingAssistant';

// 👈 استدعاء الـ Onboarding Flow المجمع للشاشات
import OnboardingFlow from './components/merchant/onboarding/OnboardingFlow';

// Merchant Pages
import Dashboard from './pages/merchant/dashboard/Dashboard';
import CatalogPage from './pages/merchant/catalog/CatalogPage';
import TicketsPage from './pages/merchant/tickets/TicketsPage';
import StoreSettingsPage from './pages/merchant/store/StoreSettingsPage';
import KnowledgeBasePage from './pages/merchant/knowledge/KnowledgeBasePage';
import CheckoutSuccessPage from './pages/checkout/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/checkout/CheckoutCancelPage';
import SubscriptionDetailsPage from './pages/merchant/subscription/SubscriptionDetailsPage';
import ProfilePage from './pages/merchant/profile/ProfilePage';

// Admin (Super Admin) imports
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDiagnostics from './pages/admin/AdminDiagnostics';
import AdminFeatures from './pages/admin/AdminFeatures';
import AdminFeatureCreate from './pages/admin/AdminFeatureCreate';
import AdminMerchants from './pages/admin/AdminMerchants';
import AdminPlanCreate from './pages/admin/AdminPlanCreate';
import AdminPlanDetails from './pages/admin/AdminPlanDetails';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminLayout from './pages/admin/components/AdminLayout';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminSettings from './pages/admin/AdminSettings';

// Layout & Route Wrappers
import MerchantLayout from './components/layout/MerchantLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ThemeToggle from './components/ui/ThemeToggle';

function App() {
  return (
    <BrowserRouter>
      <div className="global-theme-toggle">
        <ThemeToggle />
      </div>
      <Routes>
        {/* صفحات عامة - أي حد يدخل */}
        <Route path="/" element={<LandingPage />} />

        {/* صفحات Auth - بس للناس اللي مش مسجلة دخول */}
        <Route path="/signin" element={
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        <Route path="/register/step-2" element={
          <PublicRoute>
            <RegisterStep2Page />
          </PublicRoute>
        } />
        <Route path="/register/step-3" element={
          <PublicRoute>
            <RegisterStep3Page />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* 🔹 صفحات Onboarding و Diagnostic المربوطة بـ ProtectedRoute 🔹 */}
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
        <Route path="/checkout/failed" element={<CheckoutCancelPage />} />
        <Route path="/diagnostic" element={
          <ProtectedRoute>
            <AIDiagnosticPage />
          </ProtectedRoute>
        } />
        <Route path="/building-assistant" element={
          <ProtectedRoute>
            <BuildingAssistantPage />
          </ProtectedRoute>
        } />

        {/* 🔹 صفحات الـ Merchant المربوطة بالـ Sidebar المشترك 🔹 */}
        <Route 
          element={
            <ProtectedRoute allowedRoles={['seller', 'merchant', 'admin']}>
              <MerchantLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/merchant/dashboard" element={<Dashboard />} />
          <Route path="/merchant/catalog" element={<CatalogPage />} />
          <Route path="/merchant/tickets" element={<TicketsPage />} />
          <Route path="/merchant/store" element={<StoreSettingsPage />} />
          <Route path="/merchant/knowledge" element={<KnowledgeBasePage />} />
          <Route path="/merchant/subscription" element={<SubscriptionDetailsPage />} />
          <Route path="/merchant/profile" element={<ProfilePage />} />
        </Route>

        {/* Super Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['super-admin']}><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/diagnostics" element={<AdminDiagnostics />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/features" element={<AdminFeatures />} />
          <Route path="/admin/features/create" element={<AdminFeatureCreate />} />
          <Route path="/admin/merchants" element={<AdminMerchants />} />
          <Route path="/admin/plan-details" element={<AdminPlanDetails />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/subscriptions/:planId" element={<AdminPlanDetails />} />
          <Route path="/admin/plans/create" element={<AdminPlanCreate />} />
          <Route path="/admin/plans/:id/edit" element={<AdminPlanDetails />} />
        </Route>

        {/* باقي الـ Dashboards */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user', 'seller', 'merchant', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* أي مسار غلط ← يروح SignIn */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
