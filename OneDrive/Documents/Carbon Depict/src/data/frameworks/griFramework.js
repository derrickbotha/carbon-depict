/**
 * GRI Standards 2021 - Complete Framework Specification
 * This file defines all GRI requirements for AI scoring
 */

export const GRI_FRAMEWORK = {
  meta: {
    name: 'GRI Standards 2021',
    version: '2021',
    organization: 'Global Reporting Initiative',
    description: 'The world\'s most widely used standards for sustainability reporting',
    url: 'https://www.globalreporting.org/standards',
  },

  /**
   * Universal Standards (GRI 1, 2, 3)
   */
  universalStandards: {
    // GRI 2: General Disclosures
    '2-1': {
      code: '2-1',
      title: 'Organizational details',
      requirement: 'Report the legal name of the organization, nature of ownership, legal form, location of headquarters, and countries of operation',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 50,
      scoringCriteria: [
        'Legal name clearly stated',
        'Nature of ownership explained (public, private, cooperative, etc.)',
        'Legal form specified (corporation, partnership, etc.)',
        'Headquarters location with address',
        'List of countries where operations are located',
      ],
      examples: [
        'ABC Corporation is a publicly traded company (NYSE: ABC), legally incorporated as a C-Corporation in Delaware, USA. Our headquarters are located at 123 Main Street, New York, NY 10001. We operate in 25 countries across North America, Europe, Asia, and Latin America...',
      ],
    },
    
    '2-2': {
      code: '2-2',
      title: 'Entities included in sustainability reporting',
      requirement: 'List all entities included in the sustainability report and explain if any entities from financial reporting are excluded',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 30,
      scoringCriteria: [
        'Complete list of entities/subsidiaries included',
        'Explanation of reporting boundary',
        'Any exclusions from financial reporting explained',
        'Reasons for exclusions provided',
        'Statement of consistency with financial reporting',
      ],
      examples: [
        'This report covers all entities within our corporate group, including our parent company and 15 wholly-owned subsidiaries in North America and Europe. The reporting boundary is consistent with our consolidated financial statements. Joint ventures where we have less than 50% ownership are excluded...',
      ],
    },

    '2-3': {
      code: '2-3',
      title: 'Reporting period, frequency and contact point',
      requirement: 'Report the reporting period, frequency of publication, publication date, and contact point for questions',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 20,
      scoringCriteria: [
        'Clear reporting period (e.g., Jan 1 - Dec 31, 2024)',
        'Frequency stated (annual, biennial)',
        'Publication date provided',
        'Contact point with email/phone',
        'Date of previous report mentioned',
      ],
      examples: [
        'This report covers the period January 1, 2024 to December 31, 2024. We publish our sustainability report annually, typically in Q1 following the reporting year. This report was published on March 15, 2025. For questions contact: sustainability@company.com',
      ],
    },

    '2-4': {
      code: '2-4',
      title: 'Restatements of information',
      requirement: 'Report any restatements of information from previous reports and explain reasons',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 20,
      scoringCriteria: [
        'Clear statement of any restatements',
        'Specific data points that were restated',
        'Reasons for restatements explained',
        'Impact of restatements quantified',
        'If no restatements, explicitly state this',
      ],
      examples: [
        'We have restated our 2023 Scope 3 emissions data due to improved calculation methodology. Previous figure of 15,000 tCO2e has been revised to 18,500 tCO2e (+23%). This change reflects better supplier data and expanded category coverage. No other restatements were required.',
      ],
    },

    '2-5': {
      code: '2-5',
      title: 'External assurance',
      requirement: 'Describe the policy and practice for seeking external assurance, including whether and how the highest governance body is involved',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 50,
      scoringCriteria: [
        'External assurance policy described',
        'Scope of assurance (full report, specific metrics)',
        'Assurance standard used (ISAE 3000, AA1000AS)',
        'Assurance provider named',
        'Level of assurance (limited, reasonable)',
        'Governance body involvement explained',
        'Assurance statement referenced or included',
      ],
      examples: [
        'We seek limited external assurance for our GHG emissions data (Scope 1, 2, 3) annually. EY provides assurance using ISAE 3000 standard. Our Board Audit Committee reviews and approves the scope of assurance. The full assurance statement is available in Appendix A. We plan to expand assurance to social metrics by 2026.',
      ],
    },

    '2-6': {
      code: '2-6',
      title: 'Activities, value chain and other business relationships',
      requirement: 'Report activities, products, services, markets, supply chain, and downstream entities',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 100,
      scoringCriteria: [
        'Sector and industry described',
        'Products and services listed',
        'Markets served described',
        'Supply chain overview provided',
        'Number of suppliers or key supplier types',
        'Downstream distribution channels explained',
        'Significant changes from previous year noted',
      ],
      examples: [
        'We are a consumer electronics manufacturer specializing in smartphones and tablets. Our products are sold in 50+ countries through retail partners and direct online channels. Our supply chain includes 200+ tier-1 suppliers primarily in Asia (semiconductors, displays, batteries) and regional assembly partners. We work with 5 global distribution partners and 1,000+ retail stores...',
      ],
    },

    '2-7': {
      code: '2-7',
      title: 'Employees',
      requirement: 'Report total number of employees by gender, region, and permanent/temporary status',
      pillar: 'social',
      mandatory: true,
      expectedFormat: 'quantitative',
      minimumWords: 30,
      scoringCriteria: [
        'Total headcount provided',
        'Breakdown by gender (male, female, non-binary)',
        'Breakdown by region or country',
        'Permanent vs temporary employees',
        'Full-time vs part-time employees',
        'Any significant fluctuations explained',
        'Data collection methodology noted',
      ],
      examples: [
        'As of December 31, 2024, we employed 5,450 people globally. Gender breakdown: 3,200 male (59%), 2,150 female (39%), 100 non-binary (2%). Regional breakdown: North America 2,500, Europe 1,800, Asia 1,150. Employment type: 5,100 permanent (94%), 350 temporary (6%). All figures are full-time equivalents (FTE).',
      ],
    },

    '2-9': {
      code: '2-9',
      title: 'Governance structure and composition',
      requirement: 'Report governance structure, committees, and composition of highest governance body',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 80,
      scoringCriteria: [
        'Board structure described (unitary, two-tier)',
        'Number of directors',
        'Committee structure (Audit, Remuneration, Sustainability)',
        'Board composition by gender',
        'Board independence percentage',
        'Executive vs non-executive directors',
        'Board diversity metrics',
        'Term limits or tenure explained',
      ],
      examples: [
        'Our Board comprises 12 directors: 3 executive and 9 non-executive (75% independent). Gender composition: 7 male, 5 female (42% women). Board committees include Audit (4 members), Remuneration (4), Nomination (3), and Sustainability (5). Average tenure is 6 years with a maximum term of 9 years. The Sustainability Committee oversees ESG strategy and reports quarterly to the full Board.',
      ],
    },

    '2-22': {
      code: '2-22',
      title: 'Statement on sustainable development strategy',
      requirement: 'Statement from the highest decision-maker about the relevance of sustainable development to the organization and its strategy',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 150,
      scoringCriteria: [
        'Signed statement from CEO or Board Chair',
        'Link between sustainability and business strategy',
        'Material sustainability topics addressed',
        'Long-term commitments or targets mentioned',
        'Stakeholder considerations discussed',
        'Challenges and opportunities identified',
        'Tone of leadership commitment',
      ],
      examples: [
        'Dear Stakeholders, Sustainability is not just a responsibility—it is central to our business strategy and long-term value creation. In 2024, we made significant progress toward our Net Zero 2050 commitment, reducing Scope 1 and 2 emissions by 15%. However, we recognize challenges remain in Scope 3 and circular economy. Our investments in renewable energy, sustainable product design, and supply chain engagement reflect our commitment to the Paris Agreement and the SDGs. I am personally committed to ensuring sustainability is embedded in every business decision. - Jane Doe, CEO',
      ],
    },

    '2-23': {
      code: '2-23',
      title: 'Policy commitments',
      requirement: 'Describe policy commitments for responsible business conduct',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 60,
      scoringCriteria: [
        'Human rights policy referenced',
        'Labor standards policy referenced',
        'Environmental policy referenced',
        'Anti-corruption policy referenced',
        'Links to internationally recognized standards (UN Guiding Principles, ILO, OECD)',
        'Board/executive approval noted',
        'Public availability stated',
        'Date of last update',
      ],
      examples: [
        'We are committed to the UN Global Compact, UN Guiding Principles on Business and Human Rights, and ILO core conventions. Our policies include: Human Rights Policy (updated 2023), Environmental Policy (2024), Anti-Corruption Policy (2023), and Supplier Code of Conduct (2024). All policies are approved by the Board and publicly available on our website. We conduct annual training for all employees.',
      ],
    },

    '2-27': {
      code: '2-27',
      title: 'Compliance with laws and regulations',
      requirement: 'Report total number and monetary value of significant fines for non-compliance',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'quantitative',
      minimumWords: 30,
      scoringCriteria: [
        'Number of significant fines reported',
        'Monetary value provided',
        'Nature of violations described',
        'Corrective actions taken',
        'If zero, explicitly state no fines',
        'Definition of "significant" explained',
      ],
      examples: [
        'In 2024, we received zero significant fines for non-compliance with environmental, social, or governance laws and regulations. We define "significant" as fines exceeding $10,000 or resulting in operational restrictions. We had 3 minor safety violations ($5,000 total) that were immediately remediated.',
      ],
    },

    // GRI 3: Material Topics
    '3-1': {
      code: '3-1',
      title: 'Process to determine material topics',
      requirement: 'Describe the process used to determine material topics',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 100,
      scoringCriteria: [
        'Stakeholder engagement process described',
        'Stakeholder groups consulted listed',
        'Impact assessment methodology explained',
        'Prioritization criteria provided',
        'Timeline or frequency of materiality assessment',
        'Internal vs external perspective balanced',
        'Alignment with GRI/SASB/double materiality noted',
      ],
      examples: [
        'We conducted our materiality assessment in Q3 2024, engaging 15 stakeholder groups including employees (500+ surveyed), customers (focus groups), investors (interviews), suppliers (50+ surveyed), NGOs (3 partnerships), and regulators. We assessed topics using double materiality: impact materiality (our impact on society/environment) and financial materiality (impact on enterprise value). Topics were scored 1-5 on both dimensions. The Board Sustainability Committee approved the final list of 12 material topics.',
      ],
    },

    '3-2': {
      code: '3-2',
      title: 'List of material topics',
      requirement: 'List all material topics identified',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'list',
      minimumWords: 40,
      scoringCriteria: [
        'Complete list of material topics',
        'Topics grouped by E/S/G',
        'Changes from previous year noted',
        'Link to GRI topic-specific standards',
        'Rationale for material topics',
      ],
      examples: [
        'Our 12 material topics: Environmental: (1) Climate change & GHG emissions, (2) Energy management, (3) Waste & circular economy, (4) Water stewardship. Social: (5) Labor practices & human rights, (6) Diversity & inclusion, (7) Health & safety, (8) Community engagement. Governance: (9) Business ethics & anti-corruption, (10) Data privacy & security, (11) Sustainable supply chain, (12) Board diversity & oversight. New in 2024: Water stewardship (due to drought impacts).',
      ],
    },

    '3-3': {
      code: '3-3',
      title: 'Management of material topics',
      requirement: 'For each material topic, describe policies, commitments, goals, responsibilities, and actions',
      pillar: 'governance',
      mandatory: true,
      expectedFormat: 'text',
      minimumWords: 60,
      scoringCriteria: [
        'Policies and commitments for each topic',
        'Specific goals and targets',
        'Responsibilities assigned (roles/committees)',
        'Actions taken during reporting period',
        'Effectiveness of management approach',
        'Stakeholder engagement in management',
      ],
      examples: [
        'Climate Change: Policy: Net Zero by 2050. Goals: -50% emissions by 2030 (vs 2020), SBTi-approved targets. Responsibility: Chief Sustainability Officer, Board Sustainability Committee. Actions in 2024: Installed 5MW solar, switched to renewable electricity tariff (90% coverage), engaged top 50 suppliers on emissions. Effectiveness: On track for 2030 target.',
      ],
    },

    // GRI 305: Emissions (Topic-Specific)
    '305-1': {
      code: '305-1',
      title: 'Direct (Scope 1) GHG emissions',
      requirement: 'Report gross direct (Scope 1) GHG emissions in metric tons of CO2 equivalent',
      pillar: 'environmental',
      mandatory: false,
      expectedFormat: 'quantitative',
      minimumWords: 40,
      scoringCriteria: [
        'Total Scope 1 emissions (tCO2e) reported',
        'Breakdown by source (combustion, process, fugitive)',
        'Gases included (CO2, CH4, N2O, HFCs, etc.)',
        'Calculation methodology (GHG Protocol, ISO 14064)',
        'Emission factors source (DEFRA, EPA, etc.)',
        'Year-over-year comparison',
        'Exclusions explained',
      ],
      examples: [
        'Scope 1 emissions (2024): 12,450 tCO2e. Breakdown: Stationary combustion 8,200 tCO2e (natural gas), Mobile combustion 3,800 tCO2e (fleet vehicles), Fugitive emissions 450 tCO2e (refrigerants). Methodology: GHG Protocol Corporate Standard. Emission factors: DEFRA 2024. Gases: CO2, CH4, N2O, HFCs. YoY change: -8% (vs 2023: 13,500 tCO2e).',
      ],
    },

    '305-2': {
      code: '305-2',
      title: 'Energy indirect (Scope 2) GHG emissions',
      requirement: 'Report gross location-based and market-based Scope 2 GHG emissions',
      pillar: 'environmental',
      mandatory: false,
      expectedFormat: 'quantitative',
      minimumWords: 40,
      scoringCriteria: [
        'Location-based Scope 2 (tCO2e) reported',
        'Market-based Scope 2 (tCO2e) reported',
        'Electricity consumption (MWh) reported',
        'Renewable energy percentage',
        'Calculation methodology explained',
        'Grid emission factors source',
        'RECs/GOs specified if used',
      ],
      examples: [
        'Scope 2 emissions (2024): Location-based: 15,600 tCO2e, Market-based: 3,200 tCO2e. Electricity consumption: 35,000 MWh. Renewable energy: 90% (via renewable tariff + RECs). Methodology: GHG Protocol Scope 2 Guidance. Grid factors: IEA 2024. Market-based reflects our renewable procurement reducing emissions by 79%.',
      ],
    },

    '305-3': {
      code: '305-3',
      title: 'Other indirect (Scope 3) GHG emissions',
      requirement: 'Report gross other indirect (Scope 3) GHG emissions',
      pillar: 'environmental',
      mandatory: false,
      expectedFormat: 'quantitative',
      minimumWords: 60,
      scoringCriteria: [
        'Total Scope 3 emissions (tCO2e) reported',
        'Categories included (1-15 from GHG Protocol)',
        'Calculation methodology per category',
        'Data sources and quality',
        'Most significant categories identified',
        'Exclusions explained',
        'Year-over-year comparison',
      ],
      examples: [
        'Scope 3 emissions (2024): 185,000 tCO2e. Categories: Cat 1 (Purchased goods) 120,000 tCO2e (65%), Cat 3 (Fuel & energy) 8,500 tCO2e, Cat 4 (Upstream transport) 12,000 tCO2e, Cat 6 (Business travel) 4,500 tCO2e, Cat 7 (Commuting) 15,000 tCO2e, Cat 11 (Use of products) 25,000 tCO2e. Methodology: GHG Protocol Scope 3 Standard, spend-based and activity-based. YoY: +5% (category 1 increased due to revenue growth).',
      ],
    },

    '305-4': {
      code: '305-4',
      title: 'GHG emissions intensity',
      requirement: 'Report GHG emissions intensity ratio',
      pillar: 'environmental',
      mandatory: false,
      expectedFormat: 'quantitative',
      minimumWords: 30,
      scoringCriteria: [
        'Intensity ratio reported (e.g., tCO2e per $M revenue)',
        'Denominator explained (revenue, production, FTE)',
        'Scopes included in numerator',
        'Year-over-year comparison',
        'Normalization to business growth',
      ],
      examples: [
        'GHG intensity (2024): 42.5 tCO2e per $M revenue (Scope 1+2+3). Denominator: Total revenue $5.0B. YoY: -12% (2023: 48.2 tCO2e/$M). Despite 8% revenue growth, absolute emissions remained flat, demonstrating decoupling of emissions from business growth.',
      ],
    },

    '305-5': {
      code: '305-5',
      title: 'Reduction of GHG emissions',
      requirement: 'Report GHG emissions reduced as a direct result of reduction initiatives',
      pillar: 'environmental',
      mandatory: false,
      expectedFormat: 'quantitative',
      minimumWords: 60,
      scoringCriteria: [
        'Total reductions achieved (tCO2e)',
        'Specific initiatives listed',
        'Quantified impact per initiative',
        'Scopes covered',
        'Baseline year and comparison',
        'Calculation methodology',
        'Future reduction plans',
      ],
      examples: [
        'Emissions reductions (2024): 2,800 tCO2e. Initiatives: (1) Solar installation: -1,200 tCO2e, (2) LED lighting retrofit: -300 tCO2e, (3) Fleet electrification: -800 tCO2e, (4) Employee commute program: -500 tCO2e. Methodology: GHG Protocol. Baseline: 2020. Cumulative reduction since 2020: 18%. Additional 5,000 tCO2e planned for 2025 via renewable energy expansion.',
      ],
    },

    // GRI 405: Diversity
    '405-1': {
      code: '405-1',
      title: 'Diversity of governance bodies and employees',
      requirement: 'Report percentage of individuals in governance bodies and employees by gender, age group, and other diversity indicators',
      pillar: 'social',
      mandatory: false,
      expectedFormat: 'quantitative',
      minimumWords: 50,
      scoringCriteria: [
        'Board diversity by gender (%)',
        'Board diversity by age group (%)',
        'Employee diversity by gender (%)',
        'Employee diversity by age group (%)',
        'Other diversity indicators (ethnicity, disability) if applicable',
        'Breakdown by employee category (executives, managers, staff)',
        'Year-over-year trends',
      ],
      examples: [
        'Board diversity: 42% women, 58% men. Age: <30: 0%, 30-50: 33%, >50: 67%. Employee diversity: 39% women, 59% men, 2% non-binary. Age: <30: 28%, 30-50: 58%, >50: 14%. Leadership (VP+): 35% women. Ethnicity (US): 45% White, 25% Asian, 18% Hispanic, 10% Black, 2% Other. YoY: +3pp women in leadership.',
      ],
    },

    '405-2': {
      code: '405-2',
      title: 'Ratio of basic salary and remuneration of women to men',
      requirement: 'Report ratio of basic salary and remuneration of women to men for each employee category',
      pillar: 'social',
      mandatory: false,
      expectedFormat: 'quantitative',
      minimumWords: 40,
      scoringCriteria: [
        'Pay ratio for each employee category',
        'Categories defined (executives, managers, staff)',
        'Methodology explained (median, mean)',
        'Significance of operations or regions specified',
        'Year-over-year trends',
        'Actions to close pay gaps',
      ],
      examples: [
        'Gender pay ratio (women:men, median base salary): Executives: 0.97:1, Managers: 0.98:1, Staff: 1.00:1. Methodology: Median base salary for same role, same location, same experience. No significant pay gap identified. We conduct annual pay equity audits. YoY: Improved from 0.95:1 to 0.97:1 for executives through targeted salary adjustments.',
      ],
    },
  },

  /**
   * Scoring Weights
   */
  scoringWeights: {
    mandatoryDisclosures: 0.6, // 60% weight for mandatory items
    recommendedDisclosures: 0.3, // 30% weight for material/recommended items
    qualityFactors: 0.1, // 10% weight for quality (completeness, evidence, clarity)
  },

  /**
   * Quality Scoring Criteria
   */
  qualityFactors: {
    completeness: {
      weight: 0.4,
      criteria: 'All required sub-elements addressed',
    },
    evidence: {
      weight: 0.3,
      criteria: 'Quantitative data, specific examples, verifiable claims',
    },
    clarity: {
      weight: 0.2,
      criteria: 'Clear language, well-structured, easy to understand',
    },
    comparability: {
      weight: 0.1,
      criteria: 'Year-over-year data, industry benchmarks, targets',
    },
  },
};

export default GRI_FRAMEWORK;
