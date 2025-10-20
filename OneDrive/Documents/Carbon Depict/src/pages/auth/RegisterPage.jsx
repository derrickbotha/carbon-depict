import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Select } from '@atoms/Input'
import { LoadingButton } from '@atoms/Button'
import { Eye, EyeOff } from '@atoms/Icon'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    industry: '',
  })
  const navigate = useNavigate()

  const industries = [
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'energy', label: 'Energy & Utilities' },
    { value: 'fleet', label: 'Fleet & Transport' },
    { value: 'food', label: 'Food Industry' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setLoading(true)

    // TODO: Implement actual registration logic
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cd-surface px-4 py-12">
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
          <p className="mt-2 text-sm text-cd-muted">Create your account</p>
        </div>

        {/* Registration Form */}
        <div className="rounded-lg bg-white p-8 shadow-cd-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Company Name"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your Company Ltd."
              required
            />

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

            <Select
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              options={industries}
              placeholder="Select your industry"
              required
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
                autoComplete="new-password"
                helperText="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-cd-muted hover:text-cd-text"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            <div className="text-sm text-cd-muted">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-cd-border text-cd-midnight focus:ring-cd-desert"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-cd-midnight hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-cd-midnight hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              variant="primary"
              className="w-full"
            >
              Create account
            </LoadingButton>
          </form>

          <p className="mt-6 text-center text-sm text-cd-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-cd-midnight hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
