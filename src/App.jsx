import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/merchant/landing/LandingPage';
import RegisterPage from './pages/Register';
import RegisterStep2Page from './pages/RegisterStep2';
import RegisterStep3Page from './pages/RegisterStep3';
import SignInPage from './pages/SignIn';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import AIDiagnosticPage from './pages/AIDiagnostic';
import BuildingAssistantPage from './pages/BuildingAssistant';

// Merchant Pages
import Dashboard from './pages/merchant/dashboard/Dashboard';
import CatalogPage from './pages/merchant/catalog/CatalogPage';
import TicketsPage from './pages/merchant/tickets/TicketsPage';
import StoreSettingsPage from './pages/merchant/store/StoreSettingsPage';

// Layout & Route Wrappers
import MerchantLayout from './components/layout/MerchantLayout'; // 👈 استدعاء الـ Layout
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

        {/* صفحات محتاجة Login */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <AIDiagnosticPage />
          </ProtectedRoute>
        } />
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
        </Route>

        {/* باقي الـ Dashboards */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
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
