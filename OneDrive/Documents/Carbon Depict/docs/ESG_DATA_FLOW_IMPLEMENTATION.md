# ESG Data Flow & AI Scoring Implementation Plan

## 📊 System Architecture

### Data Flow
```
User Input (Data Collection Pages)
    ↓
ESG Data Manager (localStorage)
    ↓
Progress Calculation (Real-time)
    ↓
ESG Dashboard (Live Updates)
    ↓
AI Scoring Service (Framework Compliance)
    ↓
Score Updates (Dashboard Refresh)
```

---

## ✅ Phase 1: Data Persistence (COMPLETE)

### Created Files
1. **`src/utils/esgDataManager.js`** - Centralized data management
   - LocalStorage persistence
   - Progress tracking
   - Score management
   - Data export/import

2. **`src/data/frameworks/griFramework.js`** - GRI specification
   - All GRI Standards 2021 requirements
   - Scoring criteria per disclosure
   - Quality factors
   - Examples and guidance

### Key Features
- ✅ Save framework data to localStorage
- ✅ Calculate progress in real-time
- ✅ Persist scores across sessions
- ✅ Export/import for backup

---

## 🔄 Phase 2: Connect Data Collection to Dashboard (NEXT)

### Changes Needed

#### 1. Update GRI Data Collection Page
**File**: `src/pages/dashboard/GRIDataCollection.jsx`

**Changes**:
```javascript
import esgDataManager from '../../utils/esgDataManager';

// In component:
const [formData, setFormData] = useState(() => {
  const saved = esgDataManager.getFrameworkData('gri');
  return Object.keys(saved).length > 0 ? saved : initialGRIData;
});

// Save on change:
const handleInputChange = (section, field, value) => {
  const updated = {
    ...formData,
    [section]: {
      ...formData[section],
      [field]: {
        ...formData[section][field],
        value,
        completed: value.trim() !== '',
      },
    },
  };
  setFormData(updated);
  esgDataManager.saveFrameworkData('gri', updated);
};
```

#### 2. Update ESG Dashboard Home
**File**: `src/pages/dashboard/ESGDashboardHome.jsx`

**Changes**:
```javascript
import esgDataManager from '../../utils/esgDataManager';

// Replace mock data with real data:
const [scores, setScores] = useState(() => esgDataManager.getScores());

// Refresh on mount:
useEffect(() => {
  const refreshScores = () => {
    setScores(esgDataManager.getScores());
  };
  
  // Refresh every 5 seconds while on page
  const interval = setInterval(refreshScores, 5000);
  return () => clearInterval(interval);
}, []);

// Use real framework progress:
const frameworks = [
  { 
    name: 'GRI', 
    progress: scores.frameworks.gri.progress,
    score: scores.frameworks.gri.score,
    // ...
  },
  // ...
];
```

#### 3. Repeat for All Frameworks
- TCFD → tcfd
- SBTi → sbti
- CSRD → csrd
- CDP → cdp
- SDG → sdg

---

## 🤖 Phase 3: AI Scoring Service (FUTURE)

### API Structure

#### Endpoint
```
POST /api/ai/score-framework
```

#### Request Body
```json
{
  "framework": "gri",
  "data": {
    "2-1": {
      "name": "Organizational details",
      "value": "ABC Corporation is a publicly traded...",
      "completed": true
    },
    // ... all disclosures
  },
  "metadata": {
    "totalFields": 43,
    "completedFields": 38,
    "progress": 88
  }
}
```

#### Response
```json
{
  "framework": "gri",
  "overallScore": 82,
  "breakdown": {
    "mandatoryDisclosures": 85,
    "recommendedDisclosures": 78,
    "qualityFactors": 80
  },
  "disclosureScores": {
    "2-1": {
      "score": 90,
      "feedback": "Excellent coverage of all required elements",
      "suggestions": ["Consider adding more detail on countries of operation"],
      "criteriaMatched": 4,
      "criteriaTotal": 5
    },
    // ... per disclosure
  },
  "topStrengths": [
    "Comprehensive governance disclosures",
    "Strong quantitative emission data",
    "Year-over-year comparisons provided"
  ],
  "improvementAreas": [
    "Add more detail to stakeholder engagement process",
    "Include supplier diversity metrics",
    "Provide assurance for social metrics"
  ],
  "timestamp": "2025-10-20T10:30:00Z"
}
```

### AI Prompt Structure

```
You are an expert GRI Standards auditor. Analyze the following disclosure against GRI Standards 2021.

DISCLOSURE: ${disclosureCode} - ${disclosureName}

REQUIREMENTS:
${framework.requirements}

SCORING CRITERIA:
${framework.scoringCriteria}

USER RESPONSE:
${userValue}

EXPECTED FORMAT: ${framework.expectedFormat}
MINIMUM WORDS: ${framework.minimumWords}

Evaluate:
1. Completeness (all criteria addressed?)
2. Quality (specific, quantified, verifiable?)
3. Alignment (matches GRI guidance?)
4. Examples (concrete, relevant?)

Provide:
- Score (0-100)
- Criteria matched (X of Y)
- Specific feedback
- Improvement suggestions
```

### Implementation Steps

1. **Backend API** (`server/routes/ai-scoring.js`)
   - Endpoint to receive framework data
   - Load framework specification
   - Call OpenAI/Claude API
   - Calculate weighted score
   - Return detailed feedback

2. **Frontend Integration** (`src/utils/aiScoringService.js`)
   - Send data for analysis
   - Display loading state
   - Update scores in ESGDataManager
   - Show feedback to user

3. **UI Components**
   - "Analyze with AI" button on each framework page
   - Score display with breakdown
   - Feedback panels per disclosure
   - Progress toward target score

---

## 📋 Framework Specifications (To Create)

### Priority Order
1. ✅ **GRI** - Created (`griFramework.js`)
2. ⏳ **TCFD** - Next (`tcfdFramework.js`)
3. ⏳ **SBTi** - (`sbtiFramework.js`)
4. ⏳ **CSRD** - (`csrdFramework.js`)
5. ⏳ **CDP** - (`cdpFramework.js`)
6. ⏳ **SDG** - (`sdgFramework.js`)

### Structure (Same for All)
```javascript
export const FRAMEWORK_NAME = {
  meta: { /* name, version, organization, description, url */ },
  requirements: {
    'code': {
      code: 'unique-id',
      title: 'Requirement title',
      requirement: 'What must be disclosed',
      pillar: 'environmental|social|governance',
      mandatory: true|false,
      expectedFormat: 'text|quantitative|list',
      minimumWords: 50,
      scoringCriteria: [/* bullet points */],
      examples: [/* good examples */],
    },
    // ... all requirements
  },
  scoringWeights: { /* how to calculate score */ },
  qualityFactors: { /* completeness, evidence, clarity */ },
};
```

---

## 🎯 Implementation Checklist

### Phase 2: Live Data Flow (THIS WEEK)
- [ ] Update `GRIDataCollection.jsx` to use `esgDataManager`
- [ ] Update `TCFDDataCollection.jsx` to use `esgDataManager`
- [ ] Update `SBTiDataCollection.jsx` to use `esgDataManager`
- [ ] Update `CSRDDataCollection.jsx` to use `esgDataManager`
- [ ] Update `CDPDataCollection.jsx` to use `esgDataManager`
- [ ] Update `SDGDataCollection.jsx` to use `esgDataManager`
- [ ] Update `ESGDashboardHome.jsx` to display live scores
- [ ] Test data persistence across page refreshes
- [ ] Test progress calculation accuracy

### Phase 3: Framework Specs (THIS WEEK)
- [ ] Create `tcfdFramework.js` (11 fields)
- [ ] Create `sbtiFramework.js` (27 fields)
- [ ] Create `csrdFramework.js` (94 fields)
- [ ] Create `cdpFramework.js` (114 fields)
- [ ] Create `sdgFramework.js` (85 fields)

### Phase 4: AI Integration (NEXT WEEK)
- [ ] Set up OpenAI API key
- [ ] Create `server/services/aiScoringService.js`
- [ ] Create `server/routes/ai-scoring.js`
- [ ] Create `src/utils/aiScoringClient.js`
- [ ] Add "Analyze with AI" button to framework pages
- [ ] Display AI scores on dashboard
- [ ] Show per-disclosure feedback
- [ ] Add improvement suggestions panel

---

## 💡 Quick Start Guide

### Test Data Flow Now

1. **Save Test Data**:
```javascript
// In browser console:
import esgDataManager from './src/utils/esgDataManager.js';

// Save test GRI data
esgDataManager.saveFrameworkData('gri', {
  organizationalProfile: {
    '2-1': { 
      name: 'Organizational details', 
      value: 'Test Company Inc.', 
      completed: true 
    },
  },
});
```

2. **Check Dashboard**:
```javascript
// In browser console:
const scores = esgDataManager.getScores();
console.log(scores.frameworks.gri.progress); // Should show progress
```

3. **Verify Persistence**:
- Refresh page
- Check `localStorage` in DevTools
- Look for `carbondepict_esg_data`

---

## 🔮 Future Enhancements

1. **Real-time Collaboration** (WebSockets)
   - Multiple users editing simultaneously
   - Live progress updates
   - Conflict resolution

2. **Advanced AI Features**
   - Auto-fill suggestions based on previous years
   - Industry benchmark comparisons
   - Gap analysis (missing disclosures)
   - Materiality assessment AI

3. **Reporting Engine**
   - Generate GRI-compliant PDF reports
   - Auto-populate report templates
   - Include AI scores and feedback
   - Comparison tables (YoY, vs peers)

4. **Audit Trail**
   - Version history for each disclosure
   - Change tracking
   - Approval workflows
   - Assurance-ready data

---

**Status**: Phase 1 Complete (Data Manager + GRI Spec)  
**Next**: Phase 2 (Connect all pages to live data)  
**Timeline**: Phase 2-3 this week, Phase 4 next week  
**Version**: 2.0.1  
**Last Updated**: October 20, 2025
