import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MarketingLayout from './layouts/MarketingLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Marketing Pages
import HomePage from './pages/marketing/HomePage'
import PricingPage from './pages/marketing/PricingPage'
import AboutPage from './pages/marketing/AboutPage'

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome'
import EmissionsDashboard from './pages/dashboard/EmissionsDashboard'
import Scope1DataCollection from './pages/dashboard/Scope1DataCollection'
import Scope2DataCollection from './pages/dashboard/Scope2DataCollection'
import Scope3DataCollection from './pages/dashboard/Scope3DataCollection'
import ReportsPage from './pages/dashboard/ReportsPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import ESGDashboardHome from './pages/dashboard/ESGDashboardHome'
import ESGFrameworksPage from './pages/dashboard/ESGFrameworksPage'
import GRIDataCollection from './pages/dashboard/GRIDataCollection'
import TCFDDataCollection from './pages/dashboard/TCFDDataCollection'
import SBTiDataCollection from './pages/dashboard/SBTiDataCollection'
import CSRDDataCollection from './pages/dashboard/CSRDDataCollection'
import CDPDataCollection from './pages/dashboard/CDPDataCollection'
import SDGDataCollection from './pages/dashboard/SDGDataCollection'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Marketing Routes */}
        <Route path="/" element={<MarketingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="emissions" element={<EmissionsDashboard />} />
          <Route path="emissions/scope1" element={<Scope1DataCollection />} />
          <Route path="emissions/scope2" element={<Scope2DataCollection />} />
          <Route path="emissions/scope3" element={<Scope3DataCollection />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="esg" element={<ESGDashboardHome />} />
          <Route path="esg/frameworks" element={<ESGFrameworksPage />} />
          <Route path="esg/gri" element={<GRIDataCollection />} />
          <Route path="esg/tcfd" element={<TCFDDataCollection />} />
          <Route path="esg/sbti" element={<SBTiDataCollection />} />
          <Route path="esg/csrd" element={<CSRDDataCollection />} />
          <Route path="esg/cdp" element={<CDPDataCollection />} />
          <Route path="esg/sdg" element={<SDGDataCollection />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
