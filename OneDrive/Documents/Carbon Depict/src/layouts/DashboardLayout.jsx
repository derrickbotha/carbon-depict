// Cache bust 2025-10-23
import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Leaf,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
} from '@atoms/Icon'
import { IconButton } from '@atoms/Button'
import NavigationControls from '@molecules/NavigationControls'
import NotificationPanel from '@molecules/NotificationPanel'
import clsx from 'clsx'
import { useAuth } from '../contexts/AuthContext'
import ErrorBoundary from '../components/utility/ErrorBoundary'

/**
 * DashboardLayout - Greenly Design System Layout
 * 280px sidebar (collapsible to 64px), 64px topnav, Earth Green accents
 */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  const location = useLocation()

  // TODO: Replace with actual auth check
  const isAuthenticated = true // Placeholder

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', strokeWidth: 2 },
    { icon: Leaf, label: 'ESG', href: '/dashboard/esg', strokeWidth: 2 },
    { icon: BarChart3, label: 'Emissions', href: '/dashboard/emissions', strokeWidth: 2 },
    { icon: FileText, label: 'Reports', href: '/dashboard/reports', strokeWidth: 2 },
    {
      icon: () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      label: 'Messages',
      href: '/dashboard/messages',
      strokeWidth: 2
    },
    ...(user?.role === 'manager' || user?.role === 'admin' ? [{
      icon: CheckSquare,
      label: 'Approvals',
      href: '/dashboard/approvals',
      strokeWidth: 2
    }] : []),
    {
      icon: () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      label: 'Materiality',
      href: '/dashboard/esg/materiality',
      strokeWidth: 2
    },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', strokeWidth: 2 },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-greenly-off-white">
      {/* Sidebar - Desktop */}
      <aside
        className={clsx(
          'hidden lg:flex lg:flex-col relative border-r border-greenly-light bg-white shadow-greenly-sm transition-all duration-300 ease-in-out',
          sidebarOpen ? 'lg:w-72' : 'lg:w-20'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-greenly-light px-4">
          <Link
            to="/dashboard"
            className={clsx(
              "flex items-center gap-3 text-lg font-semibold text-greenly-charcoal transition-opacity duration-200",
              !sidebarOpen && "opacity-0 pointer-events-none"
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-greenly-primary text-white shadow-greenly-primary flex-shrink-0">
              <Leaf className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <span>CarbonDepict</span>
          </Link>
          <div
            className={clsx(
              "absolute left-1/2 -translate-x-1/2 top-3 transition-opacity duration-200",
              sidebarOpen && "opacity-0 pointer-events-none"
            )}
          >
            <Link
              to="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-greenly-primary text-white shadow-greenly-primary"
            >
              <Leaf className="h-6 w-6" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="absolute top-5 -right-3 z-10 hidden lg:block">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white border border-greenly-light shadow-md hover:bg-greenly-light text-greenly-gray transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 pt-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-greenly-primary/10 text-greenly-primary'
                    : 'text-greenly-charcoal hover:bg-greenly-light hover:text-greenly-primary',
                  !sidebarOpen && "justify-center"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-greenly-light p-3">
          <button
            onClick={handleLogout}
            className={clsx(
              'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-greenly-gray transition-all duration-200 hover:bg-greenly-alert/10 hover:text-greenly-alert',
              !sidebarOpen && "justify-center"
            )}
            title={!sidebarOpen ? 'Log Out' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-greenly-charcoal/60 lg:hidden transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside
        className={clsx(
          "fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-greenly-light bg-white shadow-lg lg:hidden transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-greenly-light px-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-lg font-semibold text-greenly-charcoal"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-greenly-primary text-white shadow-greenly-primary">
              <Leaf className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <span>CarbonDepict</span>
          </Link>
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            ariaLabel="Close menu"
          >
            <X className="h-5 w-5" />
          </IconButton>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 space-y-1 px-3 pt-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-greenly-primary/10 text-greenly-primary'
                    : 'text-greenly-charcoal hover:bg-greenly-light hover:text-greenly-primary'
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-greenly-light p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-greenly-gray transition-all duration-200 hover:bg-greenly-alert/10 hover:text-greenly-alert"
          >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar - 64px height */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-greenly-light bg-white shadow-sm px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              ariaLabel="Toggle menu"
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </IconButton>

            <NavigationControls showStats={true} className="hidden sm:flex" />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1 sm:gap-2">
            <NotificationPanel />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-greenly-light transition-all duration-200"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-greenly-primary text-white shadow-greenly-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-greenly-charcoal">
                    {user?.firstName || 'User'}
                  </p>
                  <p className="text-xs text-greenly-gray">{user?.email || ''}</p>
                </div>
                <ChevronDown className={clsx(
                  "h-4 w-4 text-greenly-gray transition-transform duration-200",
                  showUserMenu && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-greenly-lg border border-greenly-light z-50 animate-scale-in"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="p-4 border-b border-greenly-light">
                    <p className="text-sm font-semibold text-greenly-charcoal">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-greenly-gray mt-1 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-greenly-charcoal hover:bg-greenly-light hover:text-greenly-primary transition-all duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm text-greenly-alert hover:bg-greenly-alert/10 transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-greenly-off-white">
          <div className="container-greenly mx-auto max-w-screen-2xl">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}
