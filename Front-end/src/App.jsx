import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/merchant/landing/LandingPage'
import RegisterPage from './pages/Register'
import RegisterStep2Page from './pages/RegisterStep2'
import RegisterStep3Page from './pages/RegisterStep3'
import SignInPage from './pages/SignIn'
import AIDiagnosticPage from './pages/AIDiagnostic'
import BuildingAssistantPage from './pages/BuildingAssistant'
import Dashboard from './pages/merchant/dashboard/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* المسارات العامة */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/step-2" element={<RegisterStep2Page />} />
        <Route path="/register/step-3" element={<RegisterStep3Page />} />
        <Route path="/signin" element={<SignInPage />} />
        
        {/* مسارات الـ Onboarding */}
        <Route path="/onboarding" element={<AIDiagnosticPage />} />
        <Route path="/diagnostic" element={<AIDiagnosticPage />} />
        <Route path="/building-assistant" element={<BuildingAssistantPage />} />

        {/* مسارات التاجر (Merchant/Seller) */}
        {/* التعديل هنا: خليناه يطابق اللي في صفحة الـ SignIn */}
        <Route path="/merchant/dashboard" element={<Dashboard />} />
        
        {/* مسارات إضافية ممكن تحتاجيها للأدمن والسيلر مستقبلاً */}
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        {/* <Route path="/user/profile" element={<UserProfile />} /> */}

        {/* لو حد دخل على /dashboard بس، نحوله للمسار الصح */}
        <Route path="/dashboard" element={<Navigate to="/merchant/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
