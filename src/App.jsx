import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/merchant/landing/LandingPage';
import RegisterPage from './pages/Register';
import RegisterStep2Page from './pages/RegisterStep2';
import RegisterStep3Page from './pages/RegisterStep3';
import SignInPage from './pages/SignIn';
import GoogleAuthCallback from './pages/GoogleAuthCallback';
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
import IntegrationPage from './pages/merchant/integration/IntegrationPage';
import CheckoutSuccessPage from './pages/checkout/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/checkout/CheckoutCancelPage';
import SubscriptionDetailsPage from './pages/merchant/subscription/SubscriptionDetailsPage';
import ProfilePage from './pages/merchant/profile/ProfilePage';
import AIUsagePage from './pages/merchant/usage/AIUsagePage';
import BundlesPage from './pages/merchant/bundles/BundlesPage';

import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import SuperAdminDiagnostics from './pages/super-admin/SuperAdminDiagnostics';
import SuperAdminFeatures from './pages/super-admin/SuperAdminFeatures';
import SuperAdminFeatureCreate from './pages/super-admin/SuperAdminFeatureCreate';
import SuperAdminMerchants from './pages/super-admin/SuperAdminMerchants';
import SuperAdminPlanCreate from './pages/super-admin/SuperAdminPlanCreate';
import SuperAdminPlanDetails from './pages/super-admin/SuperAdminPlanDetails';
import SuperAdminSubscriptions from './pages/super-admin/SuperAdminSubscriptions';
import SuperAdminLayout from './components/layout/SuperAdminLayout';
import SuperAdminAuditLogs from './pages/super-admin/SuperAdminAuditLogs';
import SuperAdminModelsHealth from './pages/super-admin/SuperAdminModelsHealth';
import SuperAdminPrompts from './pages/super-admin/SuperAdminPrompts';
import SuperAdminBundles from './pages/super-admin/SuperAdminBundles';
import SuperAdminAssistant from './pages/super-admin/SuperAdminAssistant';

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
        {/* Password recovery must stay available even when a previous session exists. */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Google OAuth Callback — backend redirects here after Google login */}
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />

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
          <Route path="/merchant/integrations" element={<IntegrationPage />} />
          <Route path="/merchant/subscription" element={<SubscriptionDetailsPage />} />
          <Route path="/merchant/profile" element={<ProfilePage />} />
          <Route path="/merchant/ai-usage" element={<AIUsagePage />} />
          <Route path="/merchant/bundles" element={<BundlesPage />} />
        </Route>

        {/* باقي الـ Dashboards */}
        <Route element={<ProtectedRoute allowedRoles={['super-admin']}><SuperAdminLayout /></ProtectedRoute>}>
          <Route path="/admin/profile" element={<ProfilePage />} />
          <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/admin/diagnostics" element={<SuperAdminDiagnostics />} />
          <Route path="/admin/audit-logs" element={<SuperAdminAuditLogs />} />
          <Route path="/admin/features" element={<SuperAdminFeatures />} />
          <Route path="/admin/features/create" element={<SuperAdminFeatureCreate />} />
          <Route path="/admin/merchants" element={<SuperAdminMerchants />} />
          <Route path="/admin/models-health" element={<SuperAdminModelsHealth />} />
          <Route path="/admin/prompts" element={<SuperAdminPrompts />} />
          <Route path="/admin/bundles" element={<SuperAdminBundles />} />
          <Route path="/admin/assistant" element={<SuperAdminAssistant />} />
          <Route path="/admin/plan-details" element={<SuperAdminPlanDetails />} />
          <Route path="/admin/subscriptions" element={<SuperAdminSubscriptions />} />
          <Route path="/admin/subscriptions/:planId" element={<SuperAdminPlanDetails />} />
          <Route path="/admin/plans/create" element={<SuperAdminPlanCreate />} />
          <Route path="/admin/plans/:id/edit" element={<SuperAdminPlanDetails />} />
        </Route>
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
