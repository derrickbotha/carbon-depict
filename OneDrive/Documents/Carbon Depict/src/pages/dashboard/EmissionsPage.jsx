import React, { useState, useMemo } from 'react';
import { Upload, Plus, Info, Edit, Trash2, X } from 'lucide-react';

// --- MOCK DATA & HOOK ---
const useEmissionsData = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const recentEntries = useMemo(() => [
    { id: 1, date: '2025-10-18', category: 'Fuels', description: 'Diesel - Tractor', scope: 1, emissions: 254.60 },
    { id: 2, date: '2025-10-17', category: 'Electricity', description: 'Office - Monthly', scope: 2, emissions: 208.98 },
    { id: 3, date: '2025-10-16', category: 'Freight Transport', description: 'Supplier Delivery', scope: 3, emissions: 150.75 },
  ], []);

  const categories = [
    { value: 'fuels', label: 'Fuels (Direct Combustion)' },
    { value: 'electricity', label: 'Electricity, Heat & Steam' },
    { value: 'refrigerants', label: 'Refrigerants & Process' },
    { value: 'passenger-transport', label: 'Passenger Land Transport' },
    { value: 'freight-transport', label: 'Freight Land Transport' },
    { value: 'water', label: 'Water Supply & Treatment' },
    { value: 'waste', label: 'Waste Disposal' },
  ];

  const fuelTypes = [
    { value: 'diesel', label: 'Diesel' },
    { value: 'petrol', label: 'Petrol (Gasoline)' },
    { value: 'natural-gas', label: 'Natural Gas' },
    { value: 'coal', label: 'Coal' },
  ];

  const vehicleTypes = [
    { value: 'car-small', label: 'Car - Small (Petrol)' },
    { value: 'car-medium', label: 'Car - Medium (Diesel)' },
    { value: 'van-class-1', label: 'Van - Class I' },
    { value: 'van-class-2', label: 'Van - Class II' },
  ];

  const handleAddEntry = () => setShowForm(true);
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCategory('');
  };

  return {
    showForm,
    selectedCategory,
    loading,
    recentEntries,
    categories,
    fuelTypes,
    vehicleTypes,
    setSelectedCategory,
    handleAddEntry,
    handleCloseForm,
  };
};

// --- SUB-COMPONENTS ---

const Header = ({ onAddEntry }) => (
  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
    <div>
      <h1 className="text-2xl font-bold text-greenly-charcoal sm:text-3xl">Emissions Tracking</h1>
      <p className="mt-1 text-sm text-greenly-slate sm:text-base">Add and manage emission data across all categories.</p>
    </div>
    <div className="flex items-center gap-2">
      <button className="btn-secondary">
        <Upload className="h-4 w-4" /> Import
      </button>
      <button onClick={onAddEntry} className="btn-primary">
        <Plus className="h-4 w-4" /> Add Entry
      </button>
    </div>
  </div>
);

const InfoAlert = () => (
  <div className="flex items-start gap-3 rounded-lg border border-greenly-light-gray bg-greenly-off-white p-4">
    <div className="flex-shrink-0 text-greenly-primary">
      <Info className="h-5 w-5" />
    </div>
    <div>
      <h3 className="font-semibold text-greenly-charcoal">WRI-Compliant Calculations</h3>
      <p className="text-sm text-greenly-slate">
        All calculations use DEFRA 2025 emission factors and follow World Resources Institute (WRI) methodology for transparent, auditable results.
      </p>
    </div>
  </div>
);

const FormInput = ({ label, id, helperText, ...props }) => (
    <div>
        <label htmlFor={id} className="input-label">{label}</label>
        <input id={id} {...props} className="input-base" />
        {helperText && <p className="input-helper-text">{helperText}</p>}
    </div>
);

const FormSelect = ({ label, id, options, helperText, ...props }) => (
    <div>
        <label htmlFor={id} className="input-label">{label}</label>
        <select id={id} {...props} className="input-base">
            {props.placeholder && <option value="">{props.placeholder}</option>}
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {helperText && <p className="input-helper-text">{helperText}</p>}
    </div>
);

const AddEntryForm = ({ categories, fuelTypes, vehicleTypes, selectedCategory, setSelectedCategory, onClose }) => (
  <div className="card relative p-6 sm:p-8">
    <button onClick={onClose} className="btn-icon absolute top-4 right-4">
        <X className="h-5 w-5" />
    </button>
    <h2 className="text-xl font-bold text-greenly-charcoal mb-6">New Emission Entry</h2>
    <form className="space-y-5">
      <FormSelect
        id="category"
        label="Category"
        options={categories}
        placeholder="Select emission category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        required
        helperText="Choose the category that matches your emission source."
      />

      {selectedCategory === 'fuels' && (
        <div className="space-y-5 rounded-md border border-greenly-light-gray bg-greenly-off-white p-4">
          <FormSelect id="fuel-type" label="Fuel Type" options={fuelTypes} placeholder="Select fuel type" required />
          <FormInput id="quantity" label="Quantity" type="number" step="0.01" placeholder="0.00" required helperText="Enter amount in litres or kWh." />
          <FormInput id="biofuel" label="Biofuel Blend %" type="number" step="0.1" placeholder="0" helperText="Optional: Enter biofuel percentage if applicable." />
        </div>
      )}

      {selectedCategory === 'passenger-transport' && (
        <div className="space-y-5 rounded-md border border-greenly-light-gray bg-greenly-off-white p-4">
          <FormSelect id="vehicle-type" label="Vehicle Type" options={vehicleTypes} placeholder="Select vehicle type" required />
          <FormInput id="distance" label="Distance (km)" type="number" step="0.1" placeholder="0.0" required />
          <FormInput id="vehicle-model" label="Vehicle Model (optional)" type="text" placeholder="e.g., Toyota Hilux" helperText="AI can suggest emission factors based on model." />
        </div>
      )}

      <div>
        <label htmlFor="description" className="input-label">Description</label>
        <textarea id="description" rows={3} className="input-base" placeholder="Add notes about this emission entry..."></textarea>
        <p className="input-helper-text">Provide context for this entry (optional).</p>
      </div>

      <div className="flex flex-col gap-3 border-t border-greenly-light-gray pt-5 sm:flex-row">
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Calculate & Save
        </button>
        <button type="button" onClick={onClose} className="btn-secondary w-full sm:w-auto">
          Cancel
        </button>
      </div>
    </form>
  </div>
);

const ScopePill = ({ scope }) => {
    const scopeClasses = {
        1: 'status-badge-blue',
        2: 'status-badge-purple',
        3: 'status-badge-teal',
    };
    return (
        <span className={`status-badge ${scopeClasses[scope] || 'status-badge-gray'}`}>
            Scope {scope}
        </span>
    );
};

const RecentEntriesTable = ({ entries, loading }) => (
  <div className="card overflow-hidden p-0">
    <div className="px-6 py-4">
      <h2 className="text-lg font-semibold text-greenly-charcoal">Recent Entries</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-greenly-off-white text-left text-greenly-slate">
          <tr>
            <th className="table-header">Date</th>
            <th className="table-header">Category</th>
            <th className="table-header">Description</th>
            <th className="table-header">Scope</th>
            <th className="table-header text-right">Emissions (kgCO₂e)</th>
            <th className="table-header text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-greenly-light-gray">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <tr key={i}>
                <td colSpan="6" className="p-4"><div className="h-6 w-full rounded bg-gray-200 animate-pulse"></div></td>
              </tr>
            ))
          ) : (
            entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-greenly-off-white transition-colors">
                <td className="table-cell whitespace-nowrap">{entry.date}</td>
                <td className="table-cell font-medium text-greenly-charcoal">{entry.category}</td>
                <td className="table-cell">{entry.description}</td>
                <td className="table-cell"><ScopePill scope={entry.scope} /></td>
                <td className="table-cell text-right font-semibold text-greenly-charcoal whitespace-nowrap">{entry.emissions.toFixed(2)}</td>
                <td className="table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <button className="btn-icon-sm text-greenly-primary hover:bg-greenly-primary/10"><Edit className="h-4 w-4" /></button>
                    <button className="btn-icon-sm text-greenly-red hover:bg-greenly-red/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function EmissionsPage() {
  const {
    showForm,
    selectedCategory,
    loading,
    recentEntries,
    categories,
    fuelTypes,
    vehicleTypes,
    setSelectedCategory,
    handleAddEntry,
    handleCloseForm,
  } = useEmissionsData();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Header onAddEntry={handleAddEntry} />
      <InfoAlert />

      {showForm && (
        <AddEntryForm
          categories={categories}
          fuelTypes={fuelTypes}
          vehicleTypes={vehicleTypes}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onClose={handleCloseForm}
        />
      )}

      <RecentEntriesTable entries={recentEntries} loading={loading} />
    </div>
  );
}
