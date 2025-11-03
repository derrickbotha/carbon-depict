/**
 * Emissions Calculator Utility
 * Comprehensive GHG emissions calculations using DEFRA 2025 emission factors
 * Supports Scope 1, 2, 3 and PCAF financed emissions
 * 
 * Based on:
 * - GHG Protocol Corporate Standard
 * - DEFRA 2025 Conversion Factors
 * - PCAF Global GHG Accounting Standard
 */

import { getEmissionFactor, getPCAFDataQualityScore } from './emissionFactors';

/**
 * Calculate Scope 1 emissions (Direct emissions)
 * @param {object} data - Activity data
 * @returns {object} Emissions calculation result
 */
export function calculateScope1(data) {
  const {
    naturalGasKwh = 0,
    petrolLiters = 0,
    dieselLiters = 0,
    lpgLiters = 0,
    coalKwh = 0,
    heatingOilLiters = 0,
  } = data;

  const naturalGasFactor = getEmissionFactor('fuels', 'naturalGas');
  const petrolFactor = getEmissionFactor('fuels', 'petrol');
  const dieselFactor = getEmissionFactor('fuels', 'diesel');
  const lpgFactor = getEmissionFactor('fuels', 'lpg');
  const coalFactor = getEmissionFactor('fuels', 'coalIndustrial');
  const heatingOilFactor = getEmissionFactor('fuels', 'heatingOil');

  const emissions = {
    naturalGas: naturalGasKwh * naturalGasFactor.factor,
    petrol: petrolLiters * petrolFactor.factor,
    diesel: dieselLiters * dieselFactor.factor,
    lpg: lpgLiters * lpgFactor.factor,
    coal: coalKwh * coalFactor.factor,
    heatingOil: heatingOilLiters * heatingOilFactor.factor,
  };

  const totalKgCO2e = Object.values(emissions).reduce((sum, val) => sum + val, 0);
  const totalTonnesCO2e = totalKgCO2e / 1000;

  return {
    scope: 1,
    totalKgCO2e,
    totalTonnesCO2e,
    breakdown: emissions,
    methodology: 'DEFRA 2025 Fuels',
    uncertainty: calculateWeightedUncertainty(data, 'fuels'),
  };
}

/**
 * Calculate Scope 2 emissions (Indirect energy emissions)
 * @param {object} data - Activity data
 * @param {string} method - 'location-based' or 'market-based'
 * @returns {object} Emissions calculation result
 */
export function calculateScope2(data, method = 'location-based') {
  const {
    electricityKwh = 0,
    renewablePercentage = 0, // For market-based method
  } = data;

  let electricityFactor;
  
  if (method === 'market-based' && renewablePercentage === 100) {
    electricityFactor = getEmissionFactor('electricity', 'renewable100');
  } else {
    electricityFactor = getEmissionFactor('electricity', 'ukGrid');
  }

  const gridEmissions = electricityKwh * electricityFactor.factor;
  
  // Adjust for renewable percentage in market-based method
  const marketAdjustedEmissions = method === 'market-based' 
    ? gridEmissions * (1 - renewablePercentage / 100)
    : gridEmissions;

  // Include T&D losses (Scope 3 Category 3)
  const tdFactor = getEmissionFactor('electricity', 'ukGridTransmissionLoss');
  const tdEmissions = electricityKwh * tdFactor.factor;

  const totalKgCO2e = marketAdjustedEmissions;
  const totalTonnesCO2e = totalKgCO2e / 1000;

  return {
    scope: 2,
    method,
    totalKgCO2e,
    totalTonnesCO2e,
    tdLossesKgCO2e: tdEmissions,
    tdLossesTonnesCO2e: tdEmissions / 1000,
    breakdown: {
      gridElectricity: marketAdjustedEmissions,
      renewableOffset: method === 'market-based' ? gridEmissions * (renewablePercentage / 100) : 0,
    },
    methodology: `DEFRA 2025 Electricity (${method})`,
    uncertainty: electricityFactor.uncertainty,
  };
}

/**
 * Calculate Scope 3 Category 6 emissions (Business travel)
 * @param {object} data - Travel activity data
 * @returns {object} Emissions calculation result
 */
export function calculateScope3BusinessTravel(data) {
  const {
    // Air travel
    domesticFlightKm = 0,
    shortHaulFlightKm = 0,
    longHaulFlightKm = 0,
    
    // Road travel
    carPetrolKm = 0,
    carDieselKm = 0,
    carHybridKm = 0,
    carElectricKm = 0,
    taxiKm = 0,
    
    // Rail travel
    nationalRailKm = 0,
    internationalRailKm = 0,
    undergroundKm = 0,
    
    // Accommodation
    hotelNightsAverage = 0,
    hotelNightsLuxury = 0,
  } = data;

  const emissions = {
    // Air
    domesticFlight: domesticFlightKm * getEmissionFactor('transportation', 'airDomesticAverage').factor,
    shortHaulFlight: shortHaulFlightKm * getEmissionFactor('transportation', 'airShortHaulInternational').factor,
    longHaulFlight: longHaulFlightKm * getEmissionFactor('transportation', 'airLongHaulInternational').factor,
    
    // Road
    carPetrol: carPetrolKm * getEmissionFactor('transportation', 'carPetrolMedium').factor,
    carDiesel: carDieselKm * getEmissionFactor('transportation', 'carDieselMedium').factor,
    carHybrid: carHybridKm * getEmissionFactor('transportation', 'carHybrid').factor,
    carElectric: carElectricKm * getEmissionFactor('transportation', 'carElectric').factor,
    taxi: taxiKm * getEmissionFactor('transportation', 'taxi').factor,
    
    // Rail
    nationalRail: nationalRailKm * getEmissionFactor('transportation', 'railNational').factor,
    internationalRail: internationalRailKm * getEmissionFactor('transportation', 'railInternational').factor,
    underground: undergroundKm * getEmissionFactor('transportation', 'railLondonUnderground').factor,
    
    // Accommodation
    hotelAverage: hotelNightsAverage * getEmissionFactor('accommodation', 'hotelAverage').factor,
    hotelLuxury: hotelNightsLuxury * getEmissionFactor('accommodation', 'hotelLuxury').factor,
  };

  const totalKgCO2e = Object.values(emissions).reduce((sum, val) => sum + val, 0);
  const totalTonnesCO2e = totalKgCO2e / 1000;

  return {
    scope: 3,
    category: 6,
    categoryName: 'Business Travel',
    totalKgCO2e,
    totalTonnesCO2e,
    breakdown: emissions,
    methodology: 'DEFRA 2025 Business Travel',
    uncertainty: 0.15, // Average uncertainty for travel
  };
}

/**
 * Calculate Scope 3 Category 1 emissions (Purchased goods - spend-based)
 * @param {object} data - Spend data
 * @returns {object} Emissions calculation result
 */
export function calculateScope3PurchasedGoods(data) {
  const {
    goodsSpendGBP = 0,
    servicesSpendGBP = 0,
  } = data;

  const goodsFactor = getEmissionFactor('materials', 'purchasedGoodsSpend');
  const servicesFactor = getEmissionFactor('materials', 'purchasedServicesSpend');

  const emissions = {
    goods: goodsSpendGBP * goodsFactor.factor,
    services: servicesSpendGBP * servicesFactor.factor,
  };

  const totalKgCO2e = Object.values(emissions).reduce((sum, val) => sum + val, 0);
  const totalTonnesCO2e = totalKgCO2e / 1000;

  return {
    scope: 3,
    category: 1,
    categoryName: 'Purchased Goods and Services',
    totalKgCO2e,
    totalTonnesCO2e,
    breakdown: emissions,
    methodology: 'DEFRA 2025 Spend-based',
    pcafDataQuality: 4, // Region/sector average
    uncertainty: 0.33,
  };
}

/**
 * Calculate Scope 3 Category 5 emissions (Waste)
 * @param {object} data - Waste data
 * @returns {object} Emissions calculation result
 */
export function calculateScope3Waste(data) {
  const {
    landfillTonnes = 0,
    recyclingTonnes = 0,
    incinerationTonnes = 0,
    compostTonnes = 0,
  } = data;

  const emissions = {
    landfill: landfillTonnes * getEmissionFactor('waste', 'landfill').factor,
    recycling: recyclingTonnes * getEmissionFactor('waste', 'recycling').factor,
    incineration: incinerationTonnes * getEmissionFactor('waste', 'incineration').factor,
    compost: compostTonnes * getEmissionFactor('waste', 'compost').factor,
  };

  const totalKgCO2e = Object.values(emissions).reduce((sum, val) => sum + val, 0);
  const totalTonnesCO2e = totalKgCO2e / 1000;

  return {
    scope: 3,
    category: 5,
    categoryName: 'Waste Generated in Operations',
    totalKgCO2e,
    totalTonnesCO2e,
    breakdown: emissions,
    methodology: 'DEFRA 2025 Waste',
    uncertainty: 0.20,
  };
}

/**
 * Calculate PCAF financed emissions for financial institutions
 * @param {object} data - Portfolio data
 * @returns {object} Financed emissions calculation result
 */
export function calculatePCAFFinancedEmissions(data) {
  const {
    counterpartyEmissionsTonnes = 0, // If reported (DQ Score 1)
    counterpartyRevenueMillion = 0, // For economic activity method (DQ Score 3)
    counterpartySector = 'manufacturing',
    outstandingAmountUSD = 0,
    totalAssetOrEquityUSD = 0,
    buildingAreaM2 = 0, // For real estate
    dataQualitySource = 'sector-average', // reported, physical-activity, economic-activity, sector-average, proxy
  } = data;

  let counterpartyEmissions = counterpartyEmissionsTonnes;
  let dataQualityScore = getPCAFDataQualityScore(dataQualitySource);
  let methodology = '';

  // If emissions not reported, estimate using emission factors
  if (counterpartyEmissions === 0) {
    if (buildingAreaM2 > 0) {
      // Real estate calculation
      const buildingFactor = getEmissionFactor('pcafFinancedEmissions', 'officeBuilding');
      counterpartyEmissions = (buildingAreaM2 * buildingFactor.factor) / 1000; // Convert to tonnes
      methodology = 'Building area-based (DQ Score 3)';
      dataQualityScore = 3;
    } else if (counterpartyRevenueMillion > 0) {
      // Revenue-based calculation using sector intensity
      const sectorKey = getSectorEmissionFactorKey(counterpartySector);
      const sectorFactor = getEmissionFactor('pcafFinancedEmissions', sectorKey);
      counterpartyEmissions = counterpartyRevenueMillion * sectorFactor.factor;
      methodology = `Sector average: ${counterpartySector} (DQ Score 4)`;
      dataQualityScore = 4;
    }
  } else {
    methodology = 'Reported emissions (DQ Score 1)';
    dataQualityScore = 1;
  }

  // Calculate attribution factor
  const attributionFactor = totalAssetOrEquityUSD > 0 
    ? outstandingAmountUSD / totalAssetOrEquityUSD 
    : 0;

  // Calculate financed emissions
  const financedEmissionsTonnes = counterpartyEmissions * attributionFactor;
  const financedEmissionsKg = financedEmissionsTonnes * 1000;

  // Calculate portfolio carbon intensity (tCO2e per $M invested)
  const portfolioCarbonIntensity = outstandingAmountUSD > 0
    ? (financedEmissionsTonnes / (outstandingAmountUSD / 1000000))
    : 0;

  return {
    scope: 3,
    category: 15,
    categoryName: 'Investments (Financed Emissions)',
    framework: 'PCAF',
    totalKgCO2e: financedEmissionsKg,
    totalTonnesCO2e: financedEmissionsTonnes,
    counterpartyEmissionsTonnes,
    attributionFactor: attributionFactor * 100, // As percentage
    outstandingAmountUSD,
    totalAssetOrEquityUSD,
    portfolioCarbonIntensity,
    dataQualityScore,
    methodology,
    pcafCompliant: true,
    calculation: {
      formula: 'Financed Emissions = Counterparty Emissions × (Outstanding Amount / Total Asset or Equity)',
      counterpartyEmissions: `${counterpartyEmissions.toFixed(2)} tCO2e`,
      attribution: `${outstandingAmountUSD.toLocaleString()} / ${totalAssetOrEquityUSD.toLocaleString()} = ${(attributionFactor * 100).toFixed(2)}%`,
      result: `${counterpartyEmissions.toFixed(2)} × ${(attributionFactor * 100).toFixed(2)}% = ${financedEmissionsTonnes.toFixed(2)} tCO2e`,
    },
  };
}

/**
 * Get sector emission factor key from sector name
 * @param {string} sector - Sector name
 * @returns {string} Emission factor key
 */
function getSectorEmissionFactorKey(sector) {
  const sectorMap = {
    'utilities': 'electricUtilities',
    'electric utilities': 'electricUtilities',
    'energy': 'oilGas',
    'oil & gas': 'oilGas',
    'oil and gas': 'oilGas',
    'manufacturing': 'manufacturing',
    'industrials': 'manufacturing',
    'technology': 'technology',
    'tech': 'technology',
    'it': 'technology',
    'financial services': 'financialServices',
    'financials': 'financialServices',
    'banking': 'financialServices',
    'real estate': 'realEstate',
    'property': 'realEstate',
    'retail': 'retail',
    'consumer': 'retail',
  };

  const normalized = sector.toLowerCase();
  return sectorMap[normalized] || 'manufacturing'; // Default to manufacturing
}

/**
 * Calculate weighted uncertainty based on activity data
 * @param {object} data - Activity data with values
 * @param {string} category - Emission factor category
 * @returns {number} Weighted average uncertainty
 */
function calculateWeightedUncertainty(data, category) {
  // Simplified uncertainty calculation
  // In production, would weight by contribution to total emissions
  return 0.15; // 15% default uncertainty
}

/**
 * Calculate total corporate emissions (Scope 1 + 2 + 3)
 * @param {object} scope1Data - Scope 1 activity data
 * @param {object} scope2Data - Scope 2 activity data
 * @param {object} scope3Data - Scope 3 activity data
 * @returns {object} Total emissions summary
 */
export function calculateTotalEmissions(scope1Data, scope2Data, scope3Data) {
  const scope1 = calculateScope1(scope1Data);
  const scope2 = calculateScope2(scope2Data);
  
  // Combine all Scope 3 categories
  const scope3Travel = scope3Data.travel ? calculateScope3BusinessTravel(scope3Data.travel) : { totalTonnesCO2e: 0 };
  const scope3Goods = scope3Data.purchasedGoods ? calculateScope3PurchasedGoods(scope3Data.purchasedGoods) : { totalTonnesCO2e: 0 };
  const scope3Waste = scope3Data.waste ? calculateScope3Waste(scope3Data.waste) : { totalTonnesCO2e: 0 };
  
  const scope3Total = scope3Travel.totalTonnesCO2e + scope3Goods.totalTonnesCO2e + scope3Waste.totalTonnesCO2e;
  
  const totalTonnesCO2e = scope1.totalTonnesCO2e + scope2.totalTonnesCO2e + scope3Total;

  return {
    totalTonnesCO2e,
    totalKgCO2e: totalTonnesCO2e * 1000,
    breakdown: {
      scope1: scope1.totalTonnesCO2e,
      scope2: scope2.totalTonnesCO2e,
      scope3: scope3Total,
    },
    percentages: {
      scope1: (scope1.totalTonnesCO2e / totalTonnesCO2e) * 100,
      scope2: (scope2.totalTonnesCO2e / totalTonnesCO2e) * 100,
      scope3: (scope3Total / totalTonnesCO2e) * 100,
    },
    details: {
      scope1,
      scope2,
      scope3: {
        travel: scope3Travel,
        purchasedGoods: scope3Goods,
        waste: scope3Waste,
      },
    },
    standard: 'GHG Protocol Corporate Standard',
    emissionFactors: 'DEFRA 2025',
    calculationDate: new Date().toISOString(),
  };
}

/**
 * Format emissions for display
 * @param {number} tonnesCO2e - Emissions in tonnes CO2e
 * @returns {string} Formatted string
 */
export function formatEmissions(tonnesCO2e) {
  if (tonnesCO2e >= 1000000) {
    return `${(tonnesCO2e / 1000000).toFixed(2)} Mt CO₂e`;
  } else if (tonnesCO2e >= 1000) {
    return `${(tonnesCO2e / 1000).toFixed(2)} kt CO₂e`;
  } else {
    return `${tonnesCO2e.toFixed(2)} t CO₂e`;
  }
}

export default {
  calculateScope1,
  calculateScope2,
  calculateScope3BusinessTravel,
  calculateScope3PurchasedGoods,
  calculateScope3Waste,
  calculatePCAFFinancedEmissions,
  calculateTotalEmissions,
  formatEmissions,
};
