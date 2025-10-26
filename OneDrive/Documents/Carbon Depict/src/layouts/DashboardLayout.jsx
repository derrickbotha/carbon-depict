// Cache bust 2025-10-23
import { useState } from 'react'
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
} from '@atoms/Icon'
import { IconButton } from '@atoms/Button'
import clsx from 'clsx'
import { useAuth } from '../contexts/AuthContext'

/**
 * DashboardLayout - Layout for authenticated dashboard pages
 * Includes Sidebar and Topbar
 */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, loading } = useAuth()
  
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', strokeWidth: 2 },
    { icon: Leaf, label: 'ESG', href: '/dashboard/esg', strokeWidth: 2 },
    { icon: BarChart3, label: 'Emissions', href: '/dashboard/emissions', strokeWidth: 2 },
    { icon: FileText, label: 'Reports', href: '/dashboard/reports', strokeWidth: 2 },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', strokeWidth: 2 },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cd-surface">
      {/* Sidebar - Desktop */}
      <aside
        className={clsx(
          'hidden lg:flex lg:flex-col border-r border-cd-border bg-white transition-all duration-200',
          sidebarOpen ? 'lg:w-64' : 'lg:w-20'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-cd-border px-4">
          {sidebarOpen && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-lg font-bold text-cd-midnight"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cd-midnight text-white">
                <span className="font-mono text-sm">CD</span>
              </div>
              <span>CarbonDepict</span>
            </Link>
          )}
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            ariaLabel="Toggle sidebar"
            className="ml-auto"
          >
            <Menu className="h-5 w-5" />
          </IconButton>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-cd-surface text-cd-midnight border-l-3 border-cd-midnight'
                    : 'text-cd-muted hover:bg-cd-surface hover:text-cd-midnight'
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
        <div className="border-t border-cd-border p-4">
          <button
            onClick={handleLogout}
            className={clsx(
              'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-cd-muted transition-colors hover:bg-cd-surface hover:text-cd-error'
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-cd-border bg-white lg:hidden">
            {/* Mobile Logo */}
            <div className="flex h-16 items-center justify-between border-b border-cd-border px-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-lg font-bold text-cd-midnight"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cd-midnight text-white">
                  <span className="font-mono text-sm">CD</span>
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
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-cd-surface text-cd-midnight border-l-3 border-cd-midnight'
                        : 'text-cd-muted hover:bg-cd-surface hover:text-cd-midnight'
                    )}
                  >
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-cd-border p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-cd-muted transition-colors hover:bg-cd-surface hover:text-cd-error"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-cd-border bg-white px-4 lg:px-8">
          <IconButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            ariaLabel="Toggle menu"
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </IconButton>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <IconButton ariaLabel="Notifications">
              <Bell className="h-5 w-5" />
            </IconButton>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cd-teal text-white">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-cd-midnight">
                    {user?.firstName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-cd-midnight">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

