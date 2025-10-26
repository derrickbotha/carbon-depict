// Cache bust 2025-10-23
import { useState } from 'react'
import { Input, Select, Textarea } from '@atoms/Input'
import { PrimaryButton, OutlineButton } from '@atoms/Button'
import { Plus, Upload } from '@atoms/Icon'
import Alert from '@molecules/Alert'

export default function EmissionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showForm, setShowForm] = useState(false)

  const categories = [
    { value: 'fuels', label: 'Fuels (Direct Combustion)' },
    { value: 'electricity', label: 'Electricity, Heat & Steam' },
    { value: 'refrigerants', label: 'Refrigerants & Process' },
    { value: 'passenger-transport', label: 'Passenger Land Transport' },
    { value: 'freight-transport', label: 'Freight Land Transport' },
    { value: 'water', label: 'Water Supply & Treatment' },
    { value: 'waste', label: 'Waste Disposal' },
  ]

  const fuelTypes = [
    { value: 'diesel', label: 'Diesel' },
    { value: 'petrol', label: 'Petrol (Gasoline)' },
    { value: 'natural-gas', label: 'Natural Gas' },
    { value: 'coal', label: 'Coal' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-cd-text">Emissions Tracking</h1>
          <p className="text-cd-muted">
            Add and manage emission data across all categories
          </p>
        </div>
        <div className="flex gap-3">
          <OutlineButton className="flex items-center gap-2">
            <Upload strokeWidth={2} />
            Import Excel
          </OutlineButton>
          <PrimaryButton
            className="flex items-center gap-2"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus strokeWidth={2} />
            Add Entry
          </PrimaryButton>
        </div>
      </div>

      {/* Info Alert */}
      <Alert strokeWidth={2} />
      <div className="text-cd-muted text-sm mt-2">
        All calculations use DEFRA 2025 emission factors and follow World Resources Institute (WRI) methodology for transparent, auditable results.
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-md">
          <h2 className="mb-6 text-xl font-semibold text-cd-text">Add New Emission Entry</h2>

          <form className="space-y-6">
            <Select
              label="Category"
              options={categories}
              placeholder="Select emission category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              helperText="Choose the category that matches your emission source"
            />

            {selectedCategory === 'fuels' && (
              <>
                <Select
                  label="Fuel Type"
                  options={fuelTypes}
                  placeholder="Select fuel type"
                  required
                />

                <Input
                  label="Quantity"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  helperText="Enter amount in litres or kWh"
                />

                <Input
                  label="Biofuel Blend %"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  helperText="Optional: Enter biofuel percentage if applicable"
                />
              </>
            )}

            {selectedCategory === 'passenger-transport' && (
              <>
                <Select
                  label="Vehicle Type"
                  options={[
                    { value: 'car-small', label: 'Car - Small (Petrol)' },
                    { value: 'car-medium', label: 'Car - Medium (Diesel)' },
                    { value: 'van-class-1', label: 'Van - Class I' },
                    { value: 'van-class-2', label: 'Van - Class II' },
                  ]}
                  placeholder="Select vehicle type"
                  required
                />

                <Input
                  label="Distance (km)"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  required
                />

                <Input
                  label="Vehicle Model (optional)"
                  type="text"
                  placeholder="e.g., Toyota Hilux"
                  helperText="AI will suggest emission factors based on model"
                />

                <Input
                  label="Number of Trips"
                  type="number"
                  placeholder="1"
                  required
                />
              </>
            )}

            <Textarea
              label="Description"
              placeholder="Add notes about this emission entry..."
              rows={3}
              helperText="Provide context for this entry (optional)"
            />

            <div className="flex gap-4 border-t border-cd-border pt-6">
              <PrimaryButton type="submit" className="flex-1">
                Calculate & Save
              </PrimaryButton>
              <OutlineButton
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </OutlineButton>
            </div>
          </form>
        </div>
      )}

      {/* Emissions Table */}
      <div className="rounded-lg border border-cd-border bg-white shadow-cd-sm">
        <div className="border-b border-cd-border px-6 py-4">
          <h2 className="text-lg font-semibold text-cd-text">Recent Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cd-surface text-left text-sm text-cd-muted">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Scope</th>
                <th className="px-6 py-3 text-right">Emissions (kgCO₂e)</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cd-border text-sm">
              <tr className="hover:bg-cd-surface">
                <td className="px-6 py-4 text-cd-muted">2025-10-18</td>
                <td className="px-6 py-4">Fuels</td>
                <td className="px-6 py-4">Diesel - Tractor</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-cd-midnight/10 px-2 py-1 text-xs font-medium text-cd-midnight">
                    Scope 1
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium">254.60</td>
                <td className="px-6 py-4">
                  <button className="text-cd-midnight hover:underline">Edit</button>
                </td>
              </tr>
              <tr className="hover:bg-cd-surface">
                <td className="px-6 py-4 text-cd-muted">2025-10-17</td>
                <td className="px-6 py-4">Electricity</td>
                <td className="px-6 py-4">Office - Monthly</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-cd-teal/10 px-2 py-1 text-xs font-medium text-cd-teal">
                    Scope 2
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium">208.98</td>
                <td className="px-6 py-4">
                  <button className="text-cd-midnight hover:underline">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

