// Cache bust 2025-10-23
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Input } from '@atoms/Input'
import { LoadingButton, OutlineButton } from '@atoms/Button'
import { Mail, Eye, EyeOff, AlertCircle } from '@atoms/Icon'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('=== LOGIN ATTEMPT ===')
    console.log('Email:', formData.email)
    console.log('Password length:', formData.password.length)
    console.log('Calling login function...')

    const result = await login(formData.email, formData.password)

    console.log('=== LOGIN RESULT ===')
    console.log('Success:', result.success)
    console.log('Error:', result.error)
    console.log('Full result:', result)

    if (result.success) {
      console.log('✅ Login successful! Redirecting...')
      // Redirect to the page they tried to visit or dashboard
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } else {
      console.error('❌ Login failed:', result.error)
      setError(result.error)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cd-surface px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-cd-midnight"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-cd-midnight text-white">
              <span className="font-mono text-lg">CD</span>
            </div>
            <span>CarbonDepict</span>
          </Link>
          <p className="mt-2 text-sm text-cd-muted">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="rounded-lg bg-white p-8 shadow-cd-md">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" strokeWidth={2} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Login Failed</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-cd-muted hover:text-cd-text"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-cd-border text-cd-midnight focus:ring-cd-desert"
                />
                <span className="text-sm text-cd-muted">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-cd-midnight hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              variant="primary"
              className="w-full"
            >
              Sign in
            </LoadingButton>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cd-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-cd-muted">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <OutlineButton className="w-full flex items-center justify-center gap-2">
                <Mail strokeWidth={2} />
                Google
              </OutlineButton>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-cd-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-cd-midnight hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

