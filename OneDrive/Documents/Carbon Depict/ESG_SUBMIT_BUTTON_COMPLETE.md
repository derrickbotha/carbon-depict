# ESG Submit Button Data Flow Complete ✅

## Summary

All ESG data entry forms now successfully submit data to the database with no 403 errors.

## What Was Fixed

### 1. Company ID Comparison Logic
**Issue**: The PUT route was using a rigid company ID comparison that failed in many cases.

**Solution**: Updated all routes (GET, POST, PUT, DELETE) in `server/routes/esg-metrics.js` to use flexible company ID resolution:

```javascript
// Get companyId from auth middleware
const companyId = req.companyId || req.user?.companyId

// Check access - flexible comparison
const metricCompanyId = metric.companyId?.toString() || metric.companyId
const userCompanyId = companyId || req.user?.company?._id?.toString() || req.user?.company?.toString()

if (metricCompanyId !== userCompanyId) {
  return res.status(403).json({
    success: false,
    error: 'Access denied'
  })
}
```

### 2. Enhanced Error Logging
Added detailed logging to help debug authorization issues:
```javascript
console.error('Update metric access denied:', {
  metricCompanyId,
  userCompanyId,
  reqCompanyId: companyId
})
```

## Data Flow

```
User fills form
     ↓
Clicks "Submit Data" button
     ↓
handleSubmit() function called
     ↓
validateCompletion() - ensures 100% completion
     ↓
prepare metricData object with:
  - framework
  - pillar  
  - topic
  - metricName
  - value
  - unit
  - dataQuality
  - status: 'published'
  - isDraft: false
  - metadata.formData: complete form data
     ↓
If existingMetricId exists:
     → updateMetric(id, data)
     → API PUT /api/esg/metrics/:id
Else:
     → createMetric(data)
     → API POST /api/esg/metrics
     ↓
Backend validates company ID
     ↓
Saves to MongoDB
     ↓
Success response returned
     ↓
Frontend shows "✓ Submitted" status
     ↓
Redirects to data entry hub or shows success message
```

## All Forms Working

✅ **Environmental Forms**:
- GHG Emissions Inventory
- Energy Management
- Water Management
- Waste Management
- Biodiversity & Land Use
- Materials & Circular Economy

✅ **Social Forms**:
- Employee Demographics
- Health & Safety
- Training & Development
- Diversity & Inclusion

✅ **Governance Forms**:
- Board Composition
- Ethics & Anti-Corruption
- **Risk Management** (was failing, now fixed)

## Submit Button Features

### In Each Form

**Save Progress Button** (Draft):
- Saves as draft with `isDraft: true`
- Keeps `status: 'draft'`
- Can be updated later
- Stores completion percentage

**Submit Data Button** (Publish):
- Requires 100% completion
- Sets `status: 'published'`
- Sets `isDraft: false`
- Stores full form data in metadata
- Shows loading state during submission
- Shows success state after submission
- Redirects on success

### Success Flow

```javascript
setSaveStatus('submitting')  // Show "Submitting..." button
try {
  await updateMetric() or await createMetric()
  setSaveStatus('submitted') // Show "✓ Submitted" 
  alert('Data submitted successfully!')
  setTimeout(() => navigate('/dashboard/esg/data-entry'), 1500)
} catch (error) {
  setSaveStatus('error')
  alert('Error submitting data. Please try again.')
}
```

## Database Storage

### Metric Document Structure

```javascript
{
  _id: ObjectId,
  companyId: ObjectId,
  userId: ObjectId,
  framework: String, // e.g., 'GRI,TCFD,CSRD'
  pillar: String, // 'Environmental', 'Social', 'Governance'
  topic: String, // e.g., 'Risk Management'
  metricName: String,
  reportingPeriod: String, // '2025'
  value: Number,
  unit: String,
  dataQuality: String, // 'measured', 'estimated', 'self-declared'
  status: String, // 'draft' or 'published'
  isDraft: Boolean,
  metadata: {
    formData: Object, // Complete form data
    completionPercentage: Number,
    submittedAt: ISOString
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Status: COMPLETE ✅

- ✅ 403 error fixed in all routes
- ✅ Submit button saves to database
- ✅ Success feedback provided
- ✅ Loading states implemented
- ✅ Error handling robust
- ✅ All 13 ESG forms working
- ✅ Committed and pushed to repository

All ESG data entry forms can now successfully submit data to the database with proper authorization and user feedback.

