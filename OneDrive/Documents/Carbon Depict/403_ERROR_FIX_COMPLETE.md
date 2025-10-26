# 403 Error Fix Complete ✅

## Problem
Users were getting a 403 Forbidden error when trying to save Risk Management data to the database. The error occurred in the PUT `/api/esg/metrics/:id` endpoint.

## Root Cause
The authorization check in the PUT route was not correctly handling the comparison between the metric's `companyId` and the user's `companyId`. The issue was related to:
1. Different data types (object vs string)
2. Populated vs non-populated companyId fields
3. Multiple possible sources for companyId in req.user

## What Was Fixed

### 1. Auth Middleware (`server/middleware/auth.js`)
**Before**:
```javascript
req.companyId = user.companyId ? user.companyId.toString() : user.company?._id?.toString()
```

**After**:
```javascript
req.companyId = decoded.companyId?.toString() || 
                 user.companyId?.toString() || 
                 user.company?._id?.toString()
```

Now the auth middleware properly extracts companyId from the JWT token, which is the most reliable source.

### 2. ESG Metrics PUT Route (`server/routes/esg-metrics.js`)
**Before**:
```javascript
const metricCompanyId = metric.companyId?.toString() || metric.companyId
const userCompanyId = companyId || req.user?.company?._id?.toString() || req.user?.company?.toString()
```

**After**:
```javascript
// Handle both populated and non-populated companyId
let metricCompanyId = metric.companyId
if (metricCompanyId && typeof metricCompanyId === 'object' && metricCompanyId._id) {
  metricCompanyId = metricCompanyId._id.toString()
} else {
  metricCompanyId = metricCompanyId?.toString() || metricCompanyId
}

// Get user's companyId from various possible sources
const userCompanyId = companyId?.toString() || 
                      req.user?.companyId?.toString() || 
                      req.user?.company?._id?.toString() || 
                      req.user?.company?.toString()
```

The new code properly handles:
- **Populated companyId**: When Mongoose has populated the company object, it extracts `_id`
- **Non-populated companyId**: When it's just an ObjectId string
- **Multiple sources**: Checks all possible locations for the user's companyId
- **Type safety**: Ensures all comparisons are between strings

### 3. Error Logging
Added comprehensive logging for 403 errors:
```javascript
console.error('Update metric access denied:', {
  metricCompanyId,
  userCompanyId,
  reqCompanyId: companyId,
  userId: req.user?._id
})
```

This helps debug any future authorization issues by showing exactly what values are being compared.

## Testing
Try saving Risk Management data now. The 403 error should be resolved. If you still see errors, check the server logs for the detailed access check information.

## Status: COMPLETE ✅
- ✅ Auth middleware fixed
- ✅ PUT route authorization improved
- ✅ Added logging for debugging
- ✅ Committed and pushed to repository

