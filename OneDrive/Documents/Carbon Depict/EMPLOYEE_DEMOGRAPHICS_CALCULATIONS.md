# Employee Demographics - Automated Calculations Documentation

## Overview
The Employee Demographics data collection form now includes automated calculation functions that process workforce metrics in real-time, helping organizations meet GRI and CSRD reporting requirements.

---

## 🧮 Automated Calculation Functions

### 1. **Turnover Rate Calculator**

**Purpose:** Calculate employee turnover rate as required by GRI 401-1 and CSRD S1-6

**Function:**
```javascript
calculateTurnoverRate(departures, avgEmployees)
```

**Formula:**
```
Turnover Rate (%) = (Total Departures ÷ Average Number of Employees) × 100
```

**Example:**
- Departures: 25 employees
- Average Employees: 200 employees
- Turnover Rate = (25 ÷ 200) × 100 = **12.5%**

**Framework Requirements:**
- **GRI 401-1:** Total number and rate of employee turnover
- **CSRD S1-6:** Employee turnover rates during the reporting period

**Interpretation:**
- < 10%: Low turnover (healthy retention)
- 10-20%: Moderate turnover (industry average)
- > 20%: High turnover (may indicate issues)

---

### 2. **Gender Pay Gap Calculator**

**Purpose:** Calculate gender pay gap as required by GRI 405-2 and CSRD S1-13

**Function:**
```javascript
calculateGenderPayGap(malePay, femalePay)
```

**Formula:**
```
Gender Pay Gap (%) = ((Male Median Pay - Female Median Pay) ÷ Male Median Pay) × 100
```

**Example:**
- Male Median Pay: £50,000
- Female Median Pay: £45,000
- Gender Pay Gap = ((50,000 - 45,000) ÷ 50,000) × 100 = **10%**

**Framework Requirements:**
- **GRI 405-2:** Ratio of basic salary and remuneration of women to men
- **CSRD S1-13:** Gender pay gap (unadjusted and adjusted)

**Interpretation:**
- 0-5%: Excellent pay equity
- 5-15%: Moderate gap, improvement recommended
- > 15%: Significant gap, urgent action needed

**Note:** This is the **unadjusted** pay gap. The adjusted pay gap accounts for factors like job role, experience, and hours worked.

---

### 3. **CEO Pay Ratio Calculator**

**Purpose:** Calculate CEO-to-median employee pay ratio as required by GRI 2-21 and CSRD S1-13

**Function:**
```javascript
calculateCEOPayRatio(ceoCompensation, medianEmployeeCompensation)
```

**Formula:**
```
CEO Pay Ratio = CEO Total Compensation ÷ Median Employee Compensation
```

**Example:**
- CEO Total Compensation: £2,500,000
- Median Employee Compensation: £35,000
- CEO Pay Ratio = 2,500,000 ÷ 35,000 = **71:1**

**Framework Requirements:**
- **GRI 2-21:** Annual total compensation ratio
- **CSRD S1-13:** Ratio between highest paid individual and median

**Interpretation:**
- < 50:1: Low ratio (more equitable)
- 50-200:1: Moderate ratio (typical for mid-size companies)
- > 200:1: High ratio (may raise stakeholder concerns)

---

### 4. **Worker Categorization Calculator**

**Purpose:** Properly categorize direct employees vs. contractors as required by GRI 2-7 and GRI 2-8

**Function:**
```javascript
categorizeWorkers(totalEmployees, contractors)
```

**Output:**
- Direct Employees (GRI 2-7)
- Indirect Workers (GRI 2-8)
- Total Workforce
- Employee Percentage

**Example:**
- Total Employees: 500
- Contractors: 75
- Results:
  - Direct Employees: 500
  - Indirect Workers: 75
  - Total Workforce: 575
  - Employee Percentage: 87.0%

**Framework Requirements:**
- **GRI 2-7:** Employees (direct workers with employment contract)
- **GRI 2-8:** Workers who are not employees (contractors, consultants, agency workers)
- **CSRD S1-6:** Characteristics of own employees

**Critical Distinction:**
- **Employees:** Workers with direct employment contract with the organization
- **Non-Employees:** Independent contractors, consultants, temporary agency workers, on-call workers

---

## 📊 Additional Automated Metrics

### 5. **Gender Distribution Analysis**

**Automatic Calculation:**
When male and female employee counts are entered, the system automatically calculates:
- Percentage of male employees
- Percentage of female employees
- Percentage of non-binary employees (if applicable)

**Example:**
- Male: 300 (60%)
- Female: 180 (36%)
- Non-binary: 20 (4%)
- Total: 500 (100%)

---

## 🎯 How to Use Automated Calculations

### Step 1: Enter Data
Fill in the required fields in each category:
- **Workforce Composition:** Total employees, contractors
- **New Hires & Turnover:** Departures, new hires
- **Pay & Compensation:** Pay gap, CEO ratio

### Step 2: View Real-Time Calculations
Automated calculations appear in **green boxes** below the form fields when sufficient data is entered.

### Step 3: Show Full Summary
Click the **"Show Automated Calculations"** button at the bottom of the form to see a comprehensive summary of all calculated metrics.

### Step 4: Interpret Results
Each calculation includes:
- ✅ The calculated value
- 📐 The formula used
- 📊 Contextual interpretation (where applicable)

---

## 🏗️ Technical Implementation

### React Hooks Used:
- `useCallback`: Memoizes calculation functions to prevent unnecessary re-renders
- `useMemo`: Caches computed values
- `useState`: Manages calculation visibility state

### Performance Optimizations:
- Calculations only run when relevant data changes
- Conditional rendering prevents unnecessary DOM updates
- Memoized functions reduce function recreation on each render

### Formula Display:
Each calculation shows:
1. **Input values** used in the calculation
2. **Formula** with actual numbers substituted
3. **Result** prominently displayed
4. **Interpretation** (for key metrics)

---

## 📋 Framework Compliance Matrix

| Metric | GRI Standard | CSRD Standard | Calculation Status |
|--------|-------------|---------------|-------------------|
| Workforce Composition | GRI 2-7, 2-8 | CSRD S1-6 | ✅ Automated |
| Gender Distribution | GRI 405-1 | CSRD S1-9 | ✅ Automated |
| Turnover Rate | GRI 401-1 | CSRD S1-6 | ✅ Automated |
| Gender Pay Gap | GRI 405-2 | CSRD S1-13 | ✅ Automated |
| CEO Pay Ratio | GRI 2-21 | CSRD S1-13 | ✅ Automated |

---

## 🔮 Future Enhancements

### Planned Additions:
1. **Age Distribution Analysis** - Automated age bracket percentages
2. **Diversity Ratios** - Ethnic minority representation calculations
3. **Retention Rate** - Inverse of turnover rate
4. **New Hire Rate** - (New Hires ÷ Total Employees) × 100
5. **Voluntary vs. Involuntary Turnover Breakdown** - Separate rate calculations
6. **Pay Equity by Job Level** - Granular pay gap analysis
7. **Benchmark Comparisons** - Industry average comparisons

### API Integration:
- Save calculated metrics to database
- Historical trend analysis
- Year-over-year comparisons
- Export to ESG reports

---

## 📚 References

**GRI Standards:**
- GRI 2-7: Employees
- GRI 2-8: Workers who are not employees
- GRI 2-21: Annual total compensation ratio
- GRI 401-1: New employee hires and employee turnover
- GRI 405-1: Diversity of governance bodies and employees
- GRI 405-2: Ratio of basic salary and remuneration of women to men

**CSRD Standards:**
- CSRD S1-6: Characteristics of the undertaking's employees
- CSRD S1-9: Diversity metrics
- CSRD S1-13: Remuneration metrics (pay gap and pay ratios)

---

## ✅ Testing Checklist

- [x] Turnover rate calculation works correctly
- [x] Gender pay gap calculation works correctly
- [x] CEO pay ratio calculation works correctly
- [x] Worker categorization calculation works correctly
- [x] Gender distribution percentages calculate correctly
- [x] Calculations update in real-time when data changes
- [x] Show/Hide calculations button works
- [x] Formula displays are accurate
- [x] No console errors
- [x] Responsive design on all devices

---

## 🐛 Debugging

**Issue Fixed:**
- **Error:** `The requested module does not provide an export named 'UserCheck'`
- **Solution:** Removed `UserCheck` import as it doesn't exist in Icon.jsx exports
- **Status:** ✅ Resolved

**Current Status:**
- All imports validated against Icon.jsx
- No syntax errors
- All calculations tested and working
- Form fully functional

---

## 💡 Tips for Data Entry

1. **Always enter total employees first** - This is used in multiple calculations
2. **Use consistent time periods** - All data should be from the same reporting period
3. **Double-check pay figures** - Ensure median pay figures are accurate
4. **Include all departures** - Count voluntary resignations, retirements, and dismissals
5. **Separate employees from contractors** - Critical for GRI 2-7 vs 2-8 compliance

---

**Last Updated:** October 22, 2025
**Version:** 1.0
**Status:** ✅ Production Ready
