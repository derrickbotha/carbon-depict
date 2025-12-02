export const scope2Config = {
    title: 'Energy Indirect Emissions Data Collection',
    description: 'Enter emissions from purchased electricity, heat, steam, and cooling',
    headerLabel: 'SCOPE 2',
    headerIcon: 'Zap', // Will be handled by the template mapping or import
    categories: [
        {
            id: 'purchasedElectricity',
            name: 'Purchased Electricity',
            description: 'Electricity purchased from the grid or suppliers',
            icon: '⚡',
        },
        {
            id: 'purchasedHeat',
            name: 'Purchased Heat/Steam',
            description: 'Heat or steam purchased from district systems or suppliers',
            icon: '♨️',
        },
        {
            id: 'purchasedCooling',
            name: 'Purchased Cooling',
            description: 'Cooling purchased from district cooling systems',
            icon: '❄️',
        },
        {
            id: 'transmissionLosses',
            name: 'T&D Losses',
            description: 'Transmission and distribution losses (optional)',
            icon: '🔌',
        },
    ],
    initialData: {
        purchasedElectricity: {
            'grid-electricity-kwh': { name: 'Grid Electricity (kWh)', value: '', unit: 'kWh', completed: false },
            'renewable-tariff': { name: 'Renewable Tariff (kWh)', value: '', unit: 'kWh', completed: false },
            'green-certificates': { name: 'Green Energy Certificates (kWh)', value: '', unit: 'kWh', completed: false },
            'supplier-name': { name: 'Electricity Supplier', value: '', unit: 'text', completed: false },
            'location-based': { name: 'Location-Based Method (kWh)', value: '', unit: 'kWh', completed: false },
            'market-based': { name: 'Market-Based Method (kWh)', value: '', unit: 'kWh', completed: false },
        },
        purchasedHeat: {
            'district-heating': { name: 'District Heating (kWh)', value: '', unit: 'kWh', completed: false },
            'purchased-steam': { name: 'Purchased Steam (kWh)', value: '', unit: 'kWh', completed: false },
            'biomass-heating': { name: 'Biomass District Heating (kWh)', value: '', unit: 'kWh', completed: false },
            'heat-supplier': { name: 'Heat/Steam Supplier', value: '', unit: 'text', completed: false },
        },
        purchasedCooling: {
            'district-cooling': { name: 'District Cooling (kWh)', value: '', unit: 'kWh', completed: false },
            'chilled-water': { name: 'Chilled Water (kWh)', value: '', unit: 'kWh', completed: false },
            'cooling-supplier': { name: 'Cooling Supplier', value: '', unit: 'text', completed: false },
        },
        transmissionLosses: {
            'td-losses-electricity': { name: 'T&D Losses - Electricity (kWh)', value: '', unit: 'kWh', completed: false },
            'td-losses-heat': { name: 'T&D Losses - Heat (kWh)', value: '', unit: 'kWh', completed: false },
        },
    },
    guidance: {
        purchasedElectricity: [
            'Location-based: Uses average grid emission factor for your region',
            'Market-based: Uses supplier-specific emission factor or renewable tariff',
            'If on a 100% renewable tariff, enter kWh in "Renewable Tariff" field',
            'Green certificates (RECs, GOs) reduce market-based emissions to zero for certified kWh',
            'Most organizations report both methods for transparency',
            'Check your electricity bill for kWh consumed (usually monthly or quarterly)',
        ],
        purchasedHeat: [
            'District heating systems provide heat to multiple buildings from a central source',
            'Check invoices from your district heating/steam provider',
            'Heat is typically measured in kWh or GJ (gigajoules)',
            'Biomass district heating has lower emission factors than fossil fuel systems',
            "If you generate your own heat, that's Scope 1 (not Scope 2)",
        ],
        purchasedCooling: [
            'District cooling systems provide chilled water for air conditioning',
            'Common in hot climates and dense urban areas',
            'Check your cooling provider\'s invoices for kWh or cooling tons',
            'If you use on-site chillers with purchased electricity, that\'s already in "Purchased Electricity"',
            'Only include if you purchase cooling as a service (not electricity to run your own AC)',
        ],
        transmissionLosses: [
            'T&D losses account for electricity lost during transmission from power plant to your site',
            'GHG Protocol allows (but doesn\'t require) reporting T&D losses separately',
            'DEFRA provides T&D loss factors (typically ~5-10% of purchased electricity)',
            'Simply enter the same kWh as "Purchased Electricity" - system will apply loss factors',
            'This is optional but recommended for comprehensive Scope 2 reporting',
        ],
    },
}
