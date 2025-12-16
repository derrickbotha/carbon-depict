# Comprehensive API Integration Guide for All Data Collection Forms

## Overview
This guide provides step-by-step instructions to integrate all 30 remaining forms with their respective APIs, following the CSRD reference implementation.

---

## Quick Reference

### Reusable Hooks Created

1. **`useESGMetricForm(sourceType, reportingPeriod)`** - For simple forms using ESGMetric model
   - Location: `/src/hooks/useESGMetricForm.js`
   - Used by: 23 simple forms

2. **`useDedicatedModelForm(endpoint, reportingPeriod, singleResource)`** - For complex forms
   - Location: `/src/hooks/useDedicatedModelForm.js`
   - Used by: 6 dedicated model forms

3. **`<ExportButton />`** - Reusable export button component
   - Location: `/src/components/molecules/ExportButton.jsx`
   - Props: `onExport`, `disabled`, `loading`, `formats`

---

## Form Categories & API Endpoints

### A. Dedicated Model Forms (6 forms)

| Priority | Form Name | File | Endpoint | Single Resource? |
|----------|-----------|------|----------|------------------|
| 2 | Materiality Assessment | MaterialityAssessmentEnhanced.jsx | /api/materiality | No |
| - | Scope 3 Emissions | Scope3DataCollection.jsx | /api/scope3 | No |
| - | Risk Register | RiskRegisterForm.jsx | /api/risks | No |
| - | ESG Targets | ESGTargetsForm.jsx | /api/targets | No |
| - | SBTi Targets | SBTiTargetForm.jsx | /api/sbti | Yes |
| - | PCAF Assessment | PCAFAssessmentForm.jsx | /api/pcaf | No |

### B. ESGMetric-Based Forms (23 forms)

| Priority | Form Name | File | sourceType |
|----------|-----------|------|------------|
| 3 | Energy Management | EnergyManagementCollection.jsx | `energy_management` |
| 4 | GRI Framework | GRIDataCollection.jsx | `gri` |
| 5 | SASB Framework | SASBDataCollection.jsx | `sasb` |
| 6 | TCFD Framework | TCFDDataCollection.jsx | `tcfd` |
| 7 | Water Management | WaterManagementCollection.jsx | `water_management` |
| 8 | Waste Management | WasteManagementCollection.jsx | `waste_management` |
| 9 | Biodiversity & Land Use | BiodiversityLandUseCollection.jsx | `biodiversity_land_use` |
| 10 | Materials & Circular Economy | MaterialsCircularEconomyCollection.jsx | `materials_circular_economy` |
| - | Scope 1 Emissions | Scope1DataCollection.jsx | `scope1` |
| - | Scope 2 Emissions | Scope2DataCollection.jsx | `scope2` |
| - | GHG Inventory | GHGInventoryForm.jsx | `ghg_inventory` |
| - | Pollution | PollutionDataCollection.jsx | `pollution` |
| - | Employee Demographics | EmployeeDemographicsForm.jsx | `employee_demographics` |
| - | Diversity & Inclusion | DiversityInclusionForm.jsx | `diversity_inclusion` |
| - | Health & Safety | HealthSafetyForm.jsx | `health_safety` |
| - | Training & Development | TrainingDevelopmentForm.jsx | `training_development` |
| - | Human Rights | HumanRightsForm.jsx | `human_rights` |
| - | Community Engagement | CommunityEngagementForm.jsx | `community_engagement` |
| - | Board Composition | BoardCompositionForm.jsx | `board_composition` |
| - | Ethics & Anti-Corruption | EthicsAntiCorruptionForm.jsx | `ethics_anti_corruption` |
| - | CDP Framework | CDPDataCollection.jsx | `cdp` |
| - | ISSB Framework | ISSBDataCollection.jsx | `issb` |
| - | SDG Framework | SDGDataCollection.jsx | `sdg` |

---

## Implementation Pattern

### Pattern 1: Dedicated Model Forms

#### Step 1: Import Required Dependencies
```javascript
import React, { useState } from 'react';
import { useDedicatedModelForm } from '@hooks/useDedicatedModelForm';
import ExportButton from '@components/molecules/ExportButton';
import { Loader, Save } from 'lucide-react';
```

#### Step 2: Replace Mock Hook with API Hook
```javascript
// BEFORE (Mock)
const useFormData = () => {
  const [data, setData] = useState(mockData);
  return { data, loading: false };
};

// AFTER (API)
const FormComponent = () => {
  const [reportingPeriod] = useState(new Date().getFullYear().toString());

  const {
    data,
    loading,
    saving,
    error,
    createResource,
    updateResource,
    deleteResource,
    exportData,
    refetch
  } = useDedicatedModelForm('/api/materiality', reportingPeriod, false);

  // ... rest of component
};
```

#### Step 3: Add Loading State
```javascript
if (loading) {
  return (
    <div className="min-h-screen bg-greenly-off-white flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-8 h-8 text-greenly-primary animate-spin mx-auto mb-4" />
        <p className="text-greenly-slate">Loading data...</p>
      </div>
    </div>
  );
}
```

#### Step 4: Add Save Functionality
```javascript
const handleSave = async () => {
  const payload = {
    // Transform local state to API format
    reportingPeriod,
    // ... other fields
  };

  let result;
  if (data && data._id) {
    result = await updateResource(data._id, payload);
  } else {
    result = await createResource(payload);
  }

  if (result.success) {
    alert('Saved successfully!');
  } else {
    alert(`Failed to save: ${result.error}`);
  }
};
```

#### Step 5: Add Export Button
```javascript
<ExportButton
  onExport={exportData}
  disabled={loading || !data}
  loading={saving}
/>
```

#### Step 6: Update Save Button
```javascript
<button
  onClick={handleSave}
  disabled={saving || loading}
  className="btn-primary flex items-center gap-2"
>
  {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
  {saving ? 'Saving...' : 'Save Progress'}
</button>
```

---

### Pattern 2: ESGMetric-Based Forms

#### Step 1: Import Required Dependencies
```javascript
import React, { useState } from 'react';
import { useESGMetricForm } from '@hooks/useESGMetricForm';
import ExportButton from '@components/molecules/ExportButton';
import { Loader, Save, Plus, Trash2 } from 'lucide-react';
```

#### Step 2: Replace Mock Hook with API Hook
```javascript
// BEFORE (Mock)
const useFormData = () => {
  const [metrics, setMetrics] = useState(mockMetrics);
  return { metrics, loading: false };
};

// AFTER (API)
const FormComponent = () => {
  const [reportingPeriod] = useState(new Date().getFullYear().toString());

  const {
    data: metrics,
    loading,
    saving,
    error,
    createMetric,
    updateMetric,
    deleteMetric,
    exportData,
    refetch
  } = useESGMetricForm('energy_management', reportingPeriod);

  // ... rest of component
};
```

#### Step 3: Add Loading State
```javascript
if (loading) {
  return (
    <div className="min-h-screen bg-greenly-off-white flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-8 h-8 text-greenly-primary animate-spin mx-auto mb-4" />
        <p className="text-greenly-slate">Loading metrics...</p>
      </div>
    </div>
  );
}
```

#### Step 4: Add Create Functionality
```javascript
const handleCreate = async (formData) => {
  const result = await createMetric({
    metricName: formData.metricName,
    value: formData.value,
    unit: formData.unit,
    category: formData.category,
    // ... other fields
  });

  if (result.success) {
    alert('Metric created successfully!');
    // Clear form or close modal
  } else {
    alert(`Failed to create: ${result.error}`);
  }
};
```

#### Step 5: Add Update Functionality
```javascript
const handleUpdate = async (metricId, formData) => {
  const result = await updateMetric(metricId, {
    value: formData.value,
    status: formData.status,
    // ... other fields
  });

  if (result.success) {
    alert('Metric updated successfully!');
  } else {
    alert(`Failed to update: ${result.error}`);
  }
};
```

#### Step 6: Add Delete Functionality
```javascript
const handleDelete = async (metricId) => {
  if (!confirm('Are you sure you want to delete this metric?')) return;

  const result = await deleteMetric(metricId);

  if (result.success) {
    alert('Metric deleted successfully!');
  } else {
    alert(`Failed to delete: ${result.error}`);
  }
};
```

#### Step 7: Add Export Button
```javascript
<ExportButton
  onExport={exportData}
  disabled={loading || metrics.length === 0}
  loading={saving}
/>
```

---

## Complete Example: Energy Management Form

```javascript
// src/pages/dashboard/EnergyManagementCollection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Loader } from 'lucide-react';
import { useESGMetricForm } from '@hooks/useESGMetricForm';
import ExportButton from '@components/molecules/ExportButton';

const EnergyManagementCollection = () => {
  const [reportingPeriod] = useState(new Date().getFullYear().toString());
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Use the ESGMetric hook
  const {
    data: metrics,
    loading,
    saving,
    error,
    createMetric,
    updateMetric,
    deleteMetric,
    exportData
  } = useESGMetricForm('energy_management', reportingPeriod);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-greenly-off-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-greenly-primary animate-spin mx-auto mb-4" />
          <p className="text-greenly-slate">Loading energy data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-greenly-off-white p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await createMetric({
      metricName: formData.metricName,
      value: parseFloat(formData.value),
      unit: formData.unit,
      category: formData.category,
      description: formData.description
    });

    if (result.success) {
      alert('Energy metric created successfully!');
      setFormData({});
      setShowModal(false);
    } else {
      alert(`Failed to create: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-greenly-off-white">
      {/* Header */}
      <div className="bg-white border-b border-greenly-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard/esg" className="p-2 hover:bg-greenly-light-gray rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-greenly-charcoal">
                  Energy Management
                </h1>
                <p className="text-sm text-greenly-slate mt-1">
                  GRI 302 | CSRD E1 | SDG 7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ExportButton
                onExport={exportData}
                disabled={metrics.length === 0}
                loading={saving}
              />

              <button
                onClick={() => setShowModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} />
                Add Metric
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {metrics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-greenly-slate mb-4">No energy metrics yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary"
              >
                Add Your First Metric
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric._id} className="border border-greenly-light-gray rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-greenly-charcoal">
                        {metric.metricName}
                      </h3>
                      <p className="text-sm text-greenly-slate mt-1">
                        {metric.value} {metric.unit}
                      </p>
                      {metric.description && (
                        <p className="text-sm text-greenly-slate mt-2">
                          {metric.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(metric._id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={saving}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal for adding metrics */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-greenly-charcoal mb-4">
              Add Energy Metric
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-greenly-charcoal mb-1">
                  Metric Name
                </label>
                <input
                  type="text"
                  value={formData.metricName || ''}
                  onChange={(e) => setFormData({ ...formData, metricName: e.target.value })}
                  className="input-base w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-greenly-charcoal mb-1">
                  Value
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.value || ''}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="input-base w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-greenly-charcoal mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="input-base w-full"
                  placeholder="kWh, GJ, MWh"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyManagementCollection;
```

---

## Testing Checklist

For each updated form, verify:

- [ ] Data loads from API on component mount
- [ ] Loading state displays correctly
- [ ] Error states are handled
- [ ] Create operation works and refreshes data
- [ ] Update operation works and refreshes data
- [ ] Delete operation works (with confirmation)
- [ ] Export button downloads file in correct format
- [ ] Data persists between page refreshes
- [ ] Reporting period filtering works
- [ ] Form validates required fields

---

## Common Pitfalls & Solutions

### 1. **Data Not Loading**
**Problem**: Hook returns empty array
**Solution**: Check sourceType or endpoint spelling, verify authentication

### 2. **Save Fails with 401**
**Problem**: Unauthorized error
**Solution**: Ensure apiClient includes auth token, check user permissions

### 3. **Export Returns 404**
**Problem**: Export endpoint not found
**Solution**: Verify export route exists in backend for that resource

### 4. **Data Doesn't Persist**
**Problem**: Save succeeds but reload shows old data
**Solution**: Ensure `refetch()` is called after save, or data state updates correctly

### 5. **Single vs List Resource Confusion**
**Problem**: Getting array when expecting object
**Solution**: Set `singleResource` parameter correctly in `useDedicatedModelForm`

---

## Priority Implementation Order

**Week 1-2: High Priority (Forms 2-10)**
1. MaterialityAssessmentEnhanced.jsx
2. EnergyManagementCollection.jsx
3. GRIDataCollection.jsx
4. SASBDataCollection.jsx
5. TCFDDataCollection.jsx
6. WaterManagementCollection.jsx
7. WasteManagementCollection.jsx
8. BiodiversityLandUseCollection.jsx
9. MaterialsCircularEconomyCollection.jsx

**Week 3-4: Medium Priority (Forms 11-20)**
10. Scope3DataCollection.jsx (dedicated model)
11. RiskRegisterForm.jsx (dedicated model)
12. ESGTargetsForm.jsx (dedicated model)
13. Scope1DataCollection.jsx
14. Scope2DataCollection.jsx
15. GHGInventoryForm.jsx
16. PollutionDataCollection.jsx
17. EmployeeDemographicsForm.jsx
18. DiversityInclusionForm.jsx
19. HealthSafetyForm.jsx
20. TrainingDevelopmentForm.jsx

**Week 5-6: Lower Priority (Forms 21-30)**
21. HumanRightsForm.jsx
22. CommunityEngagementForm.jsx
23. BoardCompositionForm.jsx
24. EthicsAntiCorruptionForm.jsx
25. SBTiTargetForm.jsx (dedicated model, single resource)
26. PCAFAssessmentForm.jsx (dedicated model)
27. CDPDataCollection.jsx
28. ISSBDataCollection.jsx
29. SDGDataCollection.jsx
30. Any additional forms discovered

---

## Success Metrics

- ✅ All 30 forms load data from API
- ✅ All forms support create/update operations
- ✅ All forms have delete functionality (where applicable)
- ✅ All forms have export in 4 formats (CSV, Excel, JSON, PDF)
- ✅ Data persists across browser refreshes
- ✅ Loading and saving states provide good UX
- ✅ Error handling is consistent and user-friendly

---

## Notes

- CSRD form (`CSRDDataCollection.jsx`) is the **reference implementation** - review it for complex patterns
- All hooks are reusable - no need to create new ones for each form
- ExportButton component is standardized - use it consistently
- Follow the established patterns for consistency across the application
- Test thoroughly before moving to next form

**Total: 30 forms to update (CSRD already done = 31 total forms)**
