import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@atoms/Input'
import { LoadingButton, OutlineButton } from '@atoms/Button'
import { Mail, Eye, EyeOff } from '@atoms/Icon'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement actual login logic
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
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
                <Mail className="h-5 w-5" />
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
