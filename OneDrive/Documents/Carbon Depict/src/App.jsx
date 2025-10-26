import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MarketingLayout from './layouts/MarketingLayout'
import DashboardLayout from './layouts/DashboardLayout'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

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
import GRIStandardsCollection from './pages/dashboard/GRIStandardsCollection'
import TCFDDataCollection from './pages/dashboard/TCFDDataCollection'
import SBTiDataCollection from './pages/dashboard/SBTiDataCollection'
import CSRDDataCollection from './pages/dashboard/CSRDDataCollection'
import CDPDataCollection from './pages/dashboard/CDPDataCollection'
import SDGDataCollection from './pages/dashboard/SDGDataCollection'
import ESGDataEntryHub from './pages/dashboard/ESGDataEntryHub'
import MaterialityAssessment from './pages/dashboard/MaterialityAssessment'
import TargetManagement from './pages/dashboard/TargetManagement'
import TargetCreation from './pages/dashboard/TargetCreation'
import ReportsLibrary from './pages/dashboard/ReportsLibrary'
import ReportGenerator from './pages/dashboard/ReportGenerator'
import SocialDashboard from './pages/dashboard/SocialDashboard'
import GovernanceDashboard from './pages/dashboard/GovernanceDashboard'
import GHGInventory from './pages/dashboard/GHGInventory'
import EnvironmentalDashboard from './pages/dashboard/EnvironmentalDashboard'
import ESGExecutiveDashboard from './pages/dashboard/ESGExecutiveDashboard'
import EnergyManagementCollection from './pages/dashboard/EnergyManagementCollection'
import EmployeeDemographicsCollection from './pages/dashboard/EmployeeDemographicsCollection'
import HealthSafetyCollection from './pages/dashboard/HealthSafetyCollection'
import BoardCompositionCollection from './pages/dashboard/BoardCompositionCollection'
import EthicsAntiCorruptionCollection from './pages/dashboard/EthicsAntiCorruptionCollection'
import RiskManagementCollection from './pages/dashboard/RiskManagementCollection'
import WaterManagementCollection from './pages/dashboard/WaterManagementCollection'
import WasteManagementCollection from './pages/dashboard/WasteManagementCollection'
import TrainingDevelopmentCollection from './pages/dashboard/TrainingDevelopmentCollection'
import DiversityInclusionCollection from './pages/dashboard/DiversityInclusionCollection'
import MaterialsCircularEconomyCollection from './pages/dashboard/MaterialsCircularEconomyCollection'
import BiodiversityLandUseCollection from './pages/dashboard/BiodiversityLandUseCollection'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Test Pages
import APITestPage from './pages/APITestPage'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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

          {/* Test Routes */}
          <Route path="/api-test" element={<APITestPage />} />

          {/* Dashboard Routes - Protected */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="executive" element={<ESGExecutiveDashboard />} />
            <Route path="emissions" element={<EmissionsDashboard />} />
            <Route path="emissions/scope1" element={<Scope1DataCollection />} />
            <Route path="emissions/scope2" element={<Scope2DataCollection />} />
            <Route path="emissions/scope3" element={<Scope3DataCollection />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="esg" element={<ESGDashboardHome />} />
            <Route path="esg/frameworks" element={<ESGFrameworksPage />} />
            <Route path="esg-frameworks" element={<ESGFrameworksPage />} />
            <Route path="esg/gri" element={<GRIStandardsCollection />} />
            <Route path="esg/tcfd" element={<TCFDDataCollection />} />
            <Route path="esg/sbti" element={<SBTiDataCollection />} />
            <Route path="esg/csrd" element={<CSRDDataCollection />} />
            <Route path="esg/cdp" element={<CDPDataCollection />} />
            <Route path="esg/sdg" element={<SDGDataCollection />} />
            <Route path="esg/data-entry" element={<ESGDataEntryHub />} />
            <Route path="esg/data-entry/ghg-inventory" element={<GHGInventory />} />
            <Route path="esg/data-entry/energy-management" element={<EnergyManagementCollection />} />
            <Route path="esg/data-entry/employee-demographics" element={<EmployeeDemographicsCollection />} />
            <Route path="esg/data-entry/health-safety" element={<HealthSafetyCollection />} />
            <Route path="esg/data-entry/training-development" element={<TrainingDevelopmentCollection />} />
            <Route path="esg/data-entry/diversity-inclusion" element={<DiversityInclusionCollection />} />
            <Route path="esg/data-entry/board-composition" element={<BoardCompositionCollection />} />
            <Route path="esg/data-entry/ethics-anti-corruption" element={<EthicsAntiCorruptionCollection />} />
            <Route path="esg/data-entry/risk-management" element={<RiskManagementCollection />} />
            <Route path="esg/data-entry/water-management" element={<WaterManagementCollection />} />
            <Route path="esg/data-entry/waste-management" element={<WasteManagementCollection />} />
            <Route path="esg/data-entry/materials-circular-economy" element={<MaterialsCircularEconomyCollection />} />
            <Route path="esg/data-entry/biodiversity-land-use" element={<BiodiversityLandUseCollection />} />
            <Route path="esg/materiality" element={<MaterialityAssessment />} />
            <Route path="esg/targets" element={<TargetManagement />} />
            <Route path="esg/targets/create" element={<TargetCreation />} />
            <Route path="esg/reports" element={<ReportsLibrary />} />
            <Route path="esg/reports/generate" element={<ReportGenerator />} />
            <Route path="esg/social" element={<SocialDashboard />} />
            <Route path="esg/governance" element={<GovernanceDashboard />} />
            <Route path="esg/environmental" element={<EnvironmentalDashboard />} />
          </Route>
        </Routes>
      </Router>
      <PWAInstallPrompt />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
