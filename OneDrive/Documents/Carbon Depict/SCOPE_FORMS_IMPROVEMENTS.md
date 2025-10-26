# Scope 1, 2, 3 Data Collection Forms - Improvement Plan

## Overview
Update the three scope data collection forms to reflect improvements in the emissions calculator and align with GHG Protocol requirements.

## Scope 1 Form Improvements Needed

### Mobile Combustion Section - CRITICAL FIX

**Current Issue**: Form only collects fuel in litres, but updated calculator requires EITHER:
- `fuelUsed` (litres) directly, OR  
- `distance` (km) AND `fuelConsumption` (L/km)

**Improvement**: Add fields for distance and fuel consumption per vehicle type:

```jsx
// Mobile Combustion (8 vehicle types) - IMPROVED
mobileCombustion: {
  'petrol-cars': { 
    name: 'Petrol Cars', 
    fuelUsed: { name: 'Fuel Used (litres)', value: '', unit: 'litres', completed: false },
    distance: { name: 'Distance Traveled (km)', value: '', unit: 'km', completed: false },
    fuelConsumption: { name: 'Fuel Consumption (L/km)', value: '', unit: 'L/km', completed: false },
    // ... metadata fields
  },
  // ... repeat for diesel-cars, hybrid-cars, etc.
}
```

### Stationary Combustion
**Status**: ✅ Already good - includes biofuel blend field
- Need to ensure biofuel blend is passed to calculator

### Fugitive Emissions (Refrigerants)
**Status**: ✅ Already good - collects kg values
- Need to normalize refrigerant names to match calculator (r404a → r-404a)

### Process Emissions
**Status**: ✅ Already good - collects tonnes values

## Scope 2 Form Improvements Needed

### Purchased Electricity - CRITICAL UPDATE FOR GHG PROTOCOL

**Current Issue**: Form doesn't properly handle market-based vs location-based methodology

**Improvement**: Update form structure to support dual reporting:

```jsx
// Purchased Electricity - IMPROVED
purchasedElectricity: {
  consumption: { name: 'Total Consumption (kWh)', value: '', unit: 'kWh', completed: false },
  region: { name: 'Region', value: 'uk', unit: 'select', completed: false },
  method: { name: 'Calculation Method', value: 'location', unit: 'select', options: ['location', 'market'], completed: false },
  supplierCertificate: {
    valid: { name: 'Certificate Valid?', value: '', unit: 'boolean', completed: false },
    retired: { name: 'Certificate Retired?', value: '', unit: 'boolean', completed: false },
    factor: { name: 'Certificate Factor', value: '', unit: 'kgCO2e/kWh', completed: false },
    source: { name: 'Certificate Source', value: '', unit: 'text', completed: false },
  }
}
```

**Additional Fields Needed**:
- Region selector (UK, EU, US, China, India, Global)
- Method selector (Location-based / Market-based)
- Supplier certificate details section
- Renewable energy attribute details

### Purchased Heat/Cooling
**Status**: ✅ Already good
- May need to add similar certificate handling for heat/cooling

## Scope 3 Form Improvements Needed

### Transportation & Distribution
**Status**: ✅ Already good - collects tonne-km and £ values

**Enhancement**: Add vehicle type specifications:
- Transportation mode (road, rail, sea, air)
- Fuel type (if known)
- Distance ranges

### Business Travel
**Status**: ✅ Already good - collects km for air/rail/hotel

**Enhancement**: Add travel class for air travel:
- Domestic (economy/business)
- Short haul (economy/business/premium)
- Long haul (economy/business/premium/first)

### Employee Commuting
**Current Issue**: Need to collect distance for each mode

**Improvement**: Current structure is good, but ensure data collection matches calculator requirements:
- Vehicle type selection
- Distance in km
- Number of commuters (if per-person basis)

### Purchased Goods & Services
**Status**: ✅ Already good - collects £ values
- May need to add supplier spend categories

## Implementation Priority

### Critical (Must Have):
1. ✅ Fix mobile combustion to support dual input methods
2. ✅ Update Scope 2 electricity to support market vs location methodology  
3. ✅ Add supplier certificate fields for renewable energy claims

### High Priority:
4. Add refrigerant name normalization
5. Add region selector for electricity
6. Add calculation method selector (location/market)
7. Add vehicle type specifications for Scope 3 transport

### Medium Priority:
8. Add travel class details for air travel
9. Add supplier detail fields for goods/services
10. Add data quality indicators to form fields

## Code Changes Required

### 1. Scope1DataCollection.jsx
```javascript
// Update mobileCombustion fields to support both input methods
mobileCombustion: {
  'diesel-cars': {
    fuelUsed: { name: 'Fuel Used (litres)', value: '', unit: 'litres', completed: false },
    // OR
    distance: { name: 'Distance (km)', value: '', unit: 'km', completed: false },
    fuelConsumption: { name: 'Fuel Consumption (L/km)', value: '', unit: 'L/km', completed: false },
  }
}
```

### 2. Scope2DataCollection.jsx  
```javascript
// Update to support market vs location methodology
purchasedElectricity: {
  consumption: { ... },
  region: { value: 'uk', options: ['uk', 'eu', 'us', 'china', 'india', 'global'] },
  method: { value: 'location', options: ['location', 'market'] },
  supplierCertificate: { ... }
}
```

### 3. Scope3DataCollection.jsx
```javascript
// Add travel class for air travel
businessTravel: {
  'air-domestic-economy': { ... },
  'air-domestic-business': { ... },
  'air-short-haul-economy': { ... },
  // ... etc
}
```

## Backend Integration

### Update Emissions Calculation Service
The `server/services/emissionsCalculator.js` already supports:
- ✅ Mobile combustion with dual input methods
- ✅ Scope 2 market vs location  
- ✅ Refrigerant name normalization
- ✅ Biofuel blend percentages

### Update API Routes
`server/routes/emissions.js` needs to:
- Handle mobile combustion with both fuelUsed OR (distance + fuelConsumption)
- Handle Scope 2 with market/location method
- Pass supplier certificate data to calculator

## Testing Requirements

### Scope 1 Tests:
1. Test mobile combustion with fuelUsed only
2. Test mobile combustion with distance + fuelConsumption
3. Test error when neither provided
4. Test biofuel blend adjustment
5. Test refrigerant name normalization

### Scope 2 Tests:
1. Test location-based calculation
2. Test market-based with valid certificate
3. Test market-based without certificate (should use residual mix)
4. Test different regions
5. Test validation of certificate data

### Scope 3 Tests:
1. Test all transport modes
2. Test air travel with different classes
3. Test waste conversion (kg → tonnes)
4. Test £ to emissions conversion

## Data Flow Updates

### Form → API → Calculator Flow:
```
Form Input → handleCalculateEmissions() → API.calculateAndSave() → 
emissions.js (bulk-save route) → EmissionFactorsService.getEmissionFactor() → 
EmissionsCalculator.calculate*() → Save to DB → Return results to form
```

### Metadata Flow:
```
Calculation Result includes:
- emissionFactor
- emissionFactorUnit
- emissionFactorSource
- emissionFactorYear
- dataQuality
- provenance
- method (for Scope 2)
- gwp (for refrigerants)
```

## Next Steps

1. ✅ Update emissionsCalculator.js (DONE)
2. 📝 Update Scope 1 form mobile combustion section
3. 📝 Update Scope 2 form electricity section
4. 📝 Update Scope 3 form air travel section
5. 📝 Update backend routes to handle new fields
6. 🧪 Test all calculation paths
7. 📊 Update dashboard to show metadata
8. 📝 Document new fields in user guides

## Files to Modify

### Frontend:
- `src/pages/dashboard/Scope1DataCollection.jsx`
- `src/pages/dashboard/Scope2DataCollection.jsx`
- `src/pages/dashboard/Scope3DataCollection.jsx`

### Backend:
- `server/routes/emissions.js` (if needed for new fields)
- `server/services/emissionFactorsService.js` (may need updates)

## Status Summary

| Component | Status | Priority |
|-----------|--------|----------|
| Mobile combustion dual input | ❌ Needs update | Critical |
| Scope 2 market/location | ❌ Needs update | Critical |
| Refrigerant normalization | ✅ Calculator ready | High |
| Air travel classes | ❌ Needs update | High |
| Biofuel blend support | ✅ Ready | Medium |
| Metadata display | ❌ Needs update | Medium |

## Estimated Effort
- Scope 1 updates: 2-3 hours
- Scope 2 updates: 2-3 hours  
- Scope 3 updates: 1-2 hours
- Testing: 2-3 hours
- Documentation: 1 hour

**Total**: ~8-11 hours

