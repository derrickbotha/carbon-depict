/**
 * DEFRA 2025 Emission Factors Service
 * Comprehensive emission factors for GHG Protocol calculations
 * Based on UK Government's Department for Environment, Food & Rural Affairs (DEFRA) 2025 factors
 */

class EmissionFactorsService {
  constructor() {
    this.factors = {
      // Scope 1: Direct Emissions
      scope1: {
        // Stationary Combustion - Fuel Types
        stationaryCombustion: {
          'natural-gas': { factor: 0.202, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' },
          'gas-oil': { factor: 0.267, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'diesel': { factor: 0.267, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'fuel-oil': { factor: 0.267, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'coal': { factor: 0.341, unit: 'kg CO2e/kg', source: 'DEFRA 2025' },
          'lpg': { factor: 0.214, unit: 'kg CO2e/kg', source: 'DEFRA 2025' },
          'burning-oil': { factor: 0.267, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'wood-pellets': { factor: 0.025, unit: 'kg CO2e/kg', source: 'DEFRA 2025' },
          'wood-chips': { factor: 0.025, unit: 'kg CO2e/kg', source: 'DEFRA 2025' },
          'biofuel-blend': { factor: 0.0, unit: 'kg CO2e/%', source: 'DEFRA 2025' }
        },
        // Mobile Combustion - Vehicle Types (per litre of fuel)
        mobileCombustion: {
          'petrol-cars': { factor: 2.31, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'diesel-cars': { factor: 2.68, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'hybrid-cars': { factor: 1.50, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'lpg-cars': { factor: 1.51, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'petrol-vans': { factor: 2.31, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'diesel-vans': { factor: 2.68, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'hgv-diesel': { factor: 2.68, unit: 'kg CO2e/litre', source: 'DEFRA 2025' },
          'motorcycles': { factor: 2.31, unit: 'kg CO2e/litre', source: 'DEFRA 2025' }
        },
        // Process Emissions - Industrial Processes (per tonne)
        processEmissions: {
          'cement-production': { factor: 820, unit: 'kg CO2e/tonne', source: 'DEFRA 2025' },
          'lime-production': { factor: 1200, unit: 'kg CO2e/tonne', source: 'DEFRA 2025' },
          'glass-production': { factor: 850, unit: 'kg CO2e/tonne', source: 'DEFRA 2025' },
          'ammonia-production': { factor: 1600, unit: 'kg CO2e/tonne', source: 'DEFRA 2025' },
          'nitric-acid': { factor: 200, unit: 'kg CO2e/tonne', source: 'DEFRA 2025' }
        },
        // Fugitive Emissions - Refrigerants
        fugitiveEmissions: {
          'r404a': { factor: 3922, unit: 'kg CO2e/kg', source: 'DEFRA 2025' },
          'r410a': { factor: 2088, unit: 'kg CO2e/kg', source: 'DEFRA 2025' },
          'r134a': { factor: 1430, unit: 'kg CO2e/kg', source: 'DEFRA 2025' },
          'r407c': { factor: 1774, unit: 'kg CO2e/kg', source: 'DEFRA 2025' },
          'r32': { factor: 675, unit: 'kg CO2e/kg', source: 'DEFRA 2025' },
          'co2-refrigerant': { factor: 1, unit: 'kg CO2e/kg', source: 'DEFRA 2025' }
        }
      },

      // Scope 2: Indirect Emissions
      scope2: {
        // Purchased Electricity
        purchasedElectricity: {
          'grid-electricity-kwh': { factor: 0.212, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' },
          'renewable-tariff': { factor: 0.000, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' },
          'green-certificates': { factor: 0.000, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' },
          'location-based': { factor: 0.212, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' },
          'market-based': { factor: 0.000, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' }
        },
        // Purchased Heat/Steam
        purchasedHeat: {
          'district-heating': { factor: 0.180, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' },
          'purchased-steam': { factor: 0.180, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' },
          'biomass-heating': { factor: 0.025, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' }
        },
        // Purchased Cooling
        purchasedCooling: {
          'district-cooling': { factor: 0.150, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' },
          'chilled-water': { factor: 0.150, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' }
        },
        // Transmission & Distribution Losses
        transmissionLosses: {
          'td-losses-electricity': { factor: 0.212, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' },
          'td-losses-heat': { factor: 0.180, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' }
        }
      },

      // Scope 3: Indirect Emissions (Value Chain)
      scope3: {
        // Purchased Goods & Services (Spend-based factors)
        purchasedGoodsServices: {
          'raw-materials-spend': { factor: 0.0008, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'packaging-materials': { factor: 0.0006, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'professional-services': { factor: 0.0002, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'it-equipment': { factor: 0.002, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'office-supplies': { factor: 0.0005, unit: 'kg CO2e/£', source: 'DEFRA 2025' }
        },
        // Capital Goods
        capitalGoods: {
          'buildings-infrastructure': { factor: 0.0005, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'machinery-equipment': { factor: 0.0008, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'vehicles': { factor: 0.0015, unit: 'kg CO2e/£', source: 'DEFRA 2025' }
        },
        // Fuel & Energy Activities
        fuelEnergy: {
          'upstream-fuel': { factor: 0.0003, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'energy-distribution': { factor: 0.0002, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'energy-transmission': { factor: 0.0001, unit: 'kg CO2e/£', source: 'DEFRA 2025' }
        },
        // Transportation & Distribution
        transportationDistribution: {
          'supplier-deliveries-km': { factor: 0.1, unit: 'kg CO2e/tonne-km', source: 'DEFRA 2025' },
          'inbound-freight': { factor: 0.08, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'courier-services': { factor: 0.07, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'shipping-containers': { factor: 0.05, unit: 'kg CO2e/containers', source: 'DEFRA 2025' }
        },
        // Waste Disposal
        wasteDisposal: {
          'general-waste': { factor: 0.350, unit: 'kg CO2e/tonnes', source: 'DEFRA 2025' },
          'recyclable-waste': { factor: 0.050, unit: 'kg CO2e/tonnes', source: 'DEFRA 2025' },
          'hazardous-waste': { factor: 0.500, unit: 'kg CO2e/tonnes', source: 'DEFRA 2025' },
          'food-waste': { factor: 0.200, unit: 'kg CO2e/tonnes', source: 'DEFRA 2025' }
        },
        // Business Travel
        businessTravel: {
          'air-domestic': { factor: 0.255, unit: 'kg CO2e/km', source: 'DEFRA 2025' },
          'air-short-haul': { factor: 0.255, unit: 'kg CO2e/km', source: 'DEFRA 2025' },
          'air-long-haul': { factor: 0.285, unit: 'kg CO2e/km', source: 'DEFRA 2025' },
          'rail-travel': { factor: 0.041, unit: 'kg CO2e/km', source: 'DEFRA 2025' },
          'hotel-nights': { factor: 0.020, unit: 'kg CO2e/night', source: 'DEFRA 2025' }
        },
        // Employee Commuting
        employeeCommuting: {
          'employee-car': { factor: 0.192, unit: 'kg CO2e/km', source: 'DEFRA 2025' },
          'employee-train': { factor: 0.041, unit: 'kg CO2e/km', source: 'DEFRA 2025' },
          'employee-bus': { factor: 0.089, unit: 'kg CO2e/km', source: 'DEFRA 2025' },
          'employee-cycle': { factor: 0.0, unit: 'kg CO2e/km', source: 'DEFRA 2025' }
        },
        // Upstream Leased Assets
        upstreamLeased: {
          'leased-vehicles': { factor: 0.0015, unit: 'kg CO2e/vehicle', source: 'DEFRA 2025' },
          'leased-buildings': { factor: 0.0005, unit: 'kg CO2e/m²', source: 'DEFRA 2025' }
        },
        // Downstream Transportation
        downstreamTransport: {
          'product-distribution': { factor: 0.0004, unit: 'kg CO2e/tonne-km', source: 'DEFRA 2025' },
          'customer-deliveries': { factor: 0.0004, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'return-logistics': { factor: 0.0004, unit: 'kg CO2e/£', source: 'DEFRA 2025' }
        },
        // Processing of Sold Products
        processing: {
          'intermediate-products': { factor: 0.0008, unit: 'kg CO2e/tonne', source: 'DEFRA 2025' },
          'processing-energy': { factor: 0.212, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' }
        },
        // Use of Sold Products
        useOfProducts: {
          'product-units-sold': { factor: 0.0001, unit: 'kg CO2e/unit', source: 'DEFRA 2025' },
          'avg-product-lifespan': { factor: 0.0001, unit: 'kg CO2e/year', source: 'DEFRA 2025' },
          'annual-energy-use': { factor: 0.212, unit: 'kg CO2e/kWh', source: 'DEFRA 2025' }
        },
        // End-of-Life Treatment
        endOfLife: {
          'products-landfill': { factor: 0.350, unit: 'kg CO2e/tonne', source: 'DEFRA 2025' },
          'products-recycled': { factor: 0.050, unit: 'kg CO2e/tonne', source: 'DEFRA 2025' },
          'products-incinerated': { factor: 0.500, unit: 'kg CO2e/tonne', source: 'DEFRA 2025' }
        },
        // Downstream Leased Assets
        downstreamLeased: {
          'properties-leased-out': { factor: 0.0005, unit: 'kg CO2e/m²', source: 'DEFRA 2025' },
          'equipment-leased-out': { factor: 0.0008, unit: 'kg CO2e/item', source: 'DEFRA 2025' }
        },
        // Franchises
        franchises: {
          'franchise-locations': { factor: 0.0010, unit: 'kg CO2e/location', source: 'DEFRA 2025' },
          'franchise-revenue': { factor: 0.0003, unit: 'kg CO2e/£', source: 'DEFRA 2025' }
        },
        // Investments
        investments: {
          'equity-investments': { factor: 0.0002, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'bond-investments': { factor: 0.0001, unit: 'kg CO2e/£', source: 'DEFRA 2025' },
          'property-investments': { factor: 0.0003, unit: 'kg CO2e/£', source: 'DEFRA 2025' }
        }
      }
    }
  }

  /**
   * Get emission factor for a specific activity
   * @param {string} scope - Scope (scope1, scope2, scope3)
   * @param {string} category - Category within scope
   * @param {string} activity - Specific activity/fuel type
   * @returns {Object|null} Emission factor object or null if not found
   */
  getFactor(scope, category, activity) {
    try {
      return this.factors[scope]?.[category]?.[activity] || null
    } catch (error) {
      console.error('Error getting emission factor:', error)
      return null
    }
  }

  /**
   * Calculate emissions for a single activity
   * @param {string} scope - Scope (scope1, scope2, scope3)
   * @param {string} category - Category within scope
   * @param {string} activity - Specific activity/fuel type
   * @param {number} value - Activity value
   * @param {string} unit - Unit of the value
   * @returns {Object} Calculation result
   */
  calculateEmissions(scope, category, activity, value, unit) {
    const factor = this.getFactor(scope, category, activity)
    
    if (!factor) {
      return {
        success: false,
        error: `No emission factor found for ${scope}/${category}/${activity}`,
        emissions: 0
      }
    }

    // Convert value to number
    const numericValue = parseFloat(value)
    if (isNaN(numericValue) || numericValue < 0) {
      return {
        success: false,
        error: 'Invalid activity value',
        emissions: 0
      }
    }

    // Calculate emissions
    const emissions = numericValue * factor.factor

    return {
      success: true,
      emissions: Math.round(emissions * 1000) / 1000, // Round to 3 decimal places
      factor: factor.factor,
      factorUnit: factor.unit,
      source: factor.source,
      activityValue: numericValue,
      activityUnit: unit,
      scope,
      category,
      activity
    }
  }

  /**
   * Calculate emissions for multiple activities
   * @param {Array} activities - Array of activity objects
   * @returns {Object} Calculation results
   */
  calculateMultipleEmissions(activities) {
    const results = {
      success: true,
      totalEmissions: 0,
      calculations: [],
      errors: []
    }

    activities.forEach((activity, index) => {
      const { scope, category, activityType, value, unit } = activity
      
      const calculation = this.calculateEmissions(scope, category, activityType, value, unit)
      
      if (calculation.success) {
        results.totalEmissions += calculation.emissions
        results.calculations.push(calculation)
      } else {
        results.errors.push({
          index,
          activity: activityType,
          error: calculation.error
        })
      }
    })

    results.totalEmissions = Math.round(results.totalEmissions * 1000) / 1000

    return results
  }

  /**
   * Get all available factors for a scope and category
   * @param {string} scope - Scope (scope1, scope2, scope3)
   * @param {string} category - Category within scope
   * @returns {Object} Available factors
   */
  getAvailableFactors(scope, category) {
    return this.factors[scope]?.[category] || {}
  }

  /**
   * Get all categories for a scope
   * @param {string} scope - Scope (scope1, scope2, scope3)
   * @returns {Array} Available categories
   */
  getCategoriesForScope(scope) {
    return Object.keys(this.factors[scope] || {})
  }

  /**
   * Validate activity data before calculation
   * @param {Object} activity - Activity object
   * @returns {Object} Validation result
   */
  validateActivity(activity) {
    const { scope, category, activityType, value, unit } = activity
    
    if (!scope || !category || !activityType || !value || !unit) {
      return {
        valid: false,
        error: 'Missing required fields: scope, category, activityType, value, unit'
      }
    }

    const numericValue = parseFloat(value)
    if (isNaN(numericValue) || numericValue < 0) {
      return {
        valid: false,
        error: 'Invalid activity value'
      }
    }

    const factor = this.getFactor(scope, category, activityType)
    if (!factor) {
      return {
        valid: false,
        error: `No emission factor available for ${scope}/${category}/${activityType}`
      }
    }

    return {
      valid: true,
      factor
    }
  }
}

module.exports = new EmissionFactorsService()
