# Enterprise-Level Enhancement Plan
## Carbon Depict Web Application

### Overview
Comprehensive enhancement of 5 critical modules to enterprise-grade functionality with full CRUD operations, framework compliance, and advanced features.

---

## Phase 1: Scope 1, 2, 3 Emissions Forms (PRIORITY 1)

### Current State
- ✅ Forms exist with DataCollectionTemplate
- ✅ Save (CREATE) functionality via enterpriseAPI.emissions.create()
- ❌ No LOAD existing data
- ❌ No UPDATE functionality
- ❌ No DELETE functionality
- ❌ No EXPORT functionality
- ❌ No validation rules
- ❌ No calculation engine
- ❌ No CO2e conversion

### Enhancement Plan

#### 1.1 Full CRUD Implementation
**Backend (Already exists at `/api/scope3`):**
- GET /api/esg/metrics?sourceType=scope1_emissions
- GET /api/esg/metrics?sourceType=scope2_emissions
- GET /api/scope3 (dedicated model)
- POST, PUT, DELETE for all three

**Frontend Changes:**
- Integrate useESGMetricForm hook for Scope 1 & 2
- Integrate useDedicatedModelForm hook for Scope 3
- Add loading states
- Add update vs create logic
- Add delete confirmation dialogs
- Add export button with CSV/Excel/JSON/PDF

#### 1.2 Emissions Calculation Engine
**Research Standards:**
- GHG Protocol Corporate Standard
- DEFRA 2024 Emission Factors
- EPA Emission Factors
- IPCC AR6 GWP Values

**Implement:**
```javascript
// Real-time CO2e calculation
const calculateScope1Emissions = (formData) => {
  let totalCO2e = 0;

  // Stationary Combustion
  totalCO2e += formData.naturalGas * DEFRA_FACTORS.naturalGas_kWh;
  totalCO2e += formData.diesel * DEFRA_FACTORS.diesel_litres;
  // ... all fuel types

  // Mobile Combustion
  totalCO2e += formData.petrolCars * DEFRA_FACTORS.petrol_litres;
  // ... all vehicle types

  // Process Emissions
  totalCO2e += formData.cementProduction * IPCC_FACTORS.cement;

  // Fugitive Emissions (with GWP)
  totalCO2e += formData.r404a * GWP_VALUES.r404a / 1000;

  return {
    totalCO2e,
    breakdown: { stationary, mobile, process, fugitive },
    intensity: totalCO2e / revenue
  };
};
```

#### 1.3 Enhanced UI Features
- Real-time CO2e display per category
- Visual intensity metrics (per employee, per £ revenue, per sqm)
- Year-over-year comparison graphs
- Baseline year selection
- Reduction targets tracking
- Location-based emission factors (UK, US, EU)
- Uncertainty ranges
- Data quality indicators (Tier 1/2/3)

#### 1.4 Validation & Business Rules
```javascript
const validationRules = {
  scope1: {
    naturalGas: { min: 0, max: 10000000, required: false },
    biofuelBlend: { min: 0, max: 100, required: false },
    // Conditional: If biofuel blend > 0, must specify fuel type
  },
  scope2: {
    marketBased: { required: true, dependency: 'hasRECs' },
    locationBased: { required: true, autoCalculate: true }
  }
};
```

---

## Phase 2: Scope 3 Dedicated Model (PRIORITY 1)

### Current State
- ✅ Form exists
- ✅ Backend API exists (`/api/scope3`)
- ❌ Not using dedicated Scope3Emission model properly

### Enhancement Plan

#### 2.1 Full Category Support (15 Categories)
**Upstream (Categories 1-8):**
1. Purchased Goods & Services
2. Capital Goods
3. Fuel & Energy Related Activities
4. Upstream Transportation
5. Waste Generated in Operations
6. Business Travel
7. Employee Commuting
8. Upstream Leased Assets

**Downstream (Categories 9-15):**
9. Downstream Transportation
10. Processing of Sold Products
11. Use of Sold Products
12. End-of-Life Treatment
13. Downstream Leased Assets
14. Franchises
15. Investments

#### 2.2 Calculation Methodologies
- Spend-based method ($ x emission factor)
- Activity-based method (fuel, distance, weight)
- Supplier-specific method (actual data from suppliers)
- Hybrid method (combination)

#### 2.3 Supplier Engagement
- Supplier data request portal
- Supplier response tracking
- Data quality scoring (primary vs secondary data)
- Supplier emissions dashboard

---

## Phase 3: Reports Module (PRIORITY 1)

### Current State
- Multiple report files exist but not fully functional
- No comprehensive report generation
- No template system

### Enhancement Plan

#### 3.1 Report Types
1. **GHG Inventory Report** (ISO 14064-1)
2. **CDP Climate Change Response**
3. **TCFD Report** (4 pillars)
4. **GRI Sustainability Report**
5. **CSRD/ESRS Disclosure**
6. **Custom ESG Report**

#### 3.2 Report Features
- Template library
- Drag-and-drop sections
- Auto-populate from collected data
- Charts & visualizations
- Year-over-year trends
- Peer benchmarking
- Export to PDF/Word/HTML
- Stakeholder customization (investor vs regulator view)
- Multi-language support

#### 3.3 Report Workflow
- Draft → Review → Approve → Publish
- Version control
- Collaborative editing
- Comments & annotations
- Audit trail
- Scheduled generation (quarterly, annually)

---

## Phase 4: Enhanced Materiality Assessment (PRIORITY 1)

### Current State
- ✅ Basic materiality matrix exists
- ✅ 22 predefined ESG issues
- ✅ Stakeholder groups defined
- ❌ Only generic issues (not framework-specific)
- ❌ No custom topic support
- ❌ No framework selection
- ❌ No analysis engine

### 7 Framework Standards to Research & Implement

#### 4.1 GRI Standards (Global Reporting Initiative)
**Material Topics (40+):**
- Economic: Economic Performance, Market Presence, Indirect Economic Impacts, Procurement, Anti-corruption, Anti-competitive Behavior
- Environmental: Materials, Energy, Water, Biodiversity, Emissions, Waste, Compliance
- Social: Employment, Labor Relations, Health & Safety, Training, Diversity, Non-discrimination, Freedom of Association, Child Labor, Forced Labor, Security Practices, Indigenous Rights, Human Rights Assessment, Local Communities, Supplier Social Assessment, Public Policy, Customer Health & Safety, Marketing, Customer Privacy, Compliance

#### 4.2 SASB (Sustainability Accounting Standards Board)
**Industry-Specific:**
- 77 industries across 11 sectors
- 5 sustainability dimensions: Environment, Social Capital, Human Capital, Business Model & Innovation, Leadership & Governance
- Financially material topics only
- Need industry selector dropdown

#### 4.3 TCFD (Task Force on Climate-related Financial Disclosures)
**4 Pillars, 11 Recommendations:**
1. Governance (2): Board Oversight, Management Role
2. Strategy (3): Risks & Opportunities, Impact on Business, Resilience
3. Risk Management (3): Risk Identification, Assessment, Management
4. Metrics & Targets (3): Metrics, Scope 1/2/3, Targets

#### 4.4 CDP (Carbon Disclosure Project)
**Material Topics:**
- Climate Change (Risks, Opportunities, Emissions, Targets)
- Water Security (Withdrawal, Discharge, Stress)
- Forests (Deforestation, Commodities)
- Supplier engagement
- Scenario analysis

#### 4.5 ISSB/IFRS S1 & S2
**General Requirements (S1):**
- Governance, Strategy, Risk Management, Metrics & Targets
- Industry-based disclosure requirements

**Climate-Related (S2):**
- Cross-industry metrics
- Industry-based metrics
- Financed emissions (for financials)

#### 4.6 EU CSRD/ESRS (Already partially implemented)
**Enhanced Implementation:**
- Double materiality (impact AND financial)
- 12 ESRS standards (2 cross-cutting + 10 topical)
- Mandatory vs voluntary disclosures
- Materiality assessment process documentation

#### 4.7 UN SDGs (Sustainable Development Goals)
**17 Goals, 169 Targets:**
- SDG impact assessment
- Positive vs negative contributions
- Target alignment
- Indicator tracking

### 4.4 Custom Materiality Features

#### Framework Selector
```javascript
const frameworkOptions = [
  { value: 'all', label: 'All Frameworks (Comprehensive)', topics: [...] },
  { value: 'gri', label: 'GRI Standards', topics: [...] },
  { value: 'sasb', label: 'SASB (Industry-Specific)',
    requiresIndustry: true, industries: [...] },
  { value: 'tcfd', label: 'TCFD', topics: [...] },
  { value: 'cdp', label: 'CDP', topics: [...] },
  { value: 'issb', label: 'ISSB/IFRS S1 & S2', topics: [...] },
  { value: 'csrd', label: 'EU CSRD/ESRS', topics: [...] },
  { value: 'sdg', label: 'UN SDGs', topics: [...] },
  { value: 'custom', label: 'Custom Topics', allowAdd: true }
];
```

#### Custom Topic Addition
```javascript
const customTopicForm = {
  name: 'Topic Name',
  category: 'Environmental/Social/Governance',
  description: 'Detailed description',
  frameworks: ['GRI 305', 'CSRD E1'],
  stakeholders: ['Investors', 'Employees'],
  impactType: 'Negative/Positive/Both',
  timeHorizon: 'Short-term/Medium-term/Long-term',
  likelihood: 1-5,
  magnitude: 1-5
};
```

#### AI-Powered Analysis Engine
```javascript
const analyzeDataForMateriality = (collectedData) => {
  // 1. Scan all data collection forms
  const completedTopics = identifyCompletedTopics(collectedData);

  // 2. Calculate materiality scores
  const materialityScores = completedTopics.map(topic => ({
    topic,
    impactScore: calculateImpactScore(topic, collectedData),
    financialScore: calculateFinancialScore(topic, collectedData),
    stakeholderConcern: analyzeStakeholderConcern(topic),
    dataCompleteness: calculateDataCompleteness(topic)
  }));

  // 3. Generate custom matrix
  return generateMaterialityMatrix(materialityScores);
};
```

#### Interactive Matrix
- Drag-and-drop topics to reposition
- Click to see supporting data
- Export matrix as image/PDF
- Filter by framework
- Filter by stakeholder group
- Filter by time horizon
- Scenario comparison (baseline vs net-zero)

---

## Phase 5: Notifications System (PRIORITY 2)

### Implementation

#### 5.1 Notification Types
1. **System Notifications:**
   - Data submission confirmations
   - Report generation complete
   - Calculation errors
   - System updates

2. **Workflow Notifications:**
   - Approval requests
   - Review deadlines
   - Data gaps identified
   - Compliance deadlines

3. **Alerts:**
   - Emissions spike detected
   - Target at risk
   - Data quality issues
   - Regulatory changes

4. **Reminders:**
   - Monthly data entry
   - Quarterly reporting
   - Annual audit
   - Supplier engagement

#### 5.2 Notification Center UI
```javascript
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications ({unreadCount})</h3>
        <button onClick={markAllAsRead}>Mark all read</button>
      </div>
      <div className="notification-list">
        {notifications.map(notif => (
          <NotificationItem
            key={notif.id}
            type={notif.type}
            message={notif.message}
            timestamp={notif.timestamp}
            isRead={notif.isRead}
            actionUrl={notif.actionUrl}
          />
        ))}
      </div>
    </div>
  );
};
```

#### 5.3 Backend Support
- Real-time via Socket.io
- Database persistence
- Email digests (daily/weekly)
- In-app push notifications
- Webhook integrations

---

## Phase 6: Account & Settings (PRIORITY 2)

### Enhancement Plan

#### 6.1 User Profile
- Avatar upload
- Name, title, department
- Contact information
- Notification preferences
- Language & timezone
- Accessibility settings

#### 6.2 Company Settings
**Organization Details:**
- Legal name & structure
- Industry classification (NAICS, SIC)
- Number of employees
- Revenue
- Reporting period (fiscal year)
- Currency
- Locations (multi-site support)

**Reporting Configuration:**
- Baseline year
- Consolidation approach (operational control, financial control, equity share)
- Organizational boundaries
- Reporting standards (GHG Protocol, ISO 14064)
- Assurance level
- Materiality threshold

**Emission Factors:**
- Default database (DEFRA, EPA, IPCC)
- Custom factors
- Location-specific factors
- Version control

#### 6.3 Team Management
- User roles: Admin, Manager, Contributor, Viewer
- Permissions matrix
- Department assignments
- Data access controls
- Activity logs

#### 6.4 Integrations
- Accounting systems (Xero, QuickBooks)
- Energy management (meters, BMS)
- Travel booking (Concur, TravelPerk)
- Supply chain (SAP, Oracle)
- Reporting platforms (CDP portal, CSRD platform)
- API access & webhooks

#### 6.5 Audit & Compliance
- Audit trail (all changes logged)
- Data lineage
- Version history
- Export compliance reports
- Third-party assurance support

---

## Implementation Priority

### Week 1-2: Scope 1, 2, 3 Full CRUD + Calculations
- [ ] Integrate all three with API
- [ ] Add DEFRA emission factors database
- [ ] Implement calculation engine
- [ ] Add real-time CO2e display
- [ ] Add export functionality
- [ ] Add validation rules

### Week 3: Scope 3 Enhanced (15 Categories)
- [ ] Complete all 15 category forms
- [ ] Add methodology selector per category
- [ ] Add supplier engagement features
- [ ] Add spend-based vs activity-based calculations

### Week 4: Reports Module
- [ ] Design report template system
- [ ] Implement 6 report types
- [ ] Add charts & visualizations
- [ ] Add export to PDF/Word
- [ ] Add approval workflow

### Week 5-6: Enhanced Materiality (7 Frameworks)
- [ ] Research all 7 frameworks
- [ ] Create topic databases for each
- [ ] Add framework selector dropdown
- [ ] Implement custom topic addition
- [ ] Build AI analysis engine
- [ ] Create interactive matrix
- [ ] Add data-driven insights

### Week 7: Notifications & Settings
- [ ] Build notification system
- [ ] Real-time Socket.io integration
- [ ] Email digest system
- [ ] Enhanced user profile
- [ ] Company settings page
- [ ] Team management
- [ ] Integrations page

---

## Technical Standards to Implement

### Emission Calculation Standards
1. **GHG Protocol Corporate Standard** (2004, amended 2015)
2. **ISO 14064-1:2018** (Organizational GHG inventories)
3. **DEFRA 2024 Emission Factors** (UK Government)
4. **EPA Emission Factors** (US)
5. **IPCC AR6 GWP Values** (100-year time horizon)

### Disclosure Standards
1. **GRI Standards 2021**
2. **SASB Standards** (77 industries)
3. **TCFD Recommendations** (2017)
4. **CDP Questionnaires** (2024)
5. **ISSB IFRS S1 & S2** (2023)
6. **EU CSRD/ESRS** (2024)
7. **UN SDGs** (2015-2030)

### Data Quality Standards
1. **ISO 14064-3:2019** (Verification)
2. **AA1000 Assurance Standard**
3. **ISAE 3410** (Assurance on GHG statements)

---

## Success Metrics

1. **Data Completeness:** 100% of required fields for each scope
2. **Calculation Accuracy:** ±2% variance from verified emissions
3. **User Engagement:** Daily active users, time on platform
4. **Reporting Efficiency:** Time to generate report (target: <5 minutes)
5. **Compliance:** 100% coverage of material topics per selected framework
6. **Data Quality:** Tier 1 data >70%, Tier 2 >90%, Tier 3 <10%
7. **Supplier Engagement:** Response rate >60%
8. **Audit Readiness:** Zero critical findings in external audit

---

## Next Steps

1. Finalize emission factors database (DEFRA 2024 + EPA + IPCC)
2. Create calculation engine service
3. Integrate all forms with full CRUD
4. Build notification infrastructure
5. Research and document all 7 framework requirements
6. Design enhanced materiality UI/UX
7. Implement reports generation engine

**Estimated Total Effort:** 7-8 weeks for full implementation
**Team Required:** 1 Full-stack Developer + 1 Sustainability Expert (for validation)
