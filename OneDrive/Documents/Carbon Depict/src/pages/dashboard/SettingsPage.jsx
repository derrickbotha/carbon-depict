// Cache bust 2025-10-23
import { Input, Select } from '@atoms/Input'
import { PrimaryButton } from '@atoms/Button'
import { User, Building, Globe, Bell } from '@atoms/Icon'

export default function SettingsPage() {
  const industries = [
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'energy', label: 'Energy & Utilities' },
    { value: 'fleet', label: 'Fleet & Transport' },
    { value: 'food', label: 'Food Industry' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
  ]

  const regions = [
    { value: 'uk', label: 'United Kingdom' },
    { value: 'asia', label: 'South East Asia' },
    { value: 'africa', label: 'Africa' },
    { value: 'eu', label: 'European Union' },
    { value: 'us', label: 'United States' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-cd-text">Settings</h1>
        <p className="text-cd-muted">Manage your account and preferences</p>
      </div>

      {/* Company Profile */}
      <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
        <div className="mb-6 flex items-center gap-3">
          <Building strokeWidth={2} />
          <h2 className="text-xl font-semibold text-cd-text">Company Profile</h2>
        </div>
        <form className="space-y-6">
          <Input
            label="Company Name"
            type="text"
            defaultValue="Example Corp Ltd."
            required
          />
          <Select
            label="Industry"
            options={industries}
            defaultValue="agriculture"
            required
          />
          <Select
            label="Primary Region"
            options={regions}
            defaultValue="uk"
            required
            helperText="Used for default emission factors"
          />
          <PrimaryButton type="submit">Save Changes</PrimaryButton>
        </form>
      </div>

      {/* User Profile */}
      <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
        <div className="mb-6 flex items-center gap-3">
          <User strokeWidth={2} />
          <h2 className="text-xl font-semibold text-cd-text">User Profile</h2>
        </div>
        <form className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            defaultValue="John Doe"
            required
          />
          <Input
            label="Email"
            type="email"
            defaultValue="john@example.com"
            required
          />
          <Input
            label="Job Title"
            type="text"
            placeholder="e.g., Sustainability Manager"
          />
          <PrimaryButton type="submit">Update Profile</PrimaryButton>
        </form>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
        <div className="mb-6 flex items-center gap-3">
          <Bell strokeWidth={2} />
          <h2 className="text-xl font-semibold text-cd-text">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-cd-text">Email notifications</p>
              <p className="text-sm text-cd-muted">Receive updates about your emissions data</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 rounded border-cd-border text-cd-midnight focus:ring-cd-desert"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-cd-text">Monthly reports</p>
              <p className="text-sm text-cd-muted">Automatic monthly emission summaries</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 rounded border-cd-border text-cd-midnight focus:ring-cd-desert"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-cd-text">Factor updates</p>
              <p className="text-sm text-cd-muted">Get notified when DEFRA factors are updated</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-cd-border text-cd-midnight focus:ring-cd-desert"
            />
          </label>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
        <div className="mb-6 flex items-center gap-3">
          <Globe strokeWidth={2} />
          <h2 className="text-xl font-semibold text-cd-text">Regional Settings</h2>
        </div>
        <form className="space-y-6">
          <Select
            label="Date Format"
            options={[
              { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
              { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
              { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
            ]}
            defaultValue="yyyy-mm-dd"
          />
          <Select
            label="Unit System"
            options={[
              { value: 'metric', label: 'Metric (kg, km)' },
              { value: 'imperial', label: 'Imperial (lb, mi)' },
            ]}
            defaultValue="metric"
          />
          <PrimaryButton type="submit">Save Preferences</PrimaryButton>
        </form>
      </div>
    </div>
  )
}

