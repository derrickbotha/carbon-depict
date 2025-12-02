import React, { useState } from 'react';
import { User, Building, Bell, Globe, Save } from 'lucide-react';

// --- HOOK ---
const useSettings = () => {
  const [companyProfile, setCompanyProfile] = useState({
    name: 'Example Corp Ltd.',
    industry: 'energy',
    region: 'uk',
  });

  const [userProfile, setUserProfile] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    jobTitle: 'Sustainability Manager',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    monthlyReports: true,
    factorUpdates: false,
  });

  const [regional, setRegional] = useState({
    dateFormat: 'yyyy-mm-dd',
    unitSystem: 'metric',
  });

  const handleFormChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (section) => (e) => {
    e.preventDefault();
    console.log(`Saving ${section} settings...`);
    // Here you would call an API to save the data
  };

  return {
    companyProfile,
    userProfile,
    notifications,
    regional,
    handleCompanyChange: handleFormChange(setCompanyProfile),
    handleUserChange: handleFormChange(setUserProfile),
    handleNotificationChange: handleFormChange(setNotifications),
    handleRegionalChange: handleFormChange(setRegional),
    handleSubmit,
  };
};

// --- SUB-COMPONENTS ---

const Header = () => (
  <div>
    <h1 className="text-4xl font-bold text-greenly-midnight">Settings</h1>
    <p className="mt-2 text-lg text-greenly-slate">
      Manage your account, organization, and preferences.
    </p>
  </div>
);

const SettingsCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-greenly-light">
    <div className="p-6 border-b border-greenly-light flex items-center gap-4">
      <Icon className="h-6 w-6 text-greenly-teal" />
      <h2 className="text-xl font-bold text-greenly-midnight">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Input = ({ label, name, ...props }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-greenly-midnight mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      {...props}
      className="w-full rounded-xl border-2 border-greenly-light shadow-sm focus:border-greenly-teal focus:ring-4 focus:ring-greenly-teal/10 transition-all px-4 py-3 text-greenly-midnight"
    />
  </div>
);

const Select = ({ label, name, children, ...props }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-greenly-midnight mb-1"
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      {...props}
      className="w-full rounded-xl border-2 border-greenly-light shadow-sm focus:border-greenly-teal focus:ring-4 focus:ring-greenly-teal/10 transition-all px-4 py-3 text-greenly-midnight"
    >
      {children}
    </select>
  </div>
);

const Toggle = ({ label, description, name, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <div>
      <p className="font-semibold text-greenly-midnight group-hover:text-greenly-teal transition-colors">{label}</p>
      <p className="text-sm text-greenly-slate">{description}</p>
    </div>
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-5 w-5 rounded border-2 border-greenly-light text-greenly-teal focus:ring-4 focus:ring-greenly-teal/10 transition-all"
    />
  </label>
);

const SaveButton = () => (
  <button
    type="submit"
    className="flex items-center gap-2 rounded-xl bg-greenly-midnight px-6 py-2.5 text-sm font-semibold text-white hover:bg-greenly-midnight/90 transition-all shadow-sm"
  >
    <Save className="h-5 w-5" />
    Save Changes
  </button>
);

// --- MAIN COMPONENT ---
export default function SettingsPage() {
  const {
    companyProfile,
    userProfile,
    notifications,
    regional,
    handleCompanyChange,
    handleUserChange,
    handleNotificationChange,
    handleRegionalChange,
    handleSubmit,
  } = useSettings();

  return (
    <div className="p-4 sm:p-6 bg-greenly-secondary min-h-screen space-y-8">
      <Header />

      <SettingsCard icon={Building} title="Company Profile">
        <form
          onSubmit={handleSubmit('Company Profile')}
          className="space-y-6 max-w-2xl"
        >
          <Input
            label="Company Name"
            name="name"
            type="text"
            value={companyProfile.name}
            onChange={handleCompanyChange}
            required
          />
          <Select
            label="Industry"
            name="industry"
            value={companyProfile.industry}
            onChange={handleCompanyChange}
            required
          >
            <option value="agriculture">Agriculture</option>
            <option value="energy">Energy & Utilities</option>
            <option value="manufacturing">Manufacturing</option>
          </Select>
          <Select
            label="Primary Region"
            name="region"
            value={companyProfile.region}
            onChange={handleCompanyChange}
            required
          >
            <option value="uk">United Kingdom</option>
            <option value="eu">European Union</option>
            <option value="us">United States</option>
          </Select>
          <SaveButton />
        </form>
      </SettingsCard>

      <SettingsCard icon={User} title="User Profile">
        <form
          onSubmit={handleSubmit('User Profile')}
          className="space-y-6 max-w-2xl"
        >
          <Input
            label="Full Name"
            name="fullName"
            type="text"
            value={userProfile.fullName}
            onChange={handleUserChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={userProfile.email}
            onChange={handleUserChange}
            required
          />
          <Input
            label="Job Title"
            name="jobTitle"
            type="text"
            value={userProfile.jobTitle}
            onChange={handleUserChange}
            placeholder="e.g., Sustainability Manager"
          />
          <SaveButton />
        </form>
      </SettingsCard>

      <SettingsCard icon={Bell} title="Notifications">
        <div className="space-y-6 max-w-2xl">
          <Toggle
            label="Email Notifications"
            description="Receive updates about your emissions data"
            name="email"
            checked={notifications.email}
            onChange={handleNotificationChange}
          />
          <Toggle
            label="Monthly Reports"
            description="Automatic monthly emission summaries"
            name="monthlyReports"
            checked={notifications.monthlyReports}
            onChange={handleNotificationChange}
          />
          <Toggle
            label="Factor Updates"
            description="Get notified when DEFRA factors are updated"
            name="factorUpdates"
            checked={notifications.factorUpdates}
            onChange={handleNotificationChange}
          />
        </div>
      </SettingsCard>

      <SettingsCard icon={Globe} title="Regional Settings">
        <form
          onSubmit={handleSubmit('Regional Settings')}
          className="space-y-6 max-w-2xl"
        >
          <Select
            label="Date Format"
            name="dateFormat"
            value={regional.dateFormat}
            onChange={handleRegionalChange}
          >
            <option value="dd/mm/yyyy">DD/MM/YYYY</option>
            <option value="mm/dd/yyyy">MM/DD/YYYY</option>
            <option value="yyyy-mm-dd">YYYY-MM-DD</option>
          </Select>
          <Select
            label="Unit System"
            name="unitSystem"
            value={regional.unitSystem}
            onChange={handleRegionalChange}
          >
            <option value="metric">Metric (kg, km)</option>
            <option value="imperial">Imperial (lb, mi)</option>
          </Select>
          <SaveButton />
        </form>
      </SettingsCard>
    </div>
  );
}
