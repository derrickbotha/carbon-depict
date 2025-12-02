/**
 * GHG Emissions Calculation Service
 * Implements GHG Protocol calculation methodologies
 */

const EmissionFactor = require('../models/mongodb/EmissionFactor')
const GHGEmission = require('../models/mongodb/GHGEmission')

/**
 * Emission factors (DEFRA 2025 / GHG Protocol)
 * These should eventually come from the EmissionFactor collection
 */
const DEFAULT_FACTORS = {
  // Scope 1: Direct emissions
  fuels: {
    diesel: { factor: 2.546, unit: 'kgCO2e/litre', scope: 'scope1' },
    petrol: { factor: 2.315, unit: 'kgCO2e/litre', scope: 'scope1' },
    'natural-gas': { factor: 0.185, unit: 'kgCO2e/kWh', scope: 'scope1' },
    lpg: { factor: 1.512, unit: 'kgCO2e/litre', scope: 'scope1' },
    coal: { factor: 0.323, unit: 'kgCO2e/kWh', scope: 'scope1' },
    'heating-oil': { factor: 2.778, unit: 'kgCO2e/litre', scope: 'scope1' },
  },
  
  // Scope 1: Refrigerants (GWP values)
  refrigerants: {
    'r-134a': { factor: 1430, unit: 'kgCO2e/kg', scope: 'scope1' },
    'r-404a': { factor: 3922, unit: 'kgCO2e/kg', scope: 'scope1' },
    'r-410a': { factor: 2088, unit: 'kgCO2e/kg', scope: 'scope1' },
    'r-32': { factor: 675, unit: 'kgCO2e/kg', scope: 'scope1' },
  },
  
  // Scope 2: Electricity by region (kgCO2e/kWh)
  electricity: {
    uk: { factor: 0.20898, unit: 'kgCO2e/kWh', scope: 'scope2' },
    'uk-renewable': { factor: 0, unit: 'kgCO2e/kWh', scope: 'scope2' },
    eu: { factor: 0.275, unit: 'kgCO2e/kWh', scope: 'scope2' },
    us: { factor: 0.386, unit: 'kgCO2e/kWh', scope: 'scope2' },
    china: { factor: 0.555, unit: 'kgCO2e/kWh', scope: 'scope2' },
    india: { factor: 0.708, unit: 'kgCO2e/kWh', scope: 'scope2' },
    global: { factor: 0.475, unit: 'kgCO2e/kWh', scope: 'scope2' },
  },
  
  // Scope 3: Transport
  transport: {
    'car-small-petrol': { factor: 0.14235, unit: 'kgCO2e/km', scope: 'scope3' },
    'car-medium-petrol': { factor: 0.18694, unit: 'kgCO2e/km', scope: 'scope3' },
    'car-large-petrol': { factor: 0.28143, unit: 'kgCO2e/km', scope: 'scope3' },
    'car-small-diesel': { factor: 0.12039, unit: 'kgCO2e/km', scope: 'scope3' },
    'car-medium-diesel': { factor: 0.14738, unit: 'kgCO2e/km', scope: 'scope3' },
    'car-large-diesel': { factor: 0.21167, unit: 'kgCO2e/km', scope: 'scope3' },
    'car-electric': { factor: 0.05331, unit: 'kgCO2e/km', scope: 'scope3' },
    'van-class-1': { factor: 0.12686, unit: 'kgCO2e/km', scope: 'scope3' },
    'van-class-2': { factor: 0.17289, unit: 'kgCO2e/km', scope: 'scope3' },
    'van-class-3': { factor: 0.25933, unit: 'kgCO2e/km', scope: 'scope3' },
    'motorcycle-small': { factor: 0.08449, unit: 'kgCO2e/km', scope: 'scope3' },
    'motorcycle-medium': { factor: 0.10127, unit: 'kgCO2e/km', scope: 'scope3' },
    'motorcycle-large': { factor: 0.13337, unit: 'kgCO2e/km', scope: 'scope3' },
    'bus': { factor: 0.10312, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
    'rail-national': { factor: 0.03549, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
    'rail-international': { factor: 0.00331, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
    'taxi': { factor: 0.15075, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
  },
  
  // Scope 3: Air travel
  airTravel: {
    'domestic-economy': { factor: 0.24587, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
    'domestic-business': { factor: 0.36881, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
    'short-haul-economy': { factor: 0.15573, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
    'short-haul-business': { factor: 0.23359, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
    'long-haul-economy': { factor: 0.14808, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
    'long-haul-premium': { factor: 0.42765, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
    'long-haul-business': { factor: 0.59210, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
    'long-haul-first': { factor: 0.88815, unit: 'kgCO2e/passenger-km', scope: 'scope3' },
  },
  
  // Scope 3: Hotel stays
  accommodation: {
    'hotel-room-night': { factor: 10.5, unit: 'kgCO2e/night', scope: 'scope3' },
  },
  
  // Scope 3: Waste
  waste: {
    'landfill': { factor: 467, unit: 'kgCO2e/tonne', scope: 'scope3' },
    'incineration': { factor: 21, unit: 'kgCO2e/tonne', scope: 'scope3' },
    'recycling': { factor: 21, unit: 'kgCO2e/tonne', scope: 'scope3' },
    'composting': { factor: 8.3, unit: 'kgCO2e/tonne', scope: 'scope3' },
  },
  
  // Scope 3: Water
  water: {
    'supply': { factor: 0.344, unit: 'kgCO2e/m³', scope: 'scope3' },
    'treatment': { factor: 0.708, unit: 'kgCO2e/m³', scope: 'scope3' },
  },
}

class EmissionsCalculator {
  /**
   * Calculate emissions for stationary combustion (Scope 1)
   */
  static calculateStationaryCombustion({ fuelType, quantity, biofuelBlend = 0 }) {
    const fuelData = DEFAULT_FACTORS.fuels[fuelType]
    if (!fuelData) {
      throw new Error(`Unknown fuel type: ${fuelType}`)
    }
    
    // Adjust for biofuel blend percentage
    const adjustedFactor = fuelData.factor * (1 - biofuelBlend / 100)
    const emissions = quantity * adjustedFactor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope1',
      sourceType: 'stationary_combustion',
      activityType: fuelType,
      activityValue: quantity,
      activityUnit: fuelData.unit.split('/')[1],
      emissionFactor: adjustedFactor,
      metadata: {
        baseFactor: fuelData.factor,
        biofuelBlend,
        calculation: `${quantity} × ${adjustedFactor} = ${emissions.toFixed(3)} kgCO2e`
      }
    }
  }
  
  /**
   * Calculate emissions for mobile combustion (Scope 1)
   */
  static calculateMobileCombustion({ fuelType, distance, fuelConsumption }) {
    const fuelData = DEFAULT_FACTORS.fuels[fuelType]
    if (!fuelData) {
      throw new Error(`Unknown fuel type: ${fuelType}`)
    }
    
    // If distance and fuel consumption rate provided, calculate fuel used first
    let fuelUsed = distance && fuelConsumption ? distance * fuelConsumption : distance
    const emissions = fuelUsed * fuelData.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope1',
      sourceType: 'mobile_combustion',
      activityType: fuelType,
      activityValue: fuelUsed,
      activityUnit: fuelData.unit.split('/')[1],
      emissionFactor: fuelData.factor,
      metadata: {
        distance,
        fuelConsumption,
        calculation: `${fuelUsed} × ${fuelData.factor} = ${emissions.toFixed(3)} kgCO2e`
      }
    }
  }
  
  /**
   * Calculate emissions for fugitive emissions (refrigerants) (Scope 1)
   */
  static calculateFugitiveEmissions({ refrigerantType, quantity }) {
    const refrigerantData = DEFAULT_FACTORS.refrigerants[refrigerantType]
    if (!refrigerantData) {
      throw new Error(`Unknown refrigerant type: ${refrigerantType}`)
    }
    
    const emissions = quantity * refrigerantData.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope1',
      sourceType: 'fugitive_emissions',
      activityType: refrigerantType,
      activityValue: quantity,
      activityUnit: 'kg',
      emissionFactor: refrigerantData.factor,
      metadata: {
        gwp: refrigerantData.factor,
        calculation: `${quantity} kg × ${refrigerantData.factor} GWP = ${emissions.toFixed(3)} kgCO2e`
      }
    }
  }
  
  /**
   * Calculate emissions for purchased electricity (Scope 2)
   */
  static calculateElectricity({ consumption, region = 'uk', isRenewable = false }) {
    const regionKey = isRenewable ? `${region}-renewable` : region
    const electricityData = DEFAULT_FACTORS.electricity[regionKey] || DEFAULT_FACTORS.electricity.global
    
    const emissions = consumption * electricityData.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope2',
      sourceType: 'purchased_electricity',
      activityType: `electricity-${region}`,
      activityValue: consumption,
      activityUnit: 'kWh',
      emissionFactor: electricityData.factor,
      metadata: {
        region,
        isRenewable,
        calculation: `${consumption} kWh × ${electricityData.factor} = ${emissions.toFixed(3)} kgCO2e`
      }
    }
  }
  
  /**
   * Calculate emissions for business travel - road (Scope 3)
   */
  static calculateRoadTransport({ vehicleType, distance }) {
    const vehicleData = DEFAULT_FACTORS.transport[vehicleType]
    if (!vehicleData) {
      throw new Error(`Unknown vehicle type: ${vehicleType}`)
    }
    
    const emissions = distance * vehicleData.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope3',
      sourceType: 'business_travel',
      activityType: vehicleType,
      activityValue: distance,
      activityUnit: 'km',
      emissionFactor: vehicleData.factor,
      metadata: {
        calculation: `${distance} km × ${vehicleData.factor} = ${emissions.toFixed(3)} kgCO2e`
      }
    }
  }
  
  /**
   * Calculate emissions for business travel - air (Scope 3)
   */
  static calculateAirTravel({ flightClass, distance }) {
    const flightData = DEFAULT_FACTORS.airTravel[flightClass]
    if (!flightData) {
      throw new Error(`Unknown flight class: ${flightClass}`)
    }
    
    const emissions = distance * flightData.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope3',
      sourceType: 'business_travel',
      activityType: flightClass,
      activityValue: distance,
      activityUnit: 'km',
      emissionFactor: flightData.factor,
      metadata: {
        calculation: `${distance} km × ${flightData.factor} = ${emissions.toFixed(3)} kgCO2e`
      }
    }
  }
  
  /**
   * Calculate emissions for accommodation (Scope 3)
   */
  static calculateAccommodation({ nights }) {
    const accommodationData = DEFAULT_FACTORS.accommodation['hotel-room-night']
    const emissions = nights * accommodationData.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope3',
      sourceType: 'business_travel',
      activityType: 'hotel-accommodation',
      activityValue: nights,
      activityUnit: 'nights',
      emissionFactor: accommodationData.factor,
      metadata: {
        calculation: `${nights} nights × ${accommodationData.factor} = ${emissions.toFixed(3)} kgCO2e`
      }
    }
  }
  
  /**
   * Calculate emissions for waste disposal (Scope 3)
   */
  static calculateWaste({ wasteType, weight }) {
    const wasteData = DEFAULT_FACTORS.waste[wasteType]
    if (!wasteData) {
      throw new Error(`Unknown waste type: ${wasteType}`)
    }
    
    // Convert kg to tonnes
    const tonnes = weight / 1000
    const emissions = tonnes * wasteData.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope3',
      sourceType: 'waste_generated',
      activityType: wasteType,
      activityValue: weight,
      activityUnit: 'kg',
      emissionFactor: wasteData.factor,
      metadata: {
        tonnes,
        calculation: `${tonnes} tonnes × ${wasteData.factor} = ${emissions.toFixed(3)} kgCO2e`
      }
    }
  }
  
  /**
   * Calculate emissions for water consumption (Scope 3)
   */
  static calculateWater({ volume, includeWastewater = true }) {
    const supplyData = DEFAULT_FACTORS.water.supply
    const treatmentData = DEFAULT_FACTORS.water.treatment
    
    const supplyEmissions = volume * supplyData.factor
    const treatmentEmissions = includeWastewater ? volume * treatmentData.factor : 0
    const totalEmissions = supplyEmissions + treatmentEmissions
    
    return {
      co2e: parseFloat(totalEmissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope3',
      sourceType: 'water_consumption',
      activityType: 'water',
      activityValue: volume,
      activityUnit: 'm³',
      emissionFactor: supplyData.factor + (includeWastewater ? treatmentData.factor : 0),
      metadata: {
        supplyEmissions: parseFloat(supplyEmissions.toFixed(3)),
        treatmentEmissions: parseFloat(treatmentEmissions.toFixed(3)),
        includeWastewater,
        calculation: `${volume} m³ × (${supplyData.factor} + ${includeWastewater ? treatmentData.factor : 0}) = ${totalEmissions.toFixed(3)} kgCO2e`
      }
    }
  }
  
  /**
   * Save calculated emissions to database
   */
  static async saveEmission(companyId, calculationResult, additionalData = {}) {
    const emission = new GHGEmission({
      companyId,
      ...calculationResult,
      ...additionalData,
      recordedAt: new Date(),
    })
    
    await emission.save()
    return emission
  }
  
  /**
   * Get emission factor from database or defaults
   */
  static async getEmissionFactor(category, type, region = null) {
    try {
      const query = { category, type }
      if (region) query.region = region
      
      const factor = await EmissionFactor.findOne(query)
        .sort({ year: -1 }) // Get most recent
        .lean()
      
      return factor
    } catch (error) {
      console.error('Error fetching emission factor:', error)
      return null
    }
  }
}

module.exports = EmissionsCalculator
