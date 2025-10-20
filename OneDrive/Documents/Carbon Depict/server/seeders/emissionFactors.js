const EmissionFactor = require('../models/mongodb/EmissionFactor')

/**
 * Seed DEFRA 2025 Emission Factors
 * Source: UK Government GHG Conversion Factors 2025
 */
const defraFactors = [
  // FUELS - Liquid
  {
    category: 'fuels',
    subcategory: 'diesel',
    name: 'Diesel (average biofuel blend)',
    description: 'Diesel fuel for road vehicles and machinery',
    factor: 2.546,
    unit: 'kgCO2e/litre',
    scope: 'Scope 1',
    breakdown: { co2: 2.467, ch4: 0.001, n2o: 0.078 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    tags: ['fuel', 'diesel', 'liquid'],
  },
  {
    category: 'fuels',
    subcategory: 'petrol',
    name: 'Petrol (average biofuel blend)',
    description: 'Petrol/gasoline for road vehicles',
    factor: 2.315,
    unit: 'kgCO2e/litre',
    scope: 'Scope 1',
    breakdown: { co2: 2.257, ch4: 0.006, n2o: 0.052 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    tags: ['fuel', 'petrol', 'gasoline', 'liquid'],
  },
  
  // FUELS - Gaseous
  {
    category: 'fuels',
    subcategory: 'natural-gas',
    name: 'Natural Gas',
    description: 'Natural gas for heating and industrial use',
    factor: 0.185,
    unit: 'kgCO2e/kWh',
    scope: 'Scope 1',
    breakdown: { co2: 0.184, ch4: 0.001, n2o: 0.0001 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    tags: ['fuel', 'gas', 'natural-gas'],
  },

  // ELECTRICITY
  {
    category: 'electricity',
    subcategory: 'uk-grid',
    name: 'UK Grid Electricity',
    description: 'Grid electricity consumed in the UK',
    factor: 0.20898,
    unit: 'kgCO2e/kWh',
    scope: 'Scope 2',
    breakdown: { co2: 0.20798, ch4: 0.0005, n2o: 0.0005 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    tags: ['electricity', 'grid', 'power'],
  },
  {
    category: 'electricity',
    subcategory: 'renewable',
    name: 'Renewable Electricity',
    description: 'Renewable energy (solar, wind, hydro)',
    factor: 0.0,
    unit: 'kgCO2e/kWh',
    scope: 'Scope 2',
    breakdown: { co2: 0, ch4: 0, n2o: 0 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    tags: ['electricity', 'renewable', 'green'],
  },

  // PASSENGER TRANSPORT - Cars
  {
    category: 'passenger-transport',
    subcategory: 'car-small-petrol',
    name: 'Car (Small, Petrol)',
    description: 'Small petrol car, average occupancy',
    factor: 0.118,
    unit: 'kgCO2e/km',
    scope: 'Scope 3',
    breakdown: { co2: 0.115, ch4: 0.001, n2o: 0.002 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    metadata: { vehicleSize: 'small', fuelType: 'petrol' },
    tags: ['transport', 'car', 'petrol', 'small'],
  },
  {
    category: 'passenger-transport',
    subcategory: 'car-medium-diesel',
    name: 'Car (Medium, Diesel)',
    description: 'Medium diesel car, average occupancy',
    factor: 0.145,
    unit: 'kgCO2e/km',
    scope: 'Scope 3',
    breakdown: { co2: 0.141, ch4: 0.001, n2o: 0.003 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    metadata: { vehicleSize: 'medium', fuelType: 'diesel' },
    tags: ['transport', 'car', 'diesel', 'medium'],
  },

  // PASSENGER TRANSPORT - Vans
  {
    category: 'passenger-transport',
    subcategory: 'van-class-1',
    name: 'Van (Class I, up to 1.305 tonnes)',
    description: 'Light commercial vehicle, Class I',
    factor: 0.12,
    unit: 'kgCO2e/km',
    scope: 'Scope 3',
    breakdown: { co2: 0.117, ch4: 0.001, n2o: 0.002 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    metadata: { vehicleType: 'van', weightClass: 'I', maxWeight: 1.305 },
    tags: ['transport', 'van', 'commercial', 'class-1'],
  },
  {
    category: 'passenger-transport',
    subcategory: 'van-class-2',
    name: 'Van (Class II, 1.305-1.74 tonnes)',
    description: 'Light commercial vehicle, Class II',
    factor: 0.15,
    unit: 'kgCO2e/km',
    scope: 'Scope 3',
    breakdown: { co2: 0.146, ch4: 0.001, n2o: 0.003 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    metadata: { vehicleType: 'van', weightClass: 'II', maxWeight: 1.74 },
    tags: ['transport', 'van', 'commercial', 'class-2'],
  },

  // REFRIGERANTS
  {
    category: 'refrigerants',
    subcategory: 'r134a',
    name: 'R134a (HFC)',
    description: 'Common refrigerant in fridges and AC units',
    factor: 1430,
    unit: 'kgCO2e/kg',
    scope: 'Scope 1',
    breakdown: { hfc: 1430 },
    source: 'DEFRA 2025',
    gwpVersion: 'AR5',
    region: 'Global',
    version: '2025',
    metadata: { gasType: 'HFC', gwp100: 1430 },
    tags: ['refrigerant', 'hfc', 'r134a'],
  },
  {
    category: 'refrigerants',
    subcategory: 'r404a',
    name: 'R404A (HFC Blend)',
    description: 'Common refrigerant blend for commercial refrigeration',
    factor: 3922,
    unit: 'kgCO2e/kg',
    scope: 'Scope 1',
    breakdown: { hfc: 3922 },
    source: 'DEFRA 2025',
    gwpVersion: 'AR5',
    region: 'Global',
    version: '2025',
    metadata: { gasType: 'HFC', gwp100: 3922 },
    tags: ['refrigerant', 'hfc', 'r404a', 'blend'],
  },

  // WATER
  {
    category: 'water',
    subcategory: 'supply',
    name: 'Water Supply',
    description: 'Potable water supply',
    factor: 0.149,
    unit: 'kgCO2e/m³',
    scope: 'Scope 3',
    breakdown: { co2: 0.148, ch4: 0.0005, n2o: 0.0005 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    tags: ['water', 'supply'],
  },
  {
    category: 'water',
    subcategory: 'treatment',
    name: 'Water Treatment',
    description: 'Wastewater treatment',
    factor: 0.272,
    unit: 'kgCO2e/m³',
    scope: 'Scope 3',
    breakdown: { co2: 0.27, ch4: 0.001, n2o: 0.001 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    tags: ['water', 'treatment', 'wastewater'],
  },

  // WASTE
  {
    category: 'waste',
    subcategory: 'landfill',
    name: 'Waste to Landfill',
    description: 'General waste sent to landfill',
    factor: 500,
    unit: 'kgCO2e/tonne',
    scope: 'Scope 3',
    breakdown: { co2: 420, ch4: 75, n2o: 5 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    tags: ['waste', 'landfill'],
  },
  {
    category: 'waste',
    subcategory: 'recycling',
    name: 'Recycled Waste',
    description: 'Waste sent for recycling',
    factor: 21,
    unit: 'kgCO2e/tonne',
    scope: 'Scope 3',
    breakdown: { co2: 20, ch4: 0.5, n2o: 0.5 },
    source: 'DEFRA 2025',
    region: 'UK',
    version: '2025',
    tags: ['waste', 'recycling'],
  },
]

/**
 * Seed emission factors to MongoDB
 */
const seedEmissionFactors = async () => {
  try {
    // Clear existing factors (development only)
    if (process.env.NODE_ENV === 'development') {
      await EmissionFactor.deleteMany({})
      console.log('🧹 Cleared existing emission factors')
    }

    // Insert factors
    const inserted = await EmissionFactor.insertMany(defraFactors)
    console.log(`✅ Seeded ${inserted.length} emission factors`)

    return inserted
  } catch (error) {
    console.error('❌ Error seeding emission factors:', error.message)
    throw error
  }
}

module.exports = { seedEmissionFactors, defraFactors }
