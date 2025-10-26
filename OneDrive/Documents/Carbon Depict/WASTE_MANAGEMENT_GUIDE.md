# Waste Management Data Collection - Comprehensive Guide

## Overview
The Waste Management Collection form captures comprehensive waste data across the full waste hierarchy, from generation through disposal, aligned with all 6 major ESG frameworks. This guide provides detailed explanations of metrics, zero waste goals, circular economy indicators, and framework compliance requirements.

---

## Table of Contents
1. [Framework Alignment](#framework-alignment)
2. [Data Categories](#data-categories)
3. [Automated Calculations](#automated-calculations)
4. [Key Metrics & KPIs](#key-metrics--kpis)
5. [Zero Waste Certification](#zero-waste-certification)
6. [Industry Benchmarks](#industry-benchmarks)
7. [Data Collection Best Practices](#data-collection-best-practices)
8. [Implementation Roadmap](#implementation-roadmap)

---

## Framework Alignment

### GRI 306: Waste (2020)
**Comprehensive waste management standard covering the full waste lifecycle**

#### GRI 306-1: Waste generation and significant waste-related impacts
- **Requirements:**
  - Inputs, activities, and outputs leading to waste generation
  - Significant waste-related impacts (actual and potential)
  - How waste-related impacts are managed

**Data Points in Form:**
- Waste prevention policy
- Waste reduction targets
- Zero waste commitment
- Product design for circularity
- Product take-back programs

#### GRI 306-2: Management of significant waste-related impacts
- **Requirements:**
  - Actions to prevent waste generation
  - Actions to manage waste-related impacts
  - Circular economy approaches

**Data Points in Form:**
- Waste prevention policy
- Waste audits completed
- Waste minimization investment
- Circular economy metrics
- Extended Producer Responsibility (EPR) programs

#### GRI 306-3: Waste generated
- **Requirements:**
  - Total weight of waste generated (metric tonnes)
  - Breakdown by composition (hazardous, non-hazardous)
  - Contextual information about methodology

**Data Points in Form:**
- Total waste generated
- Hazardous waste
- Non-hazardous waste
- Waste by material type (8 categories: organic, plastic, paper, metal, glass, e-waste, construction, textile)
- Waste generation change (YoY %)

**Calculation Formula:**
```
Total Waste = Hazardous Waste + Non-Hazardous Waste

OR

Total Waste = Sum of all material types (if broken down)
```

#### GRI 306-4: Waste diverted from disposal
- **Requirements:**
  - Total weight diverted from disposal (metric tonnes)
  - Breakdown by recovery operation:
    - Preparation for reuse
    - Recycling
    - Other recovery operations

**Data Points in Form:**
- Waste recycled
- Waste composted
- Waste reused
- Waste recovered (energy recovery)
- Hazardous waste recovered
- Hazardous waste treated on-site

**Calculation Formula:**
```
Waste Diverted = Recycled + Composted + Reused + Recovered

Diversion Rate = (Waste Diverted / Total Waste) × 100
```

#### GRI 306-5: Waste directed to disposal
- **Requirements:**
  - Total weight directed to disposal (metric tonnes)
  - Breakdown by disposal operation:
    - Incineration (with or without energy recovery)
    - Landfilling
    - Other disposal operations

**Data Points in Form:**
- Waste incinerated (without energy recovery)
- Waste landfilled
- Hazardous waste incinerated
- Hazardous waste landfilled
- Hazardous waste transferred off-site

**Calculation Formula:**
```
Waste to Disposal = Incinerated + Landfilled

Landfill Rate = (Landfilled / Total Waste) × 100
```

---

### CSRD E5: Resource Use and Circular Economy
**European Sustainability Reporting Standards for waste and circularity**

#### E5-5: Resource inflows, outflows and waste
- Total weight of waste generated
- Waste diverted from disposal vs. directed to disposal
- Hazardous vs. non-hazardous waste
- Waste by material type

**Data Points in Form:**
- All waste generation metrics
- All diversion and disposal metrics
- Waste intensity metrics
- Circular economy indicators

#### Circular Economy Metrics (E5-5)
- Recycled input materials as % of total inputs
- Products designed for circularity
- Recyclable content in products
- Product take-back rates
- Packaging reduction

**Data Points in Form:**
- Product design circularity
- Recyclable content products (%)
- Recycled input materials (%)
- Product take-back program
- Packaging reduction (%)
- Product take-back rate (%)
- Packaging recovery rate (%)

---

### CDP: Waste Disclosure (W6)
**Carbon Disclosure Project waste reporting**

#### W6: Waste Management
- Total waste generated and breakdown
- Waste diverted from landfill
- Waste reduction initiatives
- Zero waste commitments

**Data Points in Form:**
- Total waste generated
- Waste diverted from disposal
- Waste to landfill
- Zero waste commitment
- Waste reduction targets

---

### SDG 12: Responsible Consumption and Production
**UN Sustainable Development Goal for waste**

#### Target 12.3: Halve food waste
- Food waste generation and diversion
- Food donation programs
- Food waste reduction targets

**Data Points in Form:**
- Food waste generated
- Food waste diverted
- Food donated
- Food composted

#### Target 12.4: Chemicals and waste management
- Hazardous waste generation
- Safe management of hazardous waste
- Minimize releases to air, water, soil

**Data Points in Form:**
- Hazardous waste (all metrics)
- Hazardous waste treatment methods
- Compliance with waste regulations

#### Target 12.5: Reduce waste generation
- Prevention, reduction, recycling, reuse
- Waste diversion rate
- Zero waste goals

**Data Points in Form:**
- Waste diversion rate
- Recycling rate
- Zero waste commitment
- Waste prevention initiatives

#### Target 12.6: Sustainable practices and reporting
- Adopt sustainable practices
- Integrate sustainability information into reporting

**Data Points in Form:**
- All waste disclosure metrics
- Waste reduction targets
- Circular economy practices

---

### TCFD: Waste-Related Transition Risks
**Task Force on Climate-related Financial Disclosures**

#### Transition Risks
- Regulatory risks (Extended Producer Responsibility, plastic taxes)
- Market risks (consumer demand for sustainable packaging)
- Technology risks (circular economy innovations)

**Data Points in Form:**
- EPR compliance programs
- Plastic reduction targets
- Circular economy investments
- Supply chain waste risks

---

### SBTi: Waste Intensity Targets
**Science Based Targets Initiative**

#### Waste Intensity Reduction
- Waste per revenue targets
- Waste per production unit targets
- Baseline year and target year

**Data Points in Form:**
- Waste intensity (revenue, production)
- Baseline year
- Intensity reduction target (%)

---

## Data Categories

### 1. Waste Generation
**Purpose:** Track total waste generated and year-over-year trends

#### Key Fields:
- **Total Waste Generated:** Complete volume from all operations (metric tonnes)
- **Hazardous Waste:** Waste with hazardous characteristics (toxic, flammable, corrosive, reactive)
- **Non-Hazardous Waste:** General waste without hazardous properties
- **Waste Generation Change:** Year-over-year percentage change

#### Classification (UN Basel Convention):
- **Hazardous Waste:** Contains substances that pose risks to human health or environment
  - Examples: Chemicals, batteries, electronic waste, medical waste, asbestos, oils
- **Non-Hazardous Waste:** Does not exhibit hazardous characteristics
  - Examples: Office paper, food waste, packaging, construction debris

#### Best Practices:
- Install weighing systems at waste collection points
- Use waste tracking software (e.g., Encamp, VelocityEHS)
- Conduct quarterly waste audits
- Track waste by source (operations, offices, cafeteria)
- Monitor trends to identify reduction opportunities

---

### 2. Waste by Material Type
**Purpose:** Understand waste composition for targeted reduction and recycling

#### Material Categories:

**Organic/Food Waste:**
- Food scraps, kitchen waste, garden waste
- Highly compostable, anaerobic digestion potential
- Target: Divert 100% through composting or anaerobic digestion

**Plastic Waste:**
- All plastic types (PET, HDPE, PVC, LDPE, PP, PS)
- Single-use plastics are high priority for elimination
- Target: 100% recycled or eliminated

**Paper & Cardboard:**
- Office paper, cardboard boxes, magazines
- Highly recyclable material
- Target: 95%+ recycling rate

**Metal Waste:**
- Aluminum, steel, copper, mixed metals
- High recycling value
- Target: 100% recycling

**Glass Waste:**
- Glass containers, windows, broken glass
- Infinitely recyclable
- Target: 95%+ recycling rate

**Electronic Waste (E-Waste):**
- Computers, monitors, phones, batteries
- Contains valuable and hazardous materials
- Target: 100% responsible recycling through certified e-waste recyclers

**Construction & Demolition Waste:**
- Concrete, wood, drywall, metals
- Large volume, high diversion potential
- Target: 75%+ diversion through recycling and reuse

**Textile Waste:**
- Uniforms, rags, fabric scraps
- Donation and recycling opportunities
- Target: 50%+ diversion through donation and textile recycling

#### Best Practices:
- Conduct waste composition studies (annually)
- Implement source separation systems
- Label waste bins clearly by material type
- Track each material separately
- Set material-specific diversion targets

---

### 3. Waste Diversion & Recovery
**Purpose:** Maximize waste diverted from landfill following the waste hierarchy

#### Waste Hierarchy (Priority Order):
1. **Prevention:** Most preferred
2. **Reuse:** Repair, refurbish, donate
3. **Recycling:** Material recovery
4. **Recovery:** Energy recovery
5. **Disposal:** Least preferred (incineration without energy recovery, landfill)

#### Recovery Operations:

**Waste Recycled:**
- Material recovered for manufacturing new products
- Examples: Paper to paper, plastic to plastic, metal to metal
- Preferred option after prevention and reuse

**Waste Composted:**
- Organic waste converted to compost or soil amendment
- Aerobic decomposition process
- Excellent for food waste and yard waste

**Waste Reused:**
- Items used again for original or different purpose without reprocessing
- Examples: Pallets, containers, equipment
- Second-highest priority in waste hierarchy

**Waste Recovered (Energy Recovery):**
- Waste converted to energy through combustion, gasification, or anaerobic digestion
- Lower priority than recycling
- Better than landfill if recycling not viable

**Waste Incinerated (without energy recovery):**
- Waste burned without capturing energy
- Disposal method, not recovery
- Minimize through better waste management

**Waste Landfilled:**
- Least preferred option in waste hierarchy
- Target: Zero or near-zero landfill
- Reduce through comprehensive waste reduction and diversion programs

#### Calculation: Waste Diversion Rate
```
Waste Diverted = Recycled + Composted + Reused + Recovered

Diversion Rate = (Waste Diverted / Total Waste) × 100
```

#### Performance Levels:
- **Zero Waste (≥90%):** World-class performance, certified zero waste
- **Excellent (75-89%):** Strong diversion, leadership performance
- **Good (50-74%):** Above average, clear improvement trajectory
- **Fair (25-49%):** Below average, significant improvement needed
- **Poor (<25%):** Minimal diversion, urgent action required

#### Best Practices:
- Implement comprehensive recycling programs
- Partner with certified recyclers and composters
- Track diversion rate monthly
- Set progressive diversion targets (e.g., 50% → 75% → 90%)
- Pursue Zero Waste certification (TRUE, UL 2799)

---

### 4. Hazardous Waste Management
**Purpose:** Ensure safe, compliant handling of hazardous waste

#### Hazardous Waste Handling Methods:

**Incineration:**
- High-temperature destruction of hazardous chemicals
- Requires specialized facilities
- Track volume and verify proper permits

**Landfilling:**
- Hazardous waste landfills with containment systems
- Last resort after treatment options exhausted
- Minimize through waste prevention and treatment

**Recovery:**
- Recycling of hazardous materials (e.g., solvents, oils)
- Preferred option when technically and economically feasible
- Track recovery rate for hazardous waste

**Transferred Off-Site:**
- Sent to specialized treatment facilities
- Must track using hazardous waste manifests
- Verify receiving facility credentials and compliance

**Treated On-Site:**
- Neutralization, stabilization, or other treatment
- Requires permits and compliance monitoring
- Document treatment efficiency

#### Regulatory Compliance:
- **US:** RCRA (Resource Conservation and Recovery Act)
- **EU:** Waste Framework Directive, Basel Convention
- **Global:** UN Basel Convention on transboundary movements

#### Best Practices:
- Maintain hazardous waste inventory
- Use EPA hazardous waste manifest system (US) or equivalent
- Conduct annual hazardous waste audits
- Train employees on hazardous waste handling
- Minimize hazardous waste generation at source
- Track cradle-to-grave using waste tracking numbers

---

### 5. Circular Economy
**Purpose:** Measure transition from linear to circular economy

#### Circular Economy Principles:
1. **Design out waste:** Products designed for disassembly, repair, reuse
2. **Keep materials in use:** Maximum value through product lifetime
3. **Regenerate natural systems:** Return biological nutrients safely

#### Circularity Metrics:

**Product Design for Circularity:**
- **All Products:** 100% designed for circularity (leading practice)
- **Most Products:** >75% (strong performance)
- **Some Products:** 25-75% (developing)
- **None:** <25% (opportunity for improvement)

Design principles:
- Design for disassembly
- Modular design for easy repair
- Use of mono-materials (easier recycling)
- Minimize mixed materials
- Standardized components

**Recyclable Content in Products (%):**
- Percentage of products that can be recycled at end of life
- Target: 100% recyclable content
- Track through product design database

**Recycled Input Materials (%):**
- Percentage of raw materials that are recycled/recovered content
- Aligned with GRI 301-2
- Target: Progressive increase (e.g., 10% → 25% → 50%)

**Product Take-Back Programs:**
- **Comprehensive:** All products, all geographies
- **Limited:** Select products or regions
- **Pilot:** Testing phase
- **No:** Opportunity for implementation

**Packaging Reduction (%):**
- Year-over-year reduction in packaging material weight
- Includes lightweighting and elimination initiatives
- Target: 30-50% reduction over 5 years

#### Circularity Score Calculation:
```
Circularity Score = 
  (Recycled Input % × 0.25) +
  (Recyclable Content % × 0.25) +
  (Packaging Reduction % × 0.25) +
  (Product Take-Back Rate % × 0.25)

Score Range: 0-100

Levels:
- Leading: 80-100
- Advanced: 60-79
- Developing: 40-59
- Basic: 20-39
- Initial: 0-19
```

#### Best Practices:
- Conduct product circularity assessments
- Apply circular design principles to new products
- Increase post-consumer recycled content
- Implement product-as-a-service models
- Partner with recyclers for closed-loop systems

---

### 6. Waste Intensity
**Purpose:** Normalize waste data for efficiency tracking and benchmarking

#### Intensity Metrics:

**Waste per Revenue:**
```
Waste Intensity (Revenue) = Total Waste (tonnes) / Revenue (M USD)
Unit: Tonnes per million USD revenue
```

**Waste per Production Unit:**
```
Waste Intensity (Production) = Total Waste (tonnes) / Production Volume
Unit: Tonnes per production unit (varies by industry)
```

**Waste per Employee:**
```
Waste Intensity (Employee) = Total Waste (tonnes) / Number of Employees
Unit: Tonnes per employee
```

#### Target Setting:
- Establish baseline year (typically 3-5 years historical)
- Set intensity reduction target (e.g., 25% by 2030)
- Align with SBTi or sector-specific targets
- Track progress annually
- Adjust for acquisitions/divestitures

#### Industry Benchmarks:
- **Manufacturing:** 5-50 tonnes per M USD revenue
- **Food & Beverage:** 10-100 tonnes per M USD revenue
- **Retail:** 2-20 tonnes per M USD revenue
- **Technology:** 1-10 tonnes per M USD revenue
- **Healthcare:** 5-30 tonnes per M USD revenue

#### Best Practices:
- Use consistent denominator over time
- Report both absolute and intensity metrics
- Explain significant changes in intensity
- Set science-based intensity targets
- Benchmark against industry peers

---

### 7. Waste Prevention & Reduction
**Purpose:** Document policies, targets, and proactive waste minimization

#### Waste Prevention Policy:
- **Board Approved:** Highest governance level, public disclosure
- **Management Approved:** Senior leadership commitment
- **In Development:** Under internal review
- **No Policy:** Gap requiring attention

Policy should include:
- Waste prevention hierarchy commitment
- Zero waste goals and timelines
- Circular economy principles
- Roles and responsibilities
- Performance metrics and reporting

#### Waste Reduction Targets:
- **Absolute:** Total waste reduction (e.g., reduce by 50% by 2030)
- **Intensity:** Efficiency improvement (e.g., reduce tonnes per M USD by 30%)
- **Both:** Comprehensive approach
- **No Targets:** Requires target setting

Target best practices:
- Align with science-based methodologies
- Set short-term (3 years) and long-term (10 years) targets
- Include interim milestones
- Apply to all waste streams
- Publicly disclose and report progress annually

#### Zero Waste Commitment:
- **Certified:** Achieved third-party zero waste certification (TRUE, UL 2799)
- **Committed:** Formal commitment, pursuing certification
- **Planned:** Evaluating zero waste pathway
- **No:** Opportunity to commit

Zero Waste Definition (TRUE certification):
- ≥90% waste diversion from landfill and incineration (without energy recovery)
- Comprehensive waste reduction and diversion programs
- Third-party verification

#### Waste Audits:
- Frequency: Quarterly or annually
- Purpose: Identify waste streams, contamination, diversion opportunities
- Process: Sort and weigh waste samples, analyze composition
- Output: Waste audit report with improvement recommendations

#### Waste Minimization Investment:
- Capital expenditures on waste reduction infrastructure
- Examples: Recycling equipment, composting systems, reusable packaging
- Track ROI: Waste disposal cost savings vs. investment
- Typical payback period: 2-5 years

#### Best Practices:
- Secure board-level approval for waste policy
- Set SMART targets (Specific, Measurable, Achievable, Relevant, Time-bound)
- Commit to zero waste goals publicly
- Conduct annual waste audits
- Invest in waste infrastructure (3-5% of CapEx for waste-intensive industries)
- Engage employees in waste reduction initiatives

---

### 8. Food Waste (if applicable)
**Purpose:** Track and reduce food loss and waste (SDG Target 12.3)

#### SDG Target 12.3:
"By 2030, halve per capita global food waste at the retail and consumer levels and reduce food losses along production and supply chains, including post-harvest losses."

#### Food Waste Metrics:

**Food Waste Generated:**
- Total food waste from all operations (tonnes)
- Includes production losses, expired products, plate waste
- Separate from non-food organic waste if possible

**Food Waste Diverted:**
- Food waste diverted from landfill through recovery operations
- Donation, composting, anaerobic digestion, animal feed

**Food Donated:**
- Surplus food donated to food banks, charities
- Highest-value recovery option (food rescue hierarchy)
- Track in tonnes and meals equivalent

**Food Composted:**
- Food waste converted to compost
- Second-best option after donation
- Includes commercial composting and on-site systems

#### Food Waste Hierarchy:
1. **Prevention:** Source reduction (most preferred)
2. **Donation:** Feed hungry people
3. **Animal Feed:** Convert to livestock feed
4. **Industrial Uses:** Oils, rendering
5. **Composting:** Create soil amendment
6. **Anaerobic Digestion:** Generate biogas
7. **Landfill:** Least preferred

#### Best Practices:
- Implement food waste prevention programs
- Partner with food rescue organizations
- Track food waste daily in kitchens/cafeterias
- Set food waste reduction targets (50% reduction by 2030)
- Compost all unavoidable food waste
- Report using FLW Protocol (Food Loss and Waste Protocol)

---

### 9. Plastic Management
**Purpose:** Reduce single-use plastics and increase recycled content

#### Global Plastic Crisis Context:
- 400+ million tonnes plastic produced annually
- <10% recycled globally
- Plastic waste in oceans: 8 million tonnes/year
- Growing regulatory pressure (EU Single-Use Plastics Directive, Extended Producer Responsibility)

#### Plastic Metrics:

**Single-Use Plastic Generated:**
- Plastic items used once and discarded
- Examples: Bottles, bags, straws, cutlery, packaging film
- Target: Eliminate or minimize

**Single-Use Plastic Eliminated:**
- Volume reduced through elimination or substitution
- Track year-over-year elimination progress
- Celebrate wins publicly

**Total Plastic Packaging Used:**
- All plastic in product packaging
- Includes primary, secondary, tertiary packaging
- Baseline for reduction targets

**Recycled Plastic Content (%):**
- Post-consumer recycled (PCR) content in plastic products/packaging
- Target: 25-50% recycled content by 2030 (varies by sector)

**Plastic Reduction Target (%):**
- Overall plastic reduction goal
- Example: 50% reduction by 2030 vs. 2020 baseline
- Should include elimination and substitution strategies

#### Plastic Reduction Strategies:
1. **Eliminate:** Remove unnecessary plastic (e.g., straws, bags)
2. **Substitute:** Replace with sustainable alternatives (paper, bamboo, reusable)
3. **Lightweight:** Reduce plastic weight per package
4. **Recycle:** Increase recycled content
5. **Reuse:** Shift to reusable systems

#### Best Practices:
- Conduct plastic audit to identify all plastic sources
- Set aggressive elimination targets for single-use plastics
- Increase recycled plastic content progressively
- Design packaging for recyclability
- Join industry initiatives (Ellen MacArthur Foundation New Plastics Economy)
- Report plastic use transparently

---

### 10. Extended Producer Responsibility (EPR)
**Purpose:** Manage end-of-life product and packaging responsibility

#### EPR Definition:
Policy approach where producers bear responsibility (financial and/or operational) for treatment or disposal of post-consumer products and packaging.

#### EPR Compliance Programs:
- Number of EPR programs organization participates in
- Examples: Packaging EPR, WEEE (e-waste), batteries, tires
- Varies by country/region

**Common EPR Programs:**
- **Packaging EPR:** EU Packaging Directive, Canadian provinces
- **WEEE (Waste Electrical and Electronic Equipment):** EU WEEE Directive
- **Batteries:** EU Batteries Directive, state laws (US)
- **Tires:** EPR programs in various jurisdictions
- **Textiles:** Emerging EPR schemes (France, Netherlands)

#### EPR Metrics:

**Product Take-Back Rate (%):**
```
Take-Back Rate = (Products Collected / Products Sold) × 100
```
- Target: 50-75% collection rate (ambitious)
- Track by product category

**EPR Fees Investment (USD):**
- Total fees paid to EPR organizations
- Also includes own take-back program costs
- Growing expense as EPR expands globally

**Packaging Recovery Rate (%):**
```
Recovery Rate = (Packaging Recovered / Packaging Placed on Market) × 100
```
- EU targets: 65-70% overall packaging recovery by 2030
- Varies by material type

#### Best Practices:
- Map all applicable EPR requirements by jurisdiction
- Maintain EPR compliance database
- Implement product take-back programs proactively
- Design products for easier recovery and recycling
- Report EPR metrics transparently
- Engage in EPR policy development

---

### 11. Supply Chain Waste
**Purpose:** Extend waste stewardship to suppliers and value chain

#### Supply Chain Assessment:

**Supplier Waste Assessment:**
- **All Suppliers:** Comprehensive assessment across supply base
- **Critical Suppliers:** Focus on high-waste or high-risk suppliers
- **No Assessment:** Gap requiring attention
- **Planned:** Under development

Assessment includes:
- Waste generation volumes
- Diversion rates
- Waste management practices
- Compliance with regulations

**Suppliers with Waste Targets:**
- Count of suppliers with quantitative waste reduction targets
- Percentage of supply chain with targets
- Collaborative target setting

**Supplier Average Waste Diversion Rate (%):**
- Average diversion rate across assessed suppliers
- Benchmark against own performance
- Identify best practices and improvement opportunities

**Supply Chain Waste Risk Level:**
- **High:** Suppliers with poor waste management, compliance issues
- **Medium:** Moderate waste performance, requires monitoring
- **Low:** Strong waste management, minimal risk
- **Unknown:** Conduct assessment

#### Best Practices:
- Include waste criteria in supplier assessments
- Require waste disclosure from high-risk suppliers
- Provide capacity building on waste management
- Set supply chain waste reduction targets
- Collaborate through industry initiatives (CDP Supply Chain)
- Recognize and reward supplier leaders

---

## Automated Calculations

### 1. Waste Diversion Rate (Zero Waste Goal)
**Purpose:** Measure progress toward zero waste certification

```javascript
const calculateWasteDiversionRate = () => {
  const total = parseFloat(totalWasteGenerated) || 0
  const recycled = parseFloat(wasteRecycled) || 0
  const composted = parseFloat(wasteComposted) || 0
  const reused = parseFloat(wasteReused) || 0
  const recovered = parseFloat(wasteRecovered) || 0
  
  const diverted = recycled + composted + reused + recovered
  const diversionRate = (diverted / total) * 100
  
  const level = diversionRate >= 90 ? 'Zero Waste' :
                diversionRate >= 75 ? 'Excellent' :
                diversionRate >= 50 ? 'Good' :
                diversionRate >= 25 ? 'Fair' : 'Poor'
  
  return { total, diverted, diversionRate, level }
}
```

**Performance Benchmarks:**
- **Zero Waste (≥90%):** TRUE or UL 2799 certification eligible, world-class
- **Excellent (75-89%):** Leadership performance, clear pathway to zero waste
- **Good (50-74%):** Above average, strong waste management
- **Fair (25-49%):** Below average, significant improvement needed
- **Poor (<25%):** Minimal diversion, urgent action required

**Zero Waste Certifications:**
- **TRUE (Total Resource Use and Efficiency):** Most recognized, 4 levels (Certified, Silver, Gold, Platinum)
- **UL 2799:** Underwriters Laboratories zero waste standard
- **Requirements:** ≥90% diversion, comprehensive waste reduction programs, third-party verification

---

### 2. Waste by Disposal Method (Waste Hierarchy)
**Purpose:** Visualize waste management according to waste hierarchy

```javascript
const calculateWasteByDisposal = () => {
  const total = parseFloat(totalWasteGenerated) || 0
  const recycled = parseFloat(wasteRecycled) || 0
  const composted = parseFloat(wasteComposted) || 0
  const reused = parseFloat(wasteReused) || 0
  const recovered = parseFloat(wasteRecovered) || 0
  const incinerated = parseFloat(wasteIncinerated) || 0
  const landfilled = parseFloat(wasteLandfilled) || 0
  
  return {
    recycled: { value: recycled, percent: ((recycled / total) * 100).toFixed(1) },
    composted: { value: composted, percent: ((composted / total) * 100).toFixed(1) },
    reused: { value: reused, percent: ((reused / total) * 100).toFixed(1) },
    recovered: { value: recovered, percent: ((recovered / total) * 100).toFixed(1) },
    incinerated: { value: incinerated, percent: ((incinerated / total) * 100).toFixed(1) },
    landfilled: { value: landfilled, percent: ((landfilled / total) * 100).toFixed(1) },
    total
  }
}
```

**Waste Hierarchy Priority:**
1. ♻️ **Recycled** (High Priority): Material recovery for new products
2. 🌱 **Composted** (High Priority): Organic waste to soil amendment
3. 🔄 **Reused** (High Priority): Use again without reprocessing
4. ⚡ **Recovered** (Medium Priority): Energy recovery (better than landfill)
5. 🔥 **Incinerated** (Low Priority): Disposal without energy recovery
6. 🚮 **Landfilled** (Lowest Priority): Last resort disposal

**Target Mix (Zero Waste Goal):**
- Recycled: 50-60%
- Composted: 15-25%
- Reused: 5-10%
- Recovered: 5-15%
- Incinerated: <5%
- Landfilled: <5%

---

### 3. Circular Economy Performance Score
**Purpose:** Quantify circular economy transition progress

```javascript
const calculateCircularityScore = () => {
  const recycledInput = parseFloat(recycledInputMaterials) || 0
  const recyclableContent = parseFloat(recyclableContentProducts) || 0
  const packagingReduction = parseFloat(packagingReduction) || 0
  const takeBackRate = parseFloat(productTakeBackRate) || 0
  
  // Each component weighted equally (25%)
  const score = (
    (recycledInput / 100 * 25) +
    (recyclableContent / 100 * 25) +
    (packagingReduction / 100 * 25) +
    (takeBackRate / 100 * 25)
  )
  
  const level = score >= 80 ? 'Leading' :
                score >= 60 ? 'Advanced' :
                score >= 40 ? 'Developing' :
                score >= 20 ? 'Basic' : 'Initial'
  
  return { score, level, metrics: { recycledInput, recyclableContent, packagingReduction, takeBackRate } }
}
```

**Score Components:**
1. **Recycled Input Materials (25%):** Post-consumer recycled content in products
2. **Recyclable Content in Products (25%):** Design for recyclability
3. **Packaging Reduction (25%):** Lightweighting and elimination
4. **Product Take-Back Rate (25%):** Closed-loop recovery

**Maturity Levels:**
- **Leading (80-100):** Circular economy leader, best-in-class practices
- **Advanced (60-79):** Strong circular performance, scaling initiatives
- **Developing (40-59):** Building circular capabilities, pilots underway
- **Basic (20-39):** Early stages, limited circular practices
- **Initial (0-19):** Linear economy, minimal circularity

**Leading Companies (Score 80+):**
- Interface (flooring): 100% recycled/bio-based materials goal
- Patagonia (apparel): Worn Wear take-back, 100% organic cotton
- Dell (technology): Closed-loop plastic recycling, product take-back
- Philips (electronics): Circular revenue 17% of total (2022)

---

### 4. Waste Intensity Tracking
**Purpose:** Monitor waste efficiency over time

```javascript
const calculateWasteIntensity = () => {
  const waste = parseFloat(totalWasteGenerated) || 0
  const revenue = parseFloat(wasteIntensityRevenue) || 0
  const production = parseFloat(wasteIntensityProduction) || 0
  
  const results = {}
  
  if (revenue > 0) {
    results.revenueIntensity = (waste / revenue).toFixed(2)
  }
  
  if (production > 0) {
    results.productionIntensity = (waste / production).toFixed(2)
  }
  
  return results
}
```

**Use Cases:**
- **Revenue Intensity:** Cross-industry benchmarking, investor reporting
- **Production Intensity:** Operational efficiency, process improvements
- **Employee Intensity:** Office/facility benchmarking

**Target Setting Example:**
```
Baseline (2020): 10.0 tonnes per M USD revenue
Target (2030): 6.0 tonnes per M USD revenue (-40% intensity reduction)
Annual Reduction: 0.4 tonnes per M USD per year
```

---

## Key Metrics & KPIs

### Operational KPIs

#### 1. Waste Diversion Rate
- **Metric:** Percentage of waste diverted from landfill
- **Target:** ≥90% (Zero Waste), ≥75% (Excellent)
- **Formula:** `((Recycled + Composted + Reused + Recovered) / Total Waste) × 100`
- **Reporting:** GRI 306-4, CSRD E5-5, CDP W6

#### 2. Landfill Rate
- **Metric:** Percentage of waste sent to landfill
- **Target:** <10% (Good), <5% (Zero Waste)
- **Formula:** `(Landfilled / Total Waste) × 100`
- **Reporting:** GRI 306-5, CSRD E5-5

#### 3. Recycling Rate
- **Metric:** Percentage of waste recycled
- **Target:** ≥50% (varies by industry)
- **Formula:** `(Recycled / Total Waste) × 100`
- **Reporting:** GRI 306-4, CDP W6

#### 4. Waste Generation Reduction
- **Metric:** Year-over-year percentage change
- **Target:** -3% to -5% annually
- **Formula:** `((Current Year - Previous Year) / Previous Year) × 100`
- **Reporting:** GRI 306-3, CSRD E5-5

#### 5. Waste Intensity (Revenue)
- **Metric:** Tonnes per million USD revenue
- **Target:** Industry-specific, continuous improvement
- **Formula:** `Total Waste / Revenue`
- **Reporting:** GRI 306-3, CSRD E5-5, SBTi

---

### Circular Economy KPIs

#### 6. Recycled Input Materials
- **Metric:** Percentage of inputs that are recycled/recovered
- **Target:** 25-50% (ambitious)
- **Formula:** `(Recycled Inputs / Total Inputs) × 100`
- **Reporting:** GRI 301-2, CSRD E5-5

#### 7. Circular Revenue
- **Metric:** Revenue from circular products/services
- **Target:** 10-20% (developing), >20% (leading)
- **Calculation:** Revenue from products-as-a-service, refurbished products, circular business models
- **Reporting:** CSRD E5-5

#### 8. Product Take-Back Rate
- **Metric:** Percentage of products collected at end-of-life
- **Target:** 50-75% (ambitious)
- **Formula:** `(Products Collected / Products Sold) × 100`
- **Reporting:** GRI 306-2, CSRD E5-5

---

### Material-Specific KPIs

#### 9. Plastic Reduction
- **Metric:** Percentage reduction in plastic use
- **Target:** 50% by 2030 (aligned with New Plastics Economy)
- **Formula:** `((Baseline - Current) / Baseline) × 100`
- **Reporting:** CSRD E5-5, CDP W6

#### 10. Food Waste Reduction
- **Metric:** Percentage reduction vs. baseline (SDG 12.3)
- **Target:** 50% by 2030
- **Formula:** `((Baseline - Current) / Baseline) × 100`
- **Reporting:** GRI 306-3, SDG 12.3

---

## Zero Waste Certification

### TRUE Certification (Total Resource Use and Efficiency)
**Certifying Body:** Green Business Certification Inc. (GBCI), developed by US Zero Waste Business Council

#### TRUE Certification Levels:
1. **TRUE Certified:** 90-94.9% diversion
2. **TRUE Silver:** 95-97.4% diversion
3. **TRUE Gold:** 97.5-99.4% diversion
4. **TRUE Platinum:** 99.5-100% diversion

#### Requirements:
- Comprehensive waste audit
- Waste diversion rate ≥90%
- Waste reduction initiatives
- Zero waste policy and goals
- Employee training and engagement
- Annual reporting and recertification

#### Application Process:
1. Conduct waste audit (12 months data)
2. Calculate diversion rate
3. Submit application with documentation
4. Third-party verification
5. Certification awarded (2-year term)
6. Annual reporting required

---

### UL 2799 (Zero Waste to Landfill)
**Certifying Body:** UL (Underwriters Laboratories)

#### UL 2799 Validation Levels:
1. **Zero Waste to Landfill:** 90-94% diversion
2. **Zero Waste to Landfill Silver:** 95-99% diversion
3. **Zero Waste to Landfill Gold:** ≥100% diversion (waste-to-energy counted)
4. **Zero Waste to Landfill Platinum:** 100% diversion excluding waste-to-energy

#### Key Differences from TRUE:
- UL 2799 Gold allows waste-to-energy in 100% calculation
- TRUE Platinum excludes waste-to-energy
- Both require ≥90% diversion minimum

---

### Zero Waste International Alliance (ZWIA) Definition
"Zero Waste means designing and managing products and processes to systematically avoid and eliminate the volume and toxicity of waste and materials, conserve and recover all resources, and not burn or bury them."

**ZWIA Principles:**
- ≥90% diversion from landfill, incineration, and environment
- Focus on waste prevention, not just diversion
- Commitment to continuous improvement
- Responsible production and consumption

---

## Industry Benchmarks

### Manufacturing

**General Manufacturing:**
- Waste Intensity: 5-20 tonnes per M USD revenue
- Diversion Rate: 50-80%
- Landfill Rate: 20-50%
- Leading Companies: Toyota (96% diversion), GM (zero waste facilities)

**Electronics/Technology:**
- Waste Intensity: 1-5 tonnes per M USD revenue
- Diversion Rate: 60-90%
- E-Waste: 100% responsible recycling
- Leading Companies: Apple (zero waste achieved at all facilities), HP

**Automotive:**
- Waste Intensity: 10-30 tonnes per M USD revenue
- Diversion Rate: 80-95%
- Zero Waste Facilities: Common among leaders
- Leading Companies: Subaru (zero landfill, zero waste to incineration)

---

### Food & Beverage

**Food Processing:**
- Waste Intensity: 20-100 tonnes per M USD revenue
- Organic Waste: 60-80% of total waste
- Diversion Rate: 60-80% (composting critical)
- Leading Companies: Unilever (100% factories zero waste to landfill)

**Beverages:**
- Waste Intensity: 10-50 tonnes per M USD revenue
- Packaging Waste: Dominant stream
- Diversion Rate: 70-90%
- Leading Companies: Coca-Cola, PepsiCo (zero waste goals)

---

### Retail

**General Retail:**
- Waste Intensity: 2-10 tonnes per M USD revenue
- Cardboard: 60-80% of waste
- Diversion Rate: 50-70%
- Leading Companies: IKEA (90% diversion target), Walmart

**Grocery:**
- Waste Intensity: 5-20 tonnes per M USD revenue
- Food Waste: 40-60% of total
- Diversion Rate: 40-60%
- Leading Companies: Whole Foods (zero waste stores)

---

### Healthcare

**Hospitals:**
- Waste Intensity: 5-15 tonnes per M USD revenue
- Regulated Medical Waste: 10-25% of total
- Diversion Rate: 20-40% (low due to infection control)
- Opportunity: Non-regulated waste recycling, food waste composting

---

## Data Collection Best Practices

### 1. Waste Weighing & Tracking

**Infrastructure Requirements:**
- Certified scale at waste collection points
- Container weight documentation
- Waste tracking software integration
- Monthly weight reconciliation

**Weighing Methods:**
- **Direct Weighing:** Weigh each container/load (most accurate)
- **Volume Conversion:** Use density factors if weighing not feasible (less accurate)
- **Waste Hauler Data:** Request weight tickets from haulers
- **Estimates:** Last resort, use industry factors with documentation

**Best Practices:**
- Weigh all waste streams monthly minimum
- Calibrate scales annually
- Maintain scale certification
- Train staff on proper weighing procedures
- Use automated data logging where possible

---

### 2. Waste Audits

**Frequency:** Quarterly (high-volume sites) or Annually (all sites)

**Audit Process:**
1. **Planning:** Schedule audit, allocate resources, notify staff
2. **Sampling:** Collect representative waste samples (1-2 weeks typical)
3. **Sorting:** Sort waste by material type, wear PPE
4. **Weighing:** Weigh each material category
5. **Analysis:** Calculate composition percentages
6. **Reporting:** Document findings, identify opportunities
7. **Action Planning:** Develop waste reduction initiatives

**Sample Size:**
- Small site (<50 employees): 2-5% of monthly waste
- Large site (>50 employees): 1-2% of monthly waste
- High-variance operations: Larger samples or multiple audits

**Waste Composition Categories:**
- Recyclables (paper, cardboard, plastics, metals, glass)
- Organics (food waste, yard waste)
- Landfill (contaminated materials, non-recyclables)
- Hazardous (if present, separate audit)

---

### 3. Data Management Systems

**Waste Tracking Software:**
- **Encamp:** Comprehensive environmental data management
- **VelocityEHS:** EHS management including waste tracking
- **Intelex:** Quality and sustainability management
- **Custom Solutions:** Excel, databases, or internal systems

**System Requirements:**
- Track waste by stream, material type, disposal method
- Automated calculations (diversion rate, intensity, etc.)
- Reporting dashboards and analytics
- Integration with hauler invoices
- Historical trend analysis
- Export capabilities for ESG reporting

---

### 4. Hauler Data Quality

**Waste Hauler Coordination:**
- Request weight tickets for all pickups
- Specify disposal destination and method
- Clarify hauler reporting frequency (monthly)
- Verify hauler certifications (recyclers, composters)
- Audit hauler data quality annually

**Common Data Issues:**
- Volume reported instead of weight (requires density conversion)
- Missing or incomplete weight tickets
- Inconsistent reporting periods
- Unclear disposal methods
- Need for follow-up and reconciliation

---

### 5. Hazardous Waste Documentation

**Regulatory Requirements:**
- EPA hazardous waste manifests (US)
- Consignment notes (EU)
- Waste transfer notes (other jurisdictions)
- Cradle-to-grave tracking

**Record Keeping:**
- Maintain hazardous waste manifests for ≥3 years (US: 3 years, EU: variable)
- Track by waste code (EPA codes, European Waste Catalogue)
- Document disposal facility credentials
- Annual hazardous waste summary report

---

## Implementation Roadmap

### Phase 1: Foundation (Months 1-3)

**1.1 Baseline Assessment**
- Inventory all waste streams and collection points
- Review existing waste tracking and data quality
- Conduct comprehensive waste audit
- Assess compliance with GRI 306, CSRD E5, CDP requirements

**1.2 Infrastructure Setup**
- Install weighing systems or improve existing
- Implement waste tracking software
- Set up waste stream source separation
- Establish data collection procedures (SOPs)

**1.3 Baseline Establishment**
- Collect 6-12 months of comprehensive waste data
- Calculate baseline metrics (total waste, diversion rate, intensity)
- Identify top waste streams and diversion opportunities
- Benchmark against industry peers

**Deliverables:**
- Waste audit report
- Baseline waste data (Year 0)
- Gap analysis vs. framework requirements
- Waste tracking system operational

---

### Phase 2: Implementation (Months 4-9)

**2.1 Policy & Governance**
- Draft waste prevention and zero waste policy
- Secure board-level approval
- Establish waste steering committee
- Integrate waste into ESG governance

**2.2 Target Setting**
- Set waste reduction targets (absolute and intensity)
- Establish zero waste goal (90% diversion)
- Develop waste stream-specific targets
- Publicly disclose targets

**2.3 Operational Improvements**
- Implement quick-win waste diversion projects
- Expand recycling and composting programs
- Pilot circular economy initiatives (take-back, reuse)
- Launch employee waste reduction campaigns

**2.4 Circular Economy Pilot**
- Assess product circularity opportunities
- Increase recycled input materials
- Design packaging reduction initiatives
- Pilot product take-back program

**Deliverables:**
- Board-approved waste policy
- Public zero waste commitment
- Waste reduction targets disclosed
- Diversion rate improved by 10-20%

---

### Phase 3: Optimization (Months 10-18)

**3.1 Advanced Waste Management**
- Scale successful pilots across all facilities
- Implement real-time waste monitoring
- Optimize waste collection logistics
- Achieve 75% diversion rate

**3.2 Circular Economy Scale-Up**
- Expand recycled content in products (target 25-50%)
- Launch product take-back programs
- Implement EPR compliance programs
- Reduce packaging weight by 20-30%

**3.3 Supply Chain Engagement**
- Assess supplier waste management practices
- Require waste targets from critical suppliers
- Provide supplier capacity building
- Track supply chain waste metrics

**3.4 Zero Waste Progress**
- Achieve 90% waste diversion at pilot facilities
- Pursue TRUE or UL 2799 certification (pilot sites)
- Document zero waste best practices
- Plan organization-wide zero waste rollout

**Deliverables:**
- 75% organization-wide diversion rate
- Zero waste certification at ≥1 facility
- Circular economy initiatives scaled
- Complete annual sustainability report (waste chapter)

---

### Phase 4: Leadership (Months 19-24+)

**4.1 Zero Waste Achievement**
- Achieve 90%+ diversion at all major facilities
- Obtain TRUE or UL 2799 certification (all feasible sites)
- Eliminate single-use plastics organization-wide
- Near-zero landfill across operations

**4.2 Circular Economy Leadership**
- 50%+ recycled input materials
- 100% products designed for circularity
- Comprehensive product take-back (50%+ recovery rate)
- Circular business model revenue >20%

**4.3 Transparency & Advocacy**
- Publish annual zero waste progress report
- Achieve CDP Waste "A" rating (if/when available)
- Present at industry conferences
- Advocate for Extended Producer Responsibility policies

**4.4 Value Chain Impact**
- Supply chain waste reduction targets achieved
- Supplier zero waste programs supported
- Industry collaboration on circular economy
- Report Scope 3 waste impacts (emerging practice)

**Deliverables:**
- Organization-wide zero waste certification
- Circular economy leadership recognized
- Industry thought leadership (publications, awards)
- Value chain waste transformation

---

## Checklist: Waste Management Readiness

### Data Collection ☐
- [ ] Waste weighing systems installed at all major waste streams
- [ ] Waste tracking software operational
- [ ] Monthly waste data collection process established
- [ ] Annual waste audits scheduled
- [ ] Hazardous waste manifests tracked and archived
- [ ] Hauler data quality verified

### Waste Diversion ☐
- [ ] Recycling program comprehensive (paper, cardboard, plastic, metal, glass)
- [ ] Composting program for organic waste
- [ ] E-waste recycling through certified recyclers
- [ ] Hazardous waste managed through licensed facilities
- [ ] Waste diversion rate >50% (target: >75%)

### Policy & Targets ☐
- [ ] Waste prevention policy drafted and board-approved
- [ ] Zero waste commitment made publicly (target: 90% diversion)
- [ ] Waste reduction targets set (absolute and/or intensity)
- [ ] Circular economy strategy developed
- [ ] EPR compliance programs established

### Circular Economy ☐
- [ ] Products assessed for circularity
- [ ] Recycled input materials increased (target: 25-50%)
- [ ] Product take-back program implemented
- [ ] Packaging reduction initiatives underway (target: 30-50% reduction)
- [ ] Single-use plastics elimination plan in place

### Reporting ☐
- [ ] GRI 306 disclosures complete (306-1 through 306-5)
- [ ] CSRD E5 reporting (if applicable)
- [ ] CDP Waste disclosure submitted
- [ ] SDG 12 contributions tracked and reported
- [ ] Zero waste progress reported publicly

### Certification ☐
- [ ] Waste audit completed (required for TRUE/UL 2799)
- [ ] Diversion rate ≥90% achieved (at pilot facility)
- [ ] TRUE or UL 2799 application submitted (or planned)
- [ ] Annual reporting plan for certification maintenance

---

## Glossary

**Circular Economy:** Economic model where resources are kept in use for as long as possible, extracting maximum value, then recovered and regenerated at end of life.

**Composting:** Aerobic biological decomposition of organic materials into a humus-like material.

**Diversion Rate:** Percentage of waste diverted from landfill through recycling, composting, reuse, or energy recovery.

**E-Waste (WEEE):** Waste Electrical and Electronic Equipment, including computers, phones, appliances.

**Extended Producer Responsibility (EPR):** Policy approach where producers bear responsibility for end-of-life management of their products.

**Hazardous Waste:** Waste that poses substantial or potential threats to public health or the environment (toxic, ignitable, corrosive, reactive).

**Landfill:** Disposal of waste by burial in land.

**Material Recovery Facility (MRF):** Facility that receives, separates, and prepares recyclable materials for sale to end buyers.

**Non-Hazardous Waste:** Waste without hazardous characteristics, suitable for standard disposal methods.

**Recycling:** Process of converting waste into new materials and objects.

**Waste Hierarchy:** Ranking of waste management options from most to least preferred (prevention, reuse, recycling, recovery, disposal).

**Waste-to-Energy:** Process of generating energy from waste through combustion, gasification, or anaerobic digestion.

**Zero Waste:** Philosophy and design principle targeting elimination of waste through prevention, reduction, reuse, and recycling (operationally defined as ≥90% diversion).

---

## Additional Resources

### Standards & Frameworks
- **GRI 306 (2020):** https://www.globalreporting.org/standards/media/2463/gri-306-waste-2020.pdf
- **CSRD ESRS E5:** https://www.efrag.org/lab6
- **TRUE Zero Waste Certification:** https://true.gbci.org
- **UL 2799:** https://www.ul.com/services/zero-waste-landfill-validation

### Measurement Protocols
- **Food Loss and Waste Protocol:** https://flwprotocol.org
- **Waste Measurement Guidance (GRI):** https://www.globalreporting.org

### Industry Initiatives
- **Ellen MacArthur Foundation - Circular Economy:** https://ellenmacarthurfoundation.org
- **US Zero Waste Business Council:** https://www.uszwbc.org
- **Zero Waste Europe:** https://zerowasteeurope.eu
- **New Plastics Economy Global Commitment:** https://www.newplasticseconomy.org

### Tools
- **Waste Audit Templates:** Available from TRUE, ZWIA
- **Waste Tracking Software:** Encamp, VelocityEHS, Intelex
- **Circular Economy Assessment Tools:** Material Circularity Indicator (Ellen MacArthur Foundation)

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Framework Versions:** GRI 306 (2020), CSRD ESRS E5 (2023), CDP Waste (2024), SDG 12 (2030 Agenda), TRUE v2.2

