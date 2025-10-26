# Health & Safety - Automated Calculations Documentation

## Overview
The Health & Safety data collection form includes industry-standard safety metric calculations that help organizations meet GRI 403 and CSRD S1-14 reporting requirements.

---

## 🧮 Automated Calculation Functions

### 1. **Lost Time Injury Frequency Rate (LTIFR)**

**Purpose:** Measure the frequency of lost time injuries per million hours worked

**Function:**
```javascript
calculateLTIFR(lostTimeInjuries, hoursWorked)
```

**Formula:**
```
LTIFR = (Number of Lost Time Injuries ÷ Total Hours Worked) × 1,000,000
```

**Example:**
- Lost Time Injuries: 5
- Hours Worked: 2,500,000
- LTIFR = (5 ÷ 2,500,000) × 1,000,000 = **2.0**

**Framework Requirements:**
- **GRI 403-9:** Work-related injuries
- **CSRD S1-14:** Health and safety metrics

**Interpretation:**
- **< 1.0:** Excellent safety performance (world-class)
- **1.0 - 3.0:** Good performance (industry average)
- **> 3.0:** High rate - urgent improvement needed

**Industry Benchmarks:**
- Manufacturing: 1.5 - 3.0
- Construction: 3.0 - 6.0
- Office/Services: < 1.0
- Mining: 2.0 - 4.0

---

### 2. **Total Recordable Injury Frequency Rate (TRIFR)**

**Purpose:** Measure the frequency of all recordable injuries per million hours worked

**Function:**
```javascript
calculateTRIFR(recordableInjuries, hoursWorked)
```

**Formula:**
```
TRIFR = (Number of Recordable Injuries ÷ Total Hours Worked) × 1,000,000
```

**Example:**
- Recordable Injuries: 12
- Hours Worked: 2,500,000
- TRIFR = (12 ÷ 2,500,000) × 1,000,000 = **4.8**

**What Counts as Recordable:**
- Fatalities
- Lost time injuries
- Medical treatment cases
- Restricted work cases
- Any work-related injury requiring treatment beyond first aid

**Framework Requirements:**
- **GRI 403-9:** Work-related injuries
- **CSRD S1-14:** Comprehensive injury reporting

**Interpretation:**
- **< 3.0:** Excellent
- **3.0 - 6.0:** Good
- **> 6.0:** Needs improvement

---

### 3. **Severity Rate (Days Lost Rate)**

**Purpose:** Measure the severity of injuries based on days lost per million hours worked

**Function:**
```javascript
calculateSeverityRate(daysLost, hoursWorked)
```

**Formula:**
```
Severity Rate = (Total Days Lost ÷ Total Hours Worked) × 1,000,000
```

**Example:**
- Days Lost: 150 days
- Hours Worked: 2,500,000
- Severity Rate = (150 ÷ 2,500,000) × 1,000,000 = **60.0**

**Framework Requirements:**
- **GRI 403-9:** Consequences of work-related injuries

**Interpretation:**
- **< 50:** Low severity
- **50 - 150:** Moderate severity
- **> 150:** High severity - serious injuries occurring

**Note:** Higher severity rates indicate more serious injuries even if frequency is low.

---

### 4. **Fatality Rate**

**Purpose:** Measure workplace fatalities per 10 million hours worked

**Function:**
```javascript
calculateFatalityRate(fatalities, hoursWorked)
```

**Formula:**
```
Fatality Rate = (Number of Fatalities ÷ Total Hours Worked) × 10,000,000
```

**Example:**
- Fatalities: 1
- Hours Worked: 5,000,000
- Fatality Rate = (1 ÷ 5,000,000) × 10,000,000 = **2.0**

**Framework Requirements:**
- **GRI 403-9:** Work-related fatalities
- **CSRD S1-14:** Fatality reporting

**Interpretation:**
- **0:** Target for all organizations
- **> 0:** Serious concern requiring investigation and action

**Note:** Uses 10 million hours (vs 1 million) as base because fatalities are rare events.

---

### 5. **Occupational Disease Rate**

**Purpose:** Measure the rate of occupational diseases per 10,000 employees

**Function:**
```javascript
calculateOccupationalDiseaseRate(diseases, employees)
```

**Formula:**
```
Occupational Disease Rate = (Number of Cases ÷ Total Employees) × 10,000
```

**Example:**
- Occupational Disease Cases: 3
- Total Employees: 1,000
- Disease Rate = (3 ÷ 1,000) × 10,000 = **30.0**

**Framework Requirements:**
- **GRI 403-10:** Work-related ill health
- **CSRD S1-14:** Health outcomes

**Common Occupational Diseases:**
- Respiratory diseases (asbestos, dust exposure)
- Musculoskeletal disorders
- Hearing loss
- Skin diseases
- Occupational cancers
- Mental health conditions related to work

---

## 📊 Key Definitions

### Work-Related Injury Categories

#### **Fatality**
Death resulting from a work-related injury or disease, regardless of time between injury and death.

#### **High-Consequence Injury**
Work-related injury that results in:
- An injury from which the worker **cannot** or is **not expected** to recover fully to pre-injury health status within 6 months
- Excludes fatalities

**Examples:**
- Amputations
- Crush injuries
- Burns (2nd or 3rd degree over large area)
- Loss of consciousness
- Significant injuries requiring surgery

#### **Lost Time Injury (LTI)**
Work-related injury resulting in the worker being **unable to perform usual work** and taking time off beyond the day of the incident.

**Includes:**
- Medical treatment beyond first aid
- Days away from work
- Restricted work activity

**Excludes:**
- The day of the injury
- First aid treatment cases

#### **Recordable Injury**
Any work-related injury or illness that requires medical treatment beyond first aid.

**Includes:**
- Fatalities
- Lost time injuries
- Medical treatment cases
- Restricted work
- Job transfers due to injury

#### **First Aid Case**
Minor injuries requiring only basic first aid treatment (not recordable).

**Examples:**
- Minor cuts/scratches
- Minor burns
- Splinters
- Non-prescription medication

#### **Near Miss**
An unplanned event that did not result in injury, illness, or damage but **had the potential** to do so.

---

## 🎯 Framework Compliance

### GRI 403: Occupational Health & Safety

| GRI Standard | Requirement | Data Needed |
|--------------|-------------|-------------|
| **GRI 403-1** | OH&S Management System | System description, ISO 45001 certification |
| **GRI 403-2** | Hazard Identification | Risk assessment process, hazards identified |
| **GRI 403-3** | Occupational Health Services | Health services provided, coverage % |
| **GRI 403-4** | Worker Participation | Safety committees, worker representation |
| **GRI 403-5** | Training | Safety training hours, coverage |
| **GRI 403-8** | OH&S System Coverage | % workers covered by OH&S system |
| **GRI 403-9** | Work-Related Injuries | Fatalities, injuries, LTIFR, TRIFR |
| **GRI 403-10** | Work-Related Ill Health | Occupational diseases, illnesses |

### CSRD S1-14: Health & Safety Metrics

**Required Disclosures:**
- Number and rate of fatalities
- Number and rate of recordable work-related accidents
- Number of cases of recordable work-related ill health
- Number of days lost to work-related injuries and fatalities

---

## 🔢 Calculation Examples

### Example 1: Manufacturing Company

**Data:**
- Employees: 500
- Total Hours Worked: 1,000,000
- Fatalities: 0
- Lost Time Injuries: 2
- Recordable Injuries: 5
- Days Lost: 45
- Occupational Diseases: 1

**Calculated Metrics:**
- **LTIFR** = (2 ÷ 1,000,000) × 1,000,000 = **2.0**
- **TRIFR** = (5 ÷ 1,000,000) × 1,000,000 = **5.0**
- **Severity Rate** = (45 ÷ 1,000,000) × 1,000,000 = **45.0**
- **Fatality Rate** = (0 ÷ 1,000,000) × 10,000,000 = **0**
- **Disease Rate** = (1 ÷ 500) × 10,000 = **20.0**

**Interpretation:** Good safety performance with LTIFR of 2.0 (below manufacturing average). Zero fatalities is excellent. Moderate severity suggests injuries weren't too serious.

---

### Example 2: Construction Company

**Data:**
- Employees: 200
- Total Hours Worked: 400,000
- Fatalities: 1
- Lost Time Injuries: 8
- Recordable Injuries: 15
- Days Lost: 180

**Calculated Metrics:**
- **LTIFR** = (8 ÷ 400,000) × 1,000,000 = **20.0**
- **TRIFR** = (15 ÷ 400,000) × 1,000,000 = **37.5**
- **Severity Rate** = (180 ÷ 400,000) × 1,000,000 = **450.0**
- **Fatality Rate** = (1 ÷ 400,000) × 10,000,000 = **25.0**

**Interpretation:** High injury rates requiring urgent attention. The fatality is a critical incident requiring full investigation. High severity rate indicates serious injuries. Immediate safety improvements needed.

---

## 📈 Best Practices

### Data Collection

1. **Consistent Recording**
   - Use standardized incident report forms
   - Record all incidents immediately
   - Don't wait until end of reporting period

2. **Hours Worked Calculation**
   - Include all actual hours worked
   - Include overtime and temporary workers
   - Exclude vacation, sick leave, holidays
   - Keep accurate time records

3. **Injury Classification**
   - Train supervisors on definitions
   - Use consistent criteria
   - When in doubt, classify as recordable

4. **Near Miss Reporting**
   - Encourage reporting culture
   - No blame approach
   - Track and analyze trends

### Leading vs. Lagging Indicators

**Lagging Indicators** (Reactive - what happened)
- LTIFR, TRIFR (these calculations)
- Fatalities
- Days lost
- Severity rate

**Leading Indicators** (Proactive - preventing incidents)
- Safety training hours
- Near miss reports
- Safety inspections completed
- Risk assessments conducted
- Safety observations
- Safety meeting attendance

**Recommendation:** Track both leading and lagging indicators for comprehensive safety management.

---

## 🎯 Safety Performance Goals

### World-Class Safety Performance Targets

| Metric | Target | Stretch Goal |
|--------|--------|--------------|
| LTIFR | < 1.0 | 0.5 |
| TRIFR | < 3.0 | 1.5 |
| Fatality Rate | 0 | 0 |
| Near Miss Reports | > 10 per employee | > 20 per employee |
| Training Coverage | 100% | 100% + refreshers |
| Safety Inspections | Weekly | Daily |

---

## 🔮 Advanced Metrics (Future Implementation)

### Planned Additions:

1. **Days Away, Restricted, or Transferred (DART) Rate**
   - (DART cases ÷ Hours) × 200,000

2. **Medical Treatment Case Rate**
   - (Medical cases ÷ Hours) × 200,000

3. **First Aid Case Rate**
   - (First aid cases ÷ Hours) × 200,000

4. **Incident Rate by Department**
   - Break down by work area/division

5. **Root Cause Analysis**
   - Automated categorization of incident causes

6. **Trend Analysis**
   - Year-over-year comparisons
   - Moving averages
   - Statistical process control charts

---

## 📚 References

**Standards & Guidelines:**
- **GRI 403:** Occupational Health and Safety (2018)
- **ISO 45001:2018:** Occupational health and safety management systems
- **CSRD ESRS S1:** Own Workforce
- **OSHA Recordkeeping:** 29 CFR 1904
- **ILO Code of Practice:** Recording and notification of occupational accidents and diseases

**Additional Resources:**
- International Labour Organization (ILO)
- UK Health & Safety Executive (HSE)
- US Occupational Safety and Health Administration (OSHA)
- National Safety Council (NSC)

---

## ✅ Implementation Checklist

- [x] LTIFR calculation implemented
- [x] TRIFR calculation implemented
- [x] Severity Rate calculation implemented
- [x] Fatality Rate calculation implemented
- [x] Occupational Disease Rate calculation implemented
- [x] Real-time calculations as data is entered
- [x] Comprehensive calculation summary panel
- [x] Formula displays with explanations
- [x] Interpretation guidelines included
- [x] Framework guidance (GRI 403, CSRD S1-14)
- [x] No console errors
- [x] Responsive design

---

## 🐛 Testing Notes

**Test Scenarios:**
1. ✅ Zero injuries (all rates should be 0)
2. ✅ Single LTI calculation
3. ✅ Multiple recordable injuries
4. ✅ High days lost (severity)
5. ✅ Fatality scenario
6. ✅ Large hours worked values
7. ✅ Small hours worked values
8. ✅ Decimal values handling

**Edge Cases Handled:**
- Division by zero (returns 0)
- Empty/null values (defaults to 0)
- Very large numbers (uses .toLocaleString())
- Decimal precision (fixed to 2 decimal places)

---

## 💡 Tips for Accurate Reporting

### Hours Worked
- Track actual hours, not scheduled hours
- Include overtime and extra shifts
- Don't include paid time off
- Sum hours for all employees and contractors

### Injury Classification
- If uncertain, classify as recordable
- Document decision-making rationale
- Consult with medical professionals when needed
- Follow local legal requirements

### Data Quality
- Conduct regular data audits
- Cross-check with payroll records
- Verify incident reports are complete
- Review calculations quarterly

### Continuous Improvement
- Set annual reduction targets
- Benchmark against industry peers
- Focus on leading indicators
- Celebrate safety milestones

---

**Last Updated:** October 22, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
