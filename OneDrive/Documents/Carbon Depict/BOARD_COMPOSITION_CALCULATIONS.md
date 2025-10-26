# Board Composition - Governance Metrics Documentation

## Overview
The Board Composition data collection form provides comprehensive governance metrics aligned with GRI 2-9, GRI 405-1, CSRD G1-1, and TCFD governance disclosure requirements.

---

## 🧮 Automated Calculation Functions

### 1. **Board Independence Ratio**

**Purpose:** Measure the percentage of independent directors on the board

**Function:**
```javascript
calculateIndependenceRatio(independent, total)
```

**Formula:**
```
Independence Ratio (%) = (Number of Independent Directors ÷ Total Directors) × 100
```

**Example:**
- Independent Directors: 6
- Total Directors: 10
- Independence Ratio = (6 ÷ 10) × 100 = **60%**

**Framework Requirements:**
- **GRI 2-9:** Governance structure and composition
- **CSRD G1-1:** Composition of administrative, management and supervisory bodies
- **TCFD:** Board oversight of climate-related issues

**Best Practice Benchmarks:**
- **≥ 50%:** Best practice (majority independent)
- **33-50%:** Adequate but below best practice
- **< 33%:** Below recommended level

**Definition of Independence:**
An independent director has no material relationship with the company that could interfere with exercising independent judgment. This includes:
- Not being a current or recent employee
- Not having significant business relationships
- Not being a family member of executives
- Not receiving compensation beyond director fees

---

### 2. **Gender Diversity Metrics**

**Purpose:** Calculate female representation on the board

**Function:**
```javascript
calculateDiversityMetrics(category, total)
```

**Formula:**
```
Gender Diversity (%) = (Female Directors ÷ Total Directors) × 100
Gender Ratio = Female:Male
```

**Example:**
- Female Directors: 4
- Total Directors: 10
- Female Representation = (4 ÷ 10) × 100 = **40%**
- Gender Ratio = **4:6**

**Framework Requirements:**
- **GRI 405-1:** Diversity of governance bodies and employees
- **CSRD G1-1:** Gender balance in administrative, management and supervisory bodies

**Best Practice Benchmarks:**
- **40-60%:** Excellent gender balance (parity zone)
- **30-40%:** Good progress toward parity
- **< 30%:** Below recommended target

**Regulatory Landscape:**
- **EU:** Many countries mandate 40% female representation on boards
- **UK:** FTSE 350 target of 40% women on boards by 2025
- **US:** California requires minimum female board representation
- **Global:** Increasing trend toward 30-40% minimums

---

### 3. **Average Board Age Calculator**

**Purpose:** Calculate estimated average age of board members

**Function:**
```javascript
calculateAverageAge(under50, age50to70, over70)
```

**Formula:**
```
Average Age = ((Under 50 × 40) + (50-70 × 60) + (Over 70 × 75)) ÷ Total Directors
```

**Methodology:**
Uses midpoint of each age bracket for weighted average calculation:
- Under 50: Uses 40 years as midpoint
- 50-70: Uses 60 years as midpoint
- Over 70: Uses 75 years as midpoint

**Example:**
- Directors Under 50: 2 (weighted at 40 years)
- Directors 50-70: 6 (weighted at 60 years)
- Directors Over 70: 2 (weighted at 75 years)
- Average = ((2×40) + (6×60) + (2×75)) ÷ 10 = **59 years**

**Framework Requirements:**
- **GRI 405-1:** Diversity by age group
- **CSRD G1-1:** Age diversity of governance bodies

**Interpretation:**
- **< 55:** Younger board, may lack experience
- **55-65:** Balanced age profile
- **> 65:** Older board, succession planning recommended

---

### 4. **Average Board Tenure Calculator**

**Purpose:** Calculate average length of service for board members

**Function:**
```javascript
calculateAverageTenure(under3, years3to6, years6to9, over9)
```

**Formula:**
```
Average Tenure = ((< 3 yrs × 1.5) + (3-6 yrs × 4.5) + (6-9 yrs × 7.5) + (> 9 yrs × 10)) ÷ Total
```

**Methodology:**
Uses midpoint of each tenure bracket:
- Under 3 years: 1.5 years
- 3-6 years: 4.5 years
- 6-9 years: 7.5 years
- Over 9 years: 10 years (conservative estimate)

**Example:**
- Under 3 years: 3 directors
- 3-6 years: 4 directors
- 6-9 years: 2 directors
- Over 9 years: 1 director
- Average = ((3×1.5) + (4×4.5) + (2×7.5) + (1×10)) ÷ 10 = **4.95 years**

**Framework Requirements:**
- **CSRD G1-1:** Tenure of administrative, management and supervisory bodies

**Interpretation:**
- **< 3 years:** High turnover, potential instability
- **3-7 years:** Optimal balance of fresh perspectives and experience
- **> 9 years:** Risk of entrenched thinking, review term limits

**Best Practice:**
- Stagger board terms for continuity
- Consider term limits (e.g., 9-12 years maximum)
- Regular board refreshment (1-2 new members per year)

---

### 5. **Climate/ESG Expertise Percentage**

**Purpose:** Measure board competence in climate-related issues

**Function:**
```javascript
calculateDiversityMetrics(climateExperts, total)
```

**Formula:**
```
Climate Expertise (%) = (Directors with Climate/ESG Expertise ÷ Total Directors) × 100
```

**Example:**
- Directors with Climate Expertise: 3
- Total Directors: 10
- Climate Expertise = (3 ÷ 10) × 100 = **30%**

**Framework Requirements:**
- **TCFD:** Describe board members' expertise in climate-related issues
- **CSRD G1-1:** Expertise and skills of administrative, management bodies

**What Counts as Climate/ESG Expertise:**
- Background in environmental science or policy
- Experience in sustainability management
- ESG investment expertise
- Renewable energy industry experience
- Climate risk management
- Circular economy experience
- Corporate sustainability leadership

**Best Practice:**
- **Minimum:** At least 1 board member with deep climate expertise
- **Target:** 20-30% of board with climate/ESG competence
- **Leading Practice:** Dedicated ESG/Sustainability Committee

---

## 📊 Key Governance Definitions

### Board Roles

#### **Executive (Inside) Directors**
Directors who are also employees or executives of the company.
- Typically includes CEO, CFO
- Deep operational knowledge
- May have conflicts of interest

#### **Non-Executive (Outside) Directors**
Directors who are not employees of the company.
- Provide independent oversight
- Bring external perspective
- Reduce management self-dealing

#### **Independent Directors**
Non-executive directors with no material relationship with the company.
- No business relationships
- No former employment (typically 3-5 year cooling-off period)
- No family relationships with executives
- Critical for board objectivity

#### **Board Chair**
Presides over board meetings and sets board agenda.
- Should ideally be independent
- Separate from CEO role (best practice)
- Facilitates board effectiveness

---

### Diversity Dimensions

#### **Gender Diversity**
- Male, Female, Non-binary
- Target: 40-60% representation for balance
- Many jurisdictions have minimum requirements

#### **Age Diversity**
- Multiple generations provide different perspectives
- Balance between experience and fresh thinking
- Avoid age discrimination

#### **Ethnic/Cultural Diversity**
- Representation of minority groups
- Geographic diversity for global companies
- Cultural competence for international markets

#### **Skills Diversity**
- Financial expertise (audit committee requirement)
- Industry knowledge
- Technology/digital
- ESG/Climate
- Risk management
- Legal/Regulatory

---

## 🎯 Framework Compliance

### GRI Standards

| Standard | Requirement | Data Needed |
|----------|-------------|-------------|
| **GRI 2-9** | Governance structure and composition | Board size, structure, independence |
| **GRI 2-10** | Nomination and selection | Process for selecting board members |
| **GRI 2-11** | Chair of highest governance body | Chair role, independence from management |
| **GRI 405-1** | Diversity of governance bodies | Gender, age, other diversity metrics |

### CSRD (ESRS G1-1)

**Administrative, Management and Supervisory Bodies:**
- Number of members
- Gender distribution
- Age distribution
- Percentage of independent members
- Expertise and skills
- Tenure and turnover

### TCFD Governance Disclosures

**Board Oversight:**
- Describe board oversight of climate-related risks and opportunities
- Processes by which board is informed about climate issues
- How board monitors and oversees progress against climate goals
- Board member expertise in climate-related issues

---

## 📈 Best Practices

### Board Composition

**Size:**
- **Small (5-7):** Nimble but limited expertise
- **Medium (8-12):** Most common, good balance
- **Large (13+):** Diverse but harder to manage

**Optimal Size:** 9-11 directors for public companies

### Independence

**Target:** ≥ 50% independent directors
- **Audit Committee:** 100% independent
- **Compensation Committee:** 100% independent
- **Nomination Committee:** Majority independent

### Diversity

**Gender:**
- Target 40-60% for gender parity
- Avoid tokenism (at least 3 women for critical mass)

**Skills:**
- Publish board skills matrix
- Identify skill gaps
- Targeted recruitment

**Age:**
- Mix of ages (40s-70s optimal range)
- Avoid age clustering
- Regular board refreshment

### Tenure

**Optimal Range:** 4-8 years average
- **Too Short (< 3 yrs):** High turnover, instability
- **Too Long (> 9 yrs):** Entrenched, groupthink risk
- **Best Practice:** Stagger terms, regular refreshment

---

## 🔮 Advanced Metrics (Future Implementation)

### Planned Additions:

1. **Board Diversity Score**
   - Composite metric combining gender, age, ethnicity
   - Benchmark against industry peers

2. **Board Independence Quality**
   - Not just quantity but quality of independence
   - Length of independence, relationship history

3. **Board Skills Gap Analysis**
   - Match required skills to current composition
   - Identify recruitment priorities

4. **Board Succession Planning**
   - Projected retirements
   - Recommended new director profiles

5. **Board Meeting Productivity**
   - Hours spent on strategic vs. operational issues
   - Climate/ESG agenda time percentage

6. **Director Network Analysis**
   - Interlocking directorships
   - External board commitments

---

## 📚 International Standards

### Corporate Governance Codes

**UK Corporate Governance Code:**
- At least half the board should be independent non-executives
- Chair should be independent on appointment
- Separate chair and CEO roles

**US NYSE/NASDAQ:**
- Majority independent directors required
- Independent audit, compensation, nomination committees

**EU Corporate Governance Framework:**
- Gender diversity requirements (40% target)
- Skills and diversity disclosure

**OECD Principles of Corporate Governance:**
- Board should act in best interest of company and shareholders
- Exercise independent judgment
- Devote sufficient time to responsibilities

---

## ✅ Implementation Checklist

- [x] Board independence ratio calculation
- [x] Gender diversity metrics calculation
- [x] Average age estimation
- [x] Average tenure calculation
- [x] Climate expertise percentage
- [x] Real-time calculations as data entered
- [x] Comprehensive analytics summary
- [x] Best practice benchmarks
- [x] Framework guidance (GRI, CSRD, TCFD)
- [x] No console errors
- [x] Responsive design

---

## 💡 Data Collection Tips

### Board Information Sources

1. **Annual Report**
   - Board composition tables
   - Director biographies
   - Attendance records

2. **Proxy Statement (SEC Form DEF 14A)**
   - Detailed director information
   - Independence determinations
   - Committee memberships

3. **Corporate Governance Report**
   - Board policies
   - Diversity initiatives
   - Evaluation processes

4. **Company Website**
   - Board of directors page
   - Committee charters
   - Corporate governance guidelines

### Data Quality

**Accuracy:**
- Verify information from official sources
- Update for any changes during reporting period
- Cross-check with regulatory filings

**Completeness:**
- Collect data for all board members
- Include board committees
- Document any changes (appointments, departures)

**Consistency:**
- Use same criteria for all directors
- Apply independence standards consistently
- Align with prior year reporting

---

## 🎯 Leading Practice Examples

### Best-in-Class Boards

**Characteristics:**
- 50%+ independent directors
- 40-50% female representation
- Diverse age range (45-70)
- Comprehensive skills matrix
- Climate/ESG expertise
- Regular board evaluations
- Published diversity targets
- Strong committee structure

**Climate Governance Leaders:**
- Board-level ESG committee
- Climate expertise on board
- Regular climate risk briefings
- CEO compensation tied to climate targets
- Published climate governance framework

---

**Last Updated:** October 22, 2025
**Version:** 1.0
**Status:** ✅ Production Ready
