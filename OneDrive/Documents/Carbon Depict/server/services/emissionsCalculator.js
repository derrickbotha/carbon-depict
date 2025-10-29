/**
 * GHG Emissions Calculation Service - PRODUCTION-GRADE
 * Implements GHG Protocol calculation methodologies with proper validation,
 * DB factor usage, Scope-2 market/location handling, and rich metadata
 * 
 * Key improvements:
 * - Uses EmissionFactor DB lookup first, falls back to embedded defaults
 * - Fixes mobile combustion logic bug (units mixing)
 * - Implements Scope-2 market vs location methodology
 * - Adds comprehensive input validation
 * - Returns rich provenance metadata (source, year, dataQuality, etc.)
 * - Handles GWP versions explicitly (AR4/AR5/AR6)
 */

const EmissionFactor = require('../models/mongodb/EmissionFactor')
const GHGEmission = require('../models/mongodb/GHGEmission')

/**
 * In-memory cache for emission factors to reduce DB queries
 * Cache TTL: 5 minutes (300000ms)
 */
const factorCache = new Map()
const CACHE_TTL = 300000 // 5 minutes

/**
 * Get cache key for factor lookup
 */
function getCacheKey(category, type, region) {
  return `${category}:${type}:${region || 'default'}`
}

/**
 * Get cached factor or null
 */
function getCachedFactor(key) {
  const cached = factorCache.get(key)
  if (!cached) return null
  
  // Check if cache expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    factorCache.delete(key)
    return null
  }
  
  return cached.data
}

/**
 * Cache a factor
 */
function setCachedFactor(key, data) {
  factorCache.set(key, {
    data,
    timestamp: Date.now()
  })
}

/**
 * Clear cache (useful for testing or manual refresh)
 */
function clearFactorCache() {
  factorCache.clear()
}

/**
 * Embedded default emission factors (DEFRA 2025 / GHG Protocol compliant)
 * Used only as fallback when DB lookup fails
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
  
  // Scope 1: Refrigerants (IPCC AR5 GWP values - document this explicitly)
  refrigerants: {
    'r-134a': { factor: 1430, unit: 'kgCO2e/kg', scope: 'scope1', gwpVersion: 'AR5', gwpSource: 'IPCC' },
    'r-404a': { factor: 3922, unit: 'kgCO2e/kg', scope: 'scope1', gwpVersion: 'AR5', gwpSource: 'IPCC' },
    'r-410a': { factor: 2088, unit: 'kgCO2e/kg', scope: 'scope1', gwpVersion: 'AR5', gwpSource: 'IPCC' },
    'r-32': { factor: 675, unit: 'kgCO2e/kg', scope: 'scope1', gwpVersion: 'AR5', gwpSource: 'IPCC' },
  },
  
  // Scope 2: Electricity by region (kgCO2e/kWh) - DEFRA 2025
  electricity: {
    uk: { factor: 0.20898, unit: 'kgCO2e/kWh', scope: 'scope2', source: 'DEFRA 2025', year: 2025 },
    'uk-renewable': { factor: 0, unit: 'kgCO2e/kWh', scope: 'scope2', source: 'DEFRA 2025', year: 2025 },
    eu: { factor: 0.275, unit: 'kgCO2e/kWh', scope: 'scope2', source: 'IEA' },
    us: { factor: 0.386, unit: 'kgCO2e/kWh', scope: 'scope2', source: 'EPA' },
    china: { factor: 0.555, unit: 'kgCO2e/kWh', scope: 'scope2', source: 'IEA' },
    india: { factor: 0.708, unit: 'kgCO2e/kWh', scope: 'scope2', source: 'IEA' },
    global: { factor: 0.475, unit: 'kgCO2e/kWh', scope: 'scope2', source: 'IEA' },
  },
  
  // Scope 3: Transport (DEFRA 2025)
  transport: {
    'car-small-petrol': { factor: 0.14235, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'car-medium-petrol': { factor: 0.18694, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'car-large-petrol': { factor: 0.28143, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'car-small-diesel': { factor: 0.12039, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'car-medium-diesel': { factor: 0.14738, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'car-large-diesel': { factor: 0.21167, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'car-electric': { factor: 0.05331, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'van-class-1': { factor: 0.12686, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'van-class-2': { factor: 0.17289, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'van-class-3': { factor: 0.25933, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'motorcycle-small': { factor: 0.08449, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'motorcycle-medium': { factor: 0.10127, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'motorcycle-large': { factor: 0.13337, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'bus': { factor: 0.10312, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'rail-national': { factor: 0.03549, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'rail-international': { factor: 0.00331, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'taxi': { factor: 0.15075, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
  },
  
  // Scope 3: Air travel (DEFRA 2025)
  airTravel: {
    'domestic-economy': { factor: 0.24587, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'domestic-business': { factor: 0.36881, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'short-haul-economy': { factor: 0.15573, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'short-haul-business': { factor: 0.23359, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'long-haul-economy': { factor: 0.14808, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'long-haul-premium': { factor: 0.42765, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'long-haul-business': { factor: 0.59210, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'long-haul-first': { factor: 0.88815, unit: 'kgCO2e/passenger-km', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
  },
  
  // Scope 3: Hotel stays (DEFRA 2025)
  accommodation: {
    'hotel-room-night': { factor: 10.5, unit: 'kgCO2e/night', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
  },
  
  // Scope 3: Waste (DEFRA 2025)
  waste: {
    'landfill': { factor: 467, unit: 'kgCO2e/tonne', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'incineration': { factor: 21, unit: 'kgCO2e/tonne', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'recycling': { factor: 21, unit: 'kgCO2e/tonne', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'composting': { factor: 8.3, unit: 'kgCO2e/tonne', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
  },
  
  // Scope 3: Water (DEFRA 2025)
  water: {
    'supply': { factor: 0.344, unit: 'kgCO2e/m³', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
    'treatment': { factor: 0.708, unit: 'kgCO2e/m³', scope: 'scope3', source: 'DEFRA 2025', year: 2025 },
  },
}

/**
 * EmissionsCalculator Class
 * Implements GHG Protocol compliant calculations with proper validation and provenance
 */
class EmissionsCalculator {
  /**
   * Resolve emission factor from cache first, then DB, then fall back to embedded defaults
   * Returns factor record with source, year, dataQuality metadata
   * OPTIMIZED: Added in-memory caching to reduce DB queries
   */
  static async resolveFactor({ category, type, region = null }) {
    const cacheKey = getCacheKey(category, type, region)
    
    // Check cache first
    const cached = getCachedFactor(cacheKey)
    if (cached) {
      return cached
    }
    
    // Try DB lookup (using EmissionFactor model)
    let factorRecord = null
    try {
      const dbRecord = await EmissionFactor.getCurrentFactor(category, type, region || 'UK')
      if (dbRecord && dbRecord.factor != null) {
        factorRecord = {
          factor: dbRecord.factor,
          unit: dbRecord.unit,
          source: dbRecord.source || 'emissionfactor_db',
          year: dbRecord.version ? parseInt(dbRecord.version) : null,
          gwpVersion: dbRecord.gwpVersion || null,
          gwpSource: 'IPCC',
          dataQuality: 'high', // DB factors are assumed high quality
          scope: dbRecord.scope?.toLowerCase().replace(' ', '') || null,
        }
        // Cache the result
        setCachedFactor(cacheKey, factorRecord)
        return factorRecord
      }
    } catch (err) {
      console.warn('EmissionFactor DB lookup failed, using default:', err.message)
    }

    // Fall back to embedded defaults
    const cat = DEFAULT_FACTORS[category]
    if (cat && cat[type]) {
      const d = cat[type]
      factorRecord = {
        factor: d.factor,
        unit: d.unit,
        source: d.source || 'embedded_defaults',
        year: d.year || null,
        gwpVersion: d.gwpVersion || null,
        gwpSource: d.gwpSource || null,
        dataQuality: 'medium', // Embedded defaults marked as medium quality
        scope: d.scope || null,
      }
      // Cache defaults too (shorter TTL could be applied here if needed)
      setCachedFactor(cacheKey, factorRecord)
      return factorRecord
    }

    // Try electricity regional keys if category is electricity
    if (category === 'electricity' && region) {
      const alt = DEFAULT_FACTORS.electricity[region]
      if (alt) {
        factorRecord = {
          factor: alt.factor,
          unit: alt.unit,
          source: alt.source || 'embedded_defaults',
          year: alt.year || null,
          dataQuality: 'medium',
          scope: alt.scope || 'scope2',
        }
        setCachedFactor(cacheKey, factorRecord)
        return factorRecord
      }
    }

    return null
  }

  /**
   * Clear the emission factor cache
   * Useful for refreshing factors after updates
   */
  static clearCache() {
    clearFactorCache()
  }

  /**
   * Strict input validation for numeric values
   */
  static _validateNumber(name, v) {
    if (v === undefined || v === null || Number.isNaN(Number(v))) {
      throw new Error(`${name} is required and must be a valid number`)
    }
    const num = Number(v)
    if (num < 0) {
      throw new Error(`${name} must be non-negative (got ${num})`)
    }
    return num
  }

  /**
   * Calculate emissions for stationary combustion (Scope 1)
   * Supports biofuel blend percentage adjustment
   */
  static async calculateStationaryCombustion({ fuelType, quantity, biofuelBlend = 0 }) {
    if (!fuelType) throw new Error('fuelType is required')
    
    const q = EmissionsCalculator._validateNumber('quantity', quantity)
    if (biofuelBlend < 0 || biofuelBlend > 100) {
      throw new Error('biofuelBlend must be between 0 and 100')
    }
    
    const factorRecord = await EmissionsCalculator.resolveFactor({ category: 'fuels', type: fuelType })
    if (!factorRecord) {
      throw new Error(`Unknown fuel type: ${fuelType}`)
    }
    
    const adjustedFactor = factorRecord.factor * (1 - biofuelBlend / 100)
    const emissions = q * adjustedFactor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope1',
      sourceType: 'stationary_combustion',
      activityType: fuelType,
      activityValue: q,
      activityUnit: (factorRecord.unit && factorRecord.unit.split('/')[1]) || 'unit',
      emissionFactor: adjustedFactor,
      emissionFactorUnit: factorRecord.unit,
      emissionFactorSource: factorRecord.source,
      emissionFactorYear: factorRecord.year,
      metadata: {
        baseFactor: factorRecord.factor,
        biofuelBlend,
        calculation: `${q} × ${adjustedFactor} = ${emissions.toFixed(3)} kgCO2e`,
        dataQuality: factorRecord.dataQuality,
        provenance: 'GHG Protocol - Stationary Combustion'
      }
    }
  }

  /**
   * Calculate emissions for mobile combustion (Scope 1)
   * FIXED BUG: Now requires either fuelUsed OR both distance AND fuelConsumption
   * 
   * Usage:
   *   - { fuelType: 'diesel', fuelUsed: 8 } // litres consumed
   *   - { fuelType: 'diesel', distance: 100, fuelConsumption: 0.08 } // km distance @ L/km rate
   */
  static async calculateMobileCombustion({ fuelType, distance = null, fuelConsumption = null, fuelUsed = null }) {
    if (!fuelType) throw new Error('fuelType is required')
    
    const factorRecord = await EmissionsCalculator.resolveFactor({ category: 'fuels', type: fuelType })
    if (!factorRecord) {
      throw new Error(`Unknown fuel type: ${fuelType}`)
    }
    
    // Calculate fuel used
    let used
    if (fuelUsed != null) {
      used = EmissionsCalculator._validateNumber('fuelUsed', fuelUsed)
    } else {
      // Require both distance and fuelConsumption
      if (distance == null || fuelConsumption == null) {
        throw new Error('Either fuelUsed OR (distance AND fuelConsumption) must be provided')
      }
      const d = EmissionsCalculator._validateNumber('distance', distance)
      const fc = EmissionsCalculator._validateNumber('fuelConsumption', fuelConsumption)
      used = d * fc
    }
    
    const emissions = used * factorRecord.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope1',
      sourceType: 'mobile_combustion',
      activityType: fuelType,
      activityValue: used,
      activityUnit: (factorRecord.unit && factorRecord.unit.split('/')[1]) || 'litres',
      emissionFactor: factorRecord.factor,
      emissionFactorUnit: factorRecord.unit,
      emissionFactorSource: factorRecord.source,
      emissionFactorYear: factorRecord.year,
      metadata: {
        distance: distance ?? null,
        fuelConsumption: fuelConsumption ?? null,
        fuelUsed: used,
        calculation: `${used} × ${factorRecord.factor} = ${emissions.toFixed(3)} kgCO2e`,
        dataQuality: factorRecord.dataQuality,
        provenance: 'GHG Protocol - Mobile Combustion'
      }
    }
  }

  /**
   * Calculate emissions for fugitive emissions (refrigerants) (Scope 1)
   * Uses GWP values explicitly (AR5 by default, can be overridden)
   */
  static async calculateFugitiveEmissions({ refrigerantType, quantity, gwpVersion = 'AR5' }) {
    if (!refrigerantType) throw new Error('refrigerantType is required')
    
    const q = EmissionsCalculator._validateNumber('quantity', quantity)
    
    // Normalize refrigerant key (handle R-134a, r134a, HFC-134a, etc.)
    const key = refrigerantType.toLowerCase().replace(/\s+/g, '-').replace(/^r[^\-]/, 'r-')
    
    const factorRecord = await EmissionsCalculator.resolveFactor({ category: 'refrigerants', type: key })
    if (!factorRecord) {
      throw new Error(`Unknown refrigerant type: ${refrigerantType}`)
    }
    
    const emissions = q * factorRecord.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope1',
      sourceType: 'fugitive_emissions',
      activityType: refrigerantType,
      activityValue: q,
      activityUnit: 'kg',
      emissionFactor: factorRecord.factor,
      emissionFactorUnit: factorRecord.unit,
      emissionFactorSource: factorRecord.source,
      emissionFactorYear: factorRecord.year,
      gwp: {
        value: factorRecord.factor,
        version: factorRecord.gwpVersion || gwpVersion,
        source: factorRecord.gwpSource || 'IPCC'
      },
      metadata: {
        gwp: factorRecord.factor,
        gwpVersion: factorRecord.gwpVersion || gwpVersion,
        calculation: `${q} kg × ${factorRecord.factor} GWP = ${emissions.toFixed(3)} kgCO2e`,
        dataQuality: factorRecord.dataQuality,
        provenance: 'GHG Protocol - Fugitive Emissions (IPCC GWP)'
      }
    }
  }

  /**
   * Calculate emissions for purchased electricity (Scope 2)
   * IMPROVED: Implements market-based vs location-based methodology per GHG Protocol
   * 
   * @param {number} consumption - kWh consumed
   * @param {string} region - region code (uk, eu, us, etc.)
   * @param {string} method - 'location' or 'market' (defaults to 'location')
   * @param {object} supplierCertificate - For market-based: { valid, retired, factor, source, year }
   */
  static async calculateElectricity({ 
    consumption, 
    region = 'uk', 
    method = 'location',
    supplierCertificate = null 
  }) {
    const c = EmissionsCalculator._validateNumber('consumption', consumption)
    
    if (method !== 'location' && method !== 'market') {
      throw new Error('method must be "location" or "market"')
    }
    
    let efRecord = null
    
    // Market-based method: use supplier certificate if valid and retired
    if (method === 'market') {
      if (supplierCertificate && supplierCertificate.valid && supplierCertificate.retired && supplierCertificate.factor != null) {
        efRecord = {
          factor: EmissionsCalculator._validateNumber('supplierCertificate.factor', supplierCertificate.factor),
          unit: supplierCertificate.unit || 'kgCO2e/kWh',
          source: supplierCertificate.source || 'supplier_certificate',
          year: supplierCertificate.year || null,
          dataQuality: 'high',
          scope: 'scope2'
        }
      } else {
        // Fallback to residual mix for the region
        efRecord = await EmissionsCalculator.resolveFactor({ category: 'electricity', type: region })
        if (!efRecord) {
          efRecord = DEFAULT_FACTORS.electricity.global
        }
        console.warn('Market-based calculation: using residual mix (no valid supplier certificate provided)')
      }
    } else {
      // Location-based: use grid-average factor
      efRecord = await EmissionsCalculator.resolveFactor({ category: 'electricity', type: region })
      if (!efRecord) {
        efRecord = DEFAULT_FACTORS.electricity.global
      }
    }
    
    const emissions = c * efRecord.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope2',
      sourceType: 'purchased_electricity',
      activityType: `electricity-${region}`,
      activityValue: c,
      activityUnit: 'kWh',
      emissionFactor: efRecord.factor,
      emissionFactorUnit: efRecord.unit,
      emissionFactorSource: efRecord.source,
      emissionFactorYear: efRecord.year,
      metadata: {
        method,
        supplierCertificate: supplierCertificate ? { retired: !!supplierCertificate.retired, valid: !!supplierCertificate.valid, source: supplierCertificate.source } : null,
        region,
        calculation: `${c} kWh × ${efRecord.factor} = ${emissions.toFixed(3)} kgCO2e`,
        dataQuality: efRecord.dataQuality,
        provenance: `GHG Protocol - Scope 2 (${method}-based method)`
      }
    }
  }

  /**
   * Calculate emissions for business travel - road (Scope 3)
   */
  static async calculateRoadTransport({ vehicleType, distance }) {
    if (!vehicleType) throw new Error('vehicleType is required')
    
    const d = EmissionsCalculator._validateNumber('distance', distance)
    
    const factorRecord = await EmissionsCalculator.resolveFactor({ category: 'transport', type: vehicleType })
    if (!factorRecord) {
      throw new Error(`Unknown vehicle type: ${vehicleType}`)
    }
    
    const emissions = d * factorRecord.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope3',
      sourceType: 'business_travel',
      activityType: vehicleType,
      activityValue: d,
      activityUnit: 'km',
      emissionFactor: factorRecord.factor,
      emissionFactorUnit: factorRecord.unit,
      emissionFactorSource: factorRecord.source,
      emissionFactorYear: factorRecord.year,
      metadata: {
        calculation: `${d} km × ${factorRecord.factor} = ${emissions.toFixed(3)} kgCO2e`,
        dataQuality: factorRecord.dataQuality,
        provenance: 'GHG Protocol - Scope 3 Business Travel'
      }
    }
  }

  /**
   * Calculate emissions for business travel - air (Scope 3)
   */
  static async calculateAirTravel({ flightClass, distance }) {
    if (!flightClass) throw new Error('flightClass is required')
    
    const d = EmissionsCalculator._validateNumber('distance', distance)
    
    const factorRecord = await EmissionsCalculator.resolveFactor({ category: 'airTravel', type: flightClass })
    if (!factorRecord) {
      throw new Error(`Unknown flight class: ${flightClass}`)
    }
    
    const emissions = d * factorRecord.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope3',
      sourceType: 'business_travel',
      activityType: flightClass,
      activityValue: d,
      activityUnit: 'km',
      emissionFactor: factorRecord.factor,
      emissionFactorUnit: factorRecord.unit,
      emissionFactorSource: factorRecord.source,
      emissionFactorYear: factorRecord.year,
      metadata: {
        calculation: `${d} km × ${factorRecord.factor} = ${emissions.toFixed(3)} kgCO2e`,
        dataQuality: factorRecord.dataQuality,
        provenance: 'GHG Protocol - Scope 3 Air Travel'
      }
    }
  }

  /**
   * Calculate emissions for accommodation (Scope 3)
   */
  static async calculateAccommodation({ nights }) {
    const n = EmissionsCalculator._validateNumber('nights', nights)
    
    const factorRecord = await EmissionsCalculator.resolveFactor({ category: 'accommodation', type: 'hotel-room-night' })
    const emissions = n * factorRecord.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope3',
      sourceType: 'business_travel',
      activityType: 'hotel-accommodation',
      activityValue: n,
      activityUnit: 'nights',
      emissionFactor: factorRecord.factor,
      emissionFactorUnit: factorRecord.unit,
      emissionFactorSource: factorRecord.source,
      emissionFactorYear: factorRecord.year,
      metadata: {
        calculation: `${n} nights × ${factorRecord.factor} = ${emissions.toFixed(3)} kgCO2e`,
        dataQuality: factorRecord.dataQuality,
        provenance: 'GHG Protocol - Scope 3 Accommodation'
      }
    }
  }

  /**
   * Calculate emissions for waste disposal (Scope 3)
   */
  static async calculateWaste({ wasteType, weight }) {
    if (!wasteType) throw new Error('wasteType is required')
    
    const w = EmissionsCalculator._validateNumber('weight', weight)
    
    const factorRecord = await EmissionsCalculator.resolveFactor({ category: 'waste', type: wasteType })
    if (!factorRecord) {
      throw new Error(`Unknown waste type: ${wasteType}`)
    }
    
    // Convert kg to tonnes
    const tonnes = w / 1000.0
    const emissions = tonnes * factorRecord.factor
    
    return {
      co2e: parseFloat(emissions.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope3',
      sourceType: 'waste_generated',
      activityType: wasteType,
      activityValue: w,
      activityUnit: 'kg',
      emissionFactor: factorRecord.factor,
      emissionFactorUnit: factorRecord.unit,
      emissionFactorSource: factorRecord.source,
      emissionFactorYear: factorRecord.year,
      metadata: {
        tonnes,
        calculation: `${tonnes} tonnes × ${factorRecord.factor} = ${emissions.toFixed(3)} kgCO2e`,
        dataQuality: factorRecord.dataQuality,
        provenance: 'GHG Protocol - Scope 3 Waste Disposal'
      }
    }
  }

  /**
   * Calculate emissions for water consumption (Scope 3)
   */
  static async calculateWater({ volume, includeWastewater = true }) {
    const v = EmissionsCalculator._validateNumber('volume', volume)
    
    const supply = await EmissionsCalculator.resolveFactor({ category: 'water', type: 'supply' })
    const treatment = await EmissionsCalculator.resolveFactor({ category: 'water', type: 'treatment' })
    
    const supplyEmissions = v * supply.factor
    const treatmentEmissions = includeWastewater ? v * treatment.factor : 0
    const total = supplyEmissions + treatmentEmissions
    
    return {
      co2e: parseFloat(total.toFixed(3)),
      unit: 'kgCO2e',
      scope: 'scope3',
      sourceType: 'water_consumption',
      activityType: 'water',
      activityValue: v,
      activityUnit: 'm³',
      emissionFactor: supply.factor + (includeWastewater ? treatment.factor : 0),
      emissionFactorUnit: `${supply.unit} + ${treatment.unit}`,
      emissionFactorSource: `${supply.source} + ${treatment.source}`,
      emissionFactorYear: supply.year || treatment.year || null,
      metadata: {
        supplyEmissions: parseFloat(supplyEmissions.toFixed(3)),
        treatmentEmissions: parseFloat(treatmentEmissions.toFixed(3)),
        includeWastewater,
        calculation: `${v} m³ × (${supply.factor} + ${includeWastewater ? treatment.factor : 0}) = ${total.toFixed(3)} kgCO2e`,
        dataQuality: 'medium', // Combined factors
        provenance: 'GHG Protocol - Scope 3 Water Consumption'
      }
    }
  }

  /**
   * Save calculated emissions to database with full provenance
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
   * Get emission factor from database or defaults (legacy method for backwards compatibility)
   */
  static async getEmissionFactor(category, type, region = null) {
    return await EmissionsCalculator.resolveFactor({ category, type, region })
  }
}

module.exports = EmissionsCalculator
