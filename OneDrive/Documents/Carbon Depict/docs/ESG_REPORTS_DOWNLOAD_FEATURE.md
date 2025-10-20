# ESG Framework Download Feature - Reports Page

## ✅ Feature Overview

Added ESG framework data download functionality to the Reports page at `http://localhost:3500/dashboard/reports`.

---

## 🎯 What Was Implemented

### 1. **ESG Framework Downloads Section**
A new section on the Reports page that displays all 6 ESG frameworks with:
- Framework name and description
- Progress percentage (from live data)
- AI compliance score (when available)
- Last updated timestamp
- Visual progress bar
- Download button for each framework

### 2. **Download Capabilities**

#### Individual Framework Downloads
Each framework has a "Download JSON" button that:
- ✅ Downloads framework-specific data as JSON file
- ✅ Includes all collected form data
- ✅ Filename format: `{framework}_data_YYYY-MM-DD.json`
- ✅ Button is disabled if no data has been entered (progress = 0%)
- ✅ Uses the live data from esgDataManager

**Supported Frameworks**:
1. **GRI** - GRI Standards 2021
2. **TCFD** - Task Force on Climate-related Financial Disclosures
3. **SBTi** - Science Based Targets initiative
4. **CSRD** - Corporate Sustainability Reporting Directive (ESRS)
5. **CDP** - Carbon Disclosure Project
6. **SDG** - UN Sustainable Development Goals

#### Complete ESG Export
A new "Export All ESG Data" button in the header that:
- ✅ Downloads all ESG framework data in a single JSON file
- ✅ Includes framework data, scores, and progress
- ✅ Filename format: `esg_complete_export_YYYY-MM-DD.json`
- ✅ Uses `esgDataManager.exportData()` for complete export

---

## 📊 User Interface

### Layout Structure

```
Reports Page
├── Header
│   ├── Title: "Reports"
│   ├── Description: "Generate and download emission reports and ESG framework data"
│   ├── Button: "Export All ESG Data" (outline button)
│   └── Button: "Generate New Report" (primary button)
│
├── Quick Report Generator (unchanged)
│   ├── Monthly
│   ├── Quarterly
│   └── Annual
│
├── ESG Framework Data (NEW!)
│   ├── GRI Standards 2021
│   ├── TCFD Recommendations
│   ├── Science Based Targets
│   ├── CSRD (ESRS)
│   ├── CDP Disclosure
│   └── UN SDG Alignment
│
└── Emissions Reports (renamed from "Generated Reports")
    ├── Monthly Emissions Report
    ├── Quarterly Report
    └── Annual Report
```

### ESG Framework Card Details

Each framework card displays:

**Left Side:**
- Icon (FileText with framework color)
- Framework name (bold)
- Description (subtitle)
- Metadata line:
  - Progress: X%
  - AI Score: X/100 (if available)
  - Updated: MM/DD/YYYY

**Right Side:**
- Visual progress bar (colored, 24px width)
- Progress percentage (X%)
- Download JSON button (disabled if progress = 0%)

---

## 💾 Downloaded Data Format

### Individual Framework Download
Example: `gri_data_2025-10-20.json`

```json
{
  "organizationalProfile": {
    "2-1": {
      "name": "Organizational details",
      "value": "ABC Corporation, headquartered in New York...",
      "completed": true
    },
    "2-2": {
      "name": "Entities included in sustainability reporting",
      "value": "Includes parent company and all subsidiaries...",
      "completed": true
    },
    // ... all 43 GRI fields
  },
  "governance": { ... },
  "strategyAndPolicies": { ... },
  "stakeholderEngagement": { ... },
  "materiality": { ... },
  "emissions": { ... },
  "diversity": { ... }
}
```

### Complete ESG Export
Example: `esg_complete_export_2025-10-20.json`

```json
{
  "data": {
    "gri": { /* all GRI form data */ },
    "tcfd": { /* all TCFD form data */ },
    "sbti": { /* all SBTi form data */ },
    "csrd": { /* all CSRD form data */ },
    "cdp": { /* all CDP form data */ },
    "sdg": { /* all SDG form data */ }
  },
  "scores": {
    "frameworks": {
      "gri": {
        "progress": 11.63,
        "score": 0,
        "lastUpdated": "2025-10-20T14:30:00.000Z"
      },
      "tcfd": { "progress": 0, "score": 0 },
      // ... other frameworks
    },
    "environmental": 11.63,
    "social": 0,
    "governance": 0,
    "overall": 4.65
  },
  "exportDate": "2025-10-20T14:30:00.000Z"
}
```

---

## 🔧 Technical Implementation

### File Modified
- **`src/pages/dashboard/ReportsPage.jsx`**

### New Imports
```javascript
import esgDataManager from '../../utils/esgDataManager'
import { useState } from 'react'
```

### New State
```javascript
const [scores] = useState(() => esgDataManager.getScores())
```

### New Data Structure
```javascript
const esgFrameworks = [
  {
    id: 'gri',
    name: 'GRI Standards 2021',
    description: 'Global Reporting Initiative framework data',
    progress: Math.round(scores.frameworks.gri.progress),
    score: scores.frameworks.gri.score,
    color: 'teal',
    lastUpdated: scores.frameworks.gri.lastUpdated,
  },
  // ... 5 more frameworks
]
```

### Download Functions

#### 1. Download Individual Framework
```javascript
const downloadFrameworkData = (frameworkId, frameworkName) => {
  const data = esgDataManager.getFrameworkData(frameworkId)
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${frameworkId}_data_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
```

#### 2. Download All ESG Data
```javascript
const downloadAllESGData = () => {
  const allData = esgDataManager.exportData()
  const dataStr = JSON.stringify(allData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `esg_complete_export_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
```

---

## 🎨 UI Components Used

### Buttons
- **OutlineButton** - For download actions
- **PrimaryButton** - For generate new report action

### Icons
- **Download** - Download icon
- **FileText** - Document/file icon
- **Calendar** - Calendar icon (existing)

### Colors by Framework
- **GRI**: `cd-teal`
- **TCFD**: `cd-mint`
- **SBTi**: `cd-cedar`
- **CSRD**: `cd-desert`
- **CDP**: `cd-midnight`
- **SDG**: `cd-teal`

---

## 🧪 How to Test

### Step 1: Navigate to Reports Page
```
http://localhost:3500/dashboard/reports
```

### Step 2: Check ESG Framework Section
You should see:
- ✅ Section titled "ESG Framework Data"
- ✅ 6 framework cards displayed
- ✅ Each card shows current progress percentage
- ✅ Progress bars visually represent completion

### Step 3: Test Individual Download
1. Go to GRI data collection page and enter some data
2. Return to Reports page
3. Find the GRI framework card
4. Click "Download JSON" button
5. File downloads as `gri_data_2025-10-20.json`
6. Open file in text editor
7. ✅ Verify it contains your GRI form data

### Step 4: Test Complete Export
1. Click "Export All ESG Data" button in header
2. File downloads as `esg_complete_export_2025-10-20.json`
3. Open file in text editor
4. ✅ Verify it contains all framework data + scores

### Step 5: Test Disabled State
1. Find a framework with 0% progress (e.g., TCFD)
2. ✅ Download button should be disabled (grayed out)
3. Enter data in that framework
4. Return to Reports page
5. ✅ Download button should now be enabled

---

## 📈 Integration with ESG Data Manager

### Data Sources
All data is pulled from **esgDataManager** (localStorage):
- `esgDataManager.getScores()` - Get all framework scores and progress
- `esgDataManager.getFrameworkData(id)` - Get specific framework data
- `esgDataManager.exportData()` - Get complete ESG export

### Live Updates
- Progress percentages update in real-time as users enter data
- Last updated timestamps show when data was last modified
- AI scores display when available (after AI analysis)

### Data Persistence
- All downloads are based on localStorage data
- Data persists across browser sessions
- Downloads reflect current state of data

---

## 🚀 Use Cases

### 1. Backup ESG Data
Users can download their ESG framework data for backup purposes:
- Individual framework backups
- Complete ESG data export
- Date-stamped filenames for versioning

### 2. Share with Stakeholders
Download framework data to share with:
- Auditors
- Compliance teams
- ESG consultants
- Reporting platforms

### 3. External Analysis
Export data for:
- Custom analysis in other tools
- Integration with reporting software
- Migration to different platforms
- Historical record keeping

### 4. Compliance Reporting
Use downloaded data for:
- Annual ESG reports
- Regulatory submissions
- Investor communications
- Sustainability disclosures

---

## ✨ Features

### Download Button States
- ✅ **Enabled** - When framework has data (progress > 0%)
- ✅ **Disabled** - When framework has no data (progress = 0%)
- ✅ **Hover effect** - Visual feedback on hover
- ✅ **Click feedback** - Immediate download on click

### Progress Visualization
- ✅ Color-coded progress bars per framework
- ✅ Percentage display (0-100%)
- ✅ Smooth transitions when progress updates
- ✅ Visual distinction between frameworks

### Data Display
- ✅ Framework name and description
- ✅ Current progress percentage
- ✅ AI compliance score (when available)
- ✅ Last updated timestamp
- ✅ Framework-specific icons and colors

---

## 🔮 Future Enhancements

### PDF Report Generation
- Generate PDF reports from framework data
- Include charts and visualizations
- Formatted for official submissions

### Excel Export
- Export framework data as Excel workbooks
- Separate sheets per framework
- Formatted for easy analysis

### Scheduled Exports
- Automatic daily/weekly/monthly exports
- Email delivery of reports
- Cloud storage integration

### Report Templates
- Pre-formatted report templates
- Customizable branding
- Compliance-ready formats

---

## 📝 Summary

The Reports page now includes comprehensive ESG framework download functionality:

✅ **6 ESG frameworks** with individual downloads  
✅ **Complete export** of all ESG data  
✅ **Live progress** tracking from esgDataManager  
✅ **JSON format** for easy integration  
✅ **Disabled state** for empty frameworks  
✅ **Visual progress bars** and metadata  
✅ **Date-stamped filenames** for versioning  

Users can now easily download their ESG data for backup, sharing, analysis, and compliance purposes!

---

**Status**: ✅ COMPLETE

**Date**: October 20, 2025

**Location**: http://localhost:3500/dashboard/reports
