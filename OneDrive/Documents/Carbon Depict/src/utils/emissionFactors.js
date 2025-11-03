/**
 * DEFRA 2025 Emission Factors Database
 * UK Government greenhouse gas reporting conversion factors
 * Updated for 2025 with PCAF integration for financed emissions
 * 
 * Source: UK Department for Environment, Food & Rural Affairs
 * All factors in kgCO2e per unit unless specified otherwise
 */

export const DEFRA_2025_FACTORS = {
  // Fuels (Scope 1) - kgCO2e per kWh or liter
  fuels: {
    naturalGas: {
      factor: 0.18316, // kgCO2e per kWh (gross CV)
      unit: 'kWh',
      scope: 1,
      source: 'DEFRA 2025',
      description: 'Natural gas combustion (stationary)',
      uncertainty: 0.02,
    },
    petrol: {
      factor: 2.31441, // kgCO2e per liter
      unit: 'liters',
      scope: 1,
      source: 'DEFRA 2025',
      description: 'Petrol (gasoline) combustion',
      uncertainty: 0.03,
    },
    diesel: {
      factor: 2.68844, // kgCO2e per liter
      unit: 'liters',
      scope: 1,
      source: 'DEFRA 2025',
      description: 'Diesel combustion',
      uncertainty: 0.03,
    },
    lpg: {
      factor: 1.54924, // kgCO2e per liter
      unit: 'liters',
      scope: 1,
      source: 'DEFRA 2025',
      description: 'Liquefied petroleum gas',
      uncertainty: 0.025,
    },
    coalIndustrial: {
      factor: 0.31415, // kgCO2e per kWh
      unit: 'kWh',
      scope: 1,
      source: 'DEFRA 2025',
      description: 'Industrial coal combustion',
      uncertainty: 0.04,
    },
    heatingOil: {
      factor: 2.96157, // kgCO2e per liter
      unit: 'liters',
      scope: 1,
      source: 'DEFRA 2025',
      description: 'Heating oil (kerosene)',
      uncertainty: 0.03,
    },
  },

  // Electricity (Scope 2) - kgCO2e per kWh
  electricity: {
    ukGrid: {
      factor: 0.19338, // kgCO2e per kWh (2025 UK average)
      unit: 'kWh',
      scope: 2,
      source: 'DEFRA 2025',
      description: 'UK electricity grid average',
      uncertainty: 0.015,
      method: 'location-based',
    },
    ukGridTransmissionLoss: {
      factor: 0.01455, // kgCO2e per kWh (transmission & distribution losses)
      unit: 'kWh',
      scope: 3,
      source: 'DEFRA 2025',
      description: 'UK T&D losses',
      uncertainty: 0.02,
    },
    renewable100: {
      factor: 0.0, // kgCO2e per kWh (market-based method)
      unit: 'kWh',
      scope: 2,
      source: 'DEFRA 2025',
      description: '100% renewable tariff with certificates',
      uncertainty: 0.0,
      method: 'market-based',
    },
  },

  // Transportation (Scope 3) - kgCO2e per unit
  transportation: {
    // Air travel - kgCO2e per passenger-km
    airDomesticAverage: {
      factor: 0.25573, // kgCO2e per passenger-km
      unit: 'passenger-km',
      scope: 3,
      category: 6, // Business travel
      source: 'DEFRA 2025',
      description: 'Domestic flight, average passenger',
      uncertainty: 0.10,
    },
    airShortHaulInternational: {
      factor: 0.15573, // kgCO2e per passenger-km (< 3700 km)
      unit: 'passenger-km',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'Short-haul international flight',
      uncertainty: 0.12,
    },
    airLongHaulInternational: {
      factor: 0.19338, // kgCO2e per passenger-km (> 3700 km)
      unit: 'passenger-km',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'Long-haul international flight',
      uncertainty: 0.15,
    },

    // Road transport - kgCO2e per km or passenger-km
    carPetrolMedium: {
      factor: 0.17254, // kgCO2e per km
      unit: 'km',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'Medium petrol car',
      uncertainty: 0.08,
    },
    carDieselMedium: {
      factor: 0.16942, // kgCO2e per km
      unit: 'km',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'Medium diesel car',
      uncertainty: 0.08,
    },
    carHybrid: {
      factor: 0.10942, // kgCO2e per km
      unit: 'km',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'Hybrid car (petrol/electric)',
      uncertainty: 0.10,
    },
    carElectric: {
      factor: 0.05338, // kgCO2e per km (based on UK grid)
      unit: 'km',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'Battery electric vehicle (BEV)',
      uncertainty: 0.12,
    },
    taxi: {
      factor: 0.20119, // kgCO2e per km
      unit: 'km',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'Regular taxi',
      uncertainty: 0.09,
    },

    // Rail - kgCO2e per passenger-km
    railNational: {
      factor: 0.03694, // kgCO2e per passenger-km
      unit: 'passenger-km',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'National rail (UK)',
      uncertainty: 0.06,
    },
    railInternational: {
      factor: 0.00415, // kgCO2e per passenger-km
      unit: 'passenger-km',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'International rail (Eurostar)',
      uncertainty: 0.08,
    },
    railLondonUnderground: {
      factor: 0.03088, // kgCO2e per passenger-km
      unit: 'passenger-km',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'London Underground',
      uncertainty: 0.05,
    },
  },

  // Accommodation (Scope 3 Category 6) - kgCO2e per night
  accommodation: {
    hotelAverage: {
      factor: 23.8, // kgCO2e per room-night
      unit: 'room-nights',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'UK hotel, average',
      uncertainty: 0.20,
    },
    hotelLuxury: {
      factor: 42.5, // kgCO2e per room-night
      unit: 'room-nights',
      scope: 3,
      category: 6,
      source: 'DEFRA 2025',
      description: 'UK hotel, luxury/5-star',
      uncertainty: 0.25,
    },
  },

  // Materials & Goods (Scope 3) - kgCO2e per kg or per £ spend
  materials: {
    // Construction materials - kgCO2e per kg
    steel: {
      factor: 2.21, // kgCO2e per kg
      unit: 'kg',
      scope: 3,
      category: 1, // Purchased goods
      source: 'DEFRA 2025',
      description: 'Steel production',
      uncertainty: 0.15,
    },
    concrete: {
      factor: 0.144, // kgCO2e per kg
      unit: 'kg',
      scope: 3,
      category: 1,
      source: 'DEFRA 2025',
      description: 'Concrete/cement',
      uncertainty: 0.12,
    },
    aluminum: {
      factor: 8.16, // kgCO2e per kg
      unit: 'kg',
      scope: 3,
      category: 1,
      source: 'DEFRA 2025',
      description: 'Primary aluminum',
      uncertainty: 0.18,
    },
    plastic: {
      factor: 3.42, // kgCO2e per kg
      unit: 'kg',
      scope: 3,
      category: 1,
      source: 'DEFRA 2025',
      description: 'Average plastics',
      uncertainty: 0.20,
    },
    paper: {
      factor: 0.91, // kgCO2e per kg
      unit: 'kg',
      scope: 3,
      category: 1,
      source: 'DEFRA 2025',
      description: 'Paper/cardboard',
      uncertainty: 0.15,
    },

    // Spend-based (for PCAF) - kgCO2e per £
    purchasedGoodsSpend: {
      factor: 0.42, // kgCO2e per £ (UK average for goods)
      unit: 'GBP',
      scope: 3,
      category: 1,
      source: 'DEFRA 2025',
      description: 'Purchased goods (spend-based)',
      uncertainty: 0.30,
      pcafDataQuality: 4, // Region/sector average
    },
    purchasedServicesSpend: {
      factor: 0.28, // kgCO2e per £ (UK average for services)
      unit: 'GBP',
      scope: 3,
      category: 1,
      source: 'DEFRA 2025',
      description: 'Purchased services (spend-based)',
      uncertainty: 0.35,
      pcafDataQuality: 4,
    },
  },

  // Waste (Scope 3) - kgCO2e per tonne
  waste: {
    landfill: {
      factor: 467.0, // kgCO2e per tonne
      unit: 'tonnes',
      scope: 3,
      category: 5,
      source: 'DEFRA 2025',
      description: 'Landfill waste disposal',
      uncertainty: 0.25,
    },
    recycling: {
      factor: 21.3, // kgCO2e per tonne
      unit: 'tonnes',
      scope: 3,
      category: 5,
      source: 'DEFRA 2025',
      description: 'Mixed recycling',
      uncertainty: 0.20,
    },
    incineration: {
      factor: 21.5, // kgCO2e per tonne
      unit: 'tonnes',
      scope: 3,
      category: 5,
      source: 'DEFRA 2025',
      description: 'Waste incineration (energy recovery)',
      uncertainty: 0.18,
    },
    compost: {
      factor: 8.8, // kgCO2e per tonne
      unit: 'tonnes',
      scope: 3,
      category: 5,
      source: 'DEFRA 2025',
      description: 'Composting',
      uncertainty: 0.15,
    },
  },

  // Water (Scope 3) - kgCO2e per m³
  water: {
    supply: {
      factor: 0.344, // kgCO2e per m³
      unit: 'm3',
      scope: 3,
      category: 1,
      source: 'DEFRA 2025',
      description: 'Water supply',
      uncertainty: 0.10,
    },
    treatment: {
      factor: 0.708, // kgCO2e per m³
      unit: 'm3',
      scope: 3,
      category: 5,
      source: 'DEFRA 2025',
      description: 'Wastewater treatment',
      uncertainty: 0.12,
    },
  },

  // PCAF-specific factors for financial institutions
  pcafFinancedEmissions: {
    // Sector-based emission intensities (tCO2e per $M revenue)
    electricUtilities: {
      factor: 2847.5, // tCO2e per $M revenue
      unit: 'USD_million_revenue',
      scope: 3,
      category: 15, // Investments
      source: 'PCAF Database 2025',
      description: 'Electric utilities sector average',
      uncertainty: 0.35,
      pcafDataQuality: 4,
      sector: 'Utilities',
    },
    oilGas: {
      factor: 1523.8, // tCO2e per $M revenue
      unit: 'USD_million_revenue',
      scope: 3,
      category: 15,
      source: 'PCAF Database 2025',
      description: 'Oil & gas sector average',
      uncertainty: 0.30,
      pcafDataQuality: 4,
      sector: 'Energy',
    },
    manufacturing: {
      factor: 456.2, // tCO2e per $M revenue
      unit: 'USD_million_revenue',
      scope: 3,
      category: 15,
      source: 'PCAF Database 2025',
      description: 'Manufacturing sector average',
      uncertainty: 0.40,
      pcafDataQuality: 4,
      sector: 'Industrials',
    },
    technology: {
      factor: 127.5, // tCO2e per $M revenue
      unit: 'USD_million_revenue',
      scope: 3,
      category: 15,
      source: 'PCAF Database 2025',
      description: 'Technology sector average',
      uncertainty: 0.35,
      pcafDataQuality: 4,
      sector: 'Technology',
    },
    financialServices: {
      factor: 89.3, // tCO2e per $M revenue
      unit: 'USD_million_revenue',
      scope: 3,
      category: 15,
      source: 'PCAF Database 2025',
      description: 'Financial services sector average',
      uncertainty: 0.45,
      pcafDataQuality: 4,
      sector: 'Financials',
    },
    realEstate: {
      factor: 234.7, // tCO2e per $M revenue
      unit: 'USD_million_revenue',
      scope: 3,
      category: 15,
      source: 'PCAF Database 2025',
      description: 'Real estate sector average',
      uncertainty: 0.38,
      pcafDataQuality: 4,
      sector: 'Real Estate',
    },
    retail: {
      factor: 312.4, // tCO2e per $M revenue
      unit: 'USD_million_revenue',
      scope: 3,
      category: 15,
      source: 'PCAF Database 2025',
      description: 'Retail sector average',
      uncertainty: 0.36,
      pcafDataQuality: 4,
      sector: 'Consumer',
    },

    // Building emission intensities (kgCO2e per m² per year)
    officeBuilding: {
      factor: 85.4, // kgCO2e per m² per year
      unit: 'm2_year',
      scope: 3,
      category: 15,
      source: 'CIBSE TM46 / DEFRA 2025',
      description: 'Office building energy use',
      uncertainty: 0.25,
      pcafDataQuality: 3,
    },
    retailBuilding: {
      factor: 142.7, // kgCO2e per m² per year
      unit: 'm2_year',
      scope: 3,
      category: 15,
      source: 'CIBSE TM46 / DEFRA 2025',
      description: 'Retail building energy use',
      uncertainty: 0.28,
      pcafDataQuality: 3,
    },
    warehouse: {
      factor: 34.2, // kgCO2e per m² per year
      unit: 'm2_year',
      scope: 3,
      category: 15,
      source: 'CIBSE TM46 / DEFRA 2025',
      description: 'Warehouse/storage energy use',
      uncertainty: 0.22,
      pcafDataQuality: 3,
    },
  },
};

/**
 * Get emission factor by key
 * @param {string} category - Category (fuels, electricity, transportation, etc.)
 * @param {string} type - Specific type within category
 * @returns {object|null} Emission factor object or null if not found
 */
export function getEmissionFactor(category, type) {
  if (DEFRA_2025_FACTORS[category] && DEFRA_2025_FACTORS[category][type]) {
    return DEFRA_2025_FACTORS[category][type];
  }
  return null;
}

/**
 * Get all emission factors for a category
 * @param {string} category - Category name
 * @returns {object} All factors in category
 */
export function getEmissionFactorsByCategory(category) {
  return DEFRA_2025_FACTORS[category] || {};
}

/**
 * Get PCAF data quality score based on data source
 * @param {string} dataSource - Type of data used
 * @returns {number} PCAF data quality score (1-5)
 */
export function getPCAFDataQualityScore(dataSource) {
  const qualityScores = {
    'reported': 1, // Verified reported emissions
    'physical-activity': 2, // Primary data with emission factors
    'economic-activity': 3, // Economic data with emission factors
    'sector-average': 4, // Region/sector averages
    'proxy': 5, // Global proxy data
  };
  return qualityScores[dataSource] || 5;
}

export default DEFRA_2025_FACTORS;
