# CarbonDepict - Quick Start Guide

## 🚀 Getting Started

### Step 1: Install Dependencies

Frontend dependencies are already installed. Now install backend dependencies:

```powershell
cd server
npm install
```

### Step 2: Configure Environment

Create a `.env` file in the `server` directory:

```powershell
cd server
cp .env.example .env
```

Edit `server/.env` with your configuration (you can use default values for development).

### Step 3: Start Development Servers

**Terminal 1 - Frontend:**
```powershell
npm run dev
```

**Terminal 2 - Backend:**
```powershell
cd server
npm run dev
```

### Step 4: Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

## 📁 What's Been Implemented

### ✅ Frontend (React + Tailwind CSS)

1. **Design System**
   - Custom CarbonDepict Design System (CDDS v1.0)
   - Tailwind configuration with brand colors
   - CSS tokens and global styles
   - Responsive, accessible components

2. **Components**
   - **Atoms**: Button, Input, Select, Textarea, Checkbox, Icons
   - **Molecules**: FeatureCard, Hero, CTAGroup, Alert, MetricCard
   - **Organisms**: Navbar, Footer, Modal

3. **Pages**
   - **Marketing**: HomePage, PricingPage, AboutPage
   - **Auth**: LoginPage, RegisterPage
   - **Dashboard**: DashboardHome, EmissionsPage, ReportsPage, SettingsPage

4. **Layouts**
   - MarketingLayout (with Navbar + Footer)
   - DashboardLayout (with Sidebar + Topbar)

### ✅ Backend (Node.js + Express)

1. **API Routes**
   - `/api/calculate/*` - Emission calculations
   - `/api/factors/*` - DEFRA 2025 emission factors
   - `/api/auth/*` - Authentication
   - `/api/reports/*` - Report generation
   - `/api/ai/*` - AI inference

2. **Structure**
   - Express server with security middleware
   - Rate limiting
   - CORS configuration
   - Error handling

## 🎯 Next Steps

### Priority 1: Database Setup
```powershell
# Install MongoDB locally or use MongoDB Atlas
# Update server/.env with connection string
```

### Priority 2: Implement Database Models
Create Mongoose schemas for:
- Users
- Companies
- Emissions
- Reports
- Emission Factors

### Priority 3: Complete Calculation Engine
Implement all DEFRA 2025 categories:
- Fuels ✓ (basic implementation)
- Electricity ✓ (basic implementation)
- Refrigerants
- Passenger Transport ✓ (basic implementation)
- Freight Transport
- Water
- Waste
- Material Use

### Priority 4: AI Integration
- Set up AI API (Grok/OpenAI)
- Implement vehicle inference
- Add regional factor search

### Priority 5: Visualization
- Integrate Chart.js or Recharts
- Create pie charts for scope breakdown
- Add trend charts and sparklines

### Priority 6: Excel Upload
- Implement file upload
- Parse XLSX files
- Validate and import data

### Priority 7: PDF Report Generation
- Use jsPDF + jspdf-autotable
- Create WRI-compliant templates
- Add methodology disclosures

### Priority 8: Testing
- Write unit tests (Jest)
- Add integration tests
- Implement E2E tests (Cypress)

### Priority 9: Deployment
- Create Docker containers
- Set up CI/CD pipeline
- Deploy to cloud (AWS/Azure)

## 🧪 Testing the Application

### Test Frontend
```powershell
npm run lint
npm run format
```

### Test Backend
```powershell
cd server
npm test
```

## 📚 Documentation

- **Design System**: See `src/styles/tokens.css`
- **Components**: Check `src/components/` folders
- **API**: Review `server/routes/` files
- **README**: Full documentation in `README.md`

## 🐛 Known Issues

1. CSS @apply warnings - These are expected with Tailwind and won't affect functionality
2. Database not connected - Need to set up MongoDB
3. AI endpoints return mock data - Need to configure AI API
4. Charts show placeholders - Need to implement Chart.js components

## 💡 Tips

1. **Component Development**: Use Storybook for isolated component development
2. **API Testing**: Use Postman or Thunder Client VSCode extension
3. **Debugging**: React DevTools + Redux DevTools
4. **Mobile Testing**: Use Chrome DevTools device emulation

## 📧 Need Help?

- Check the main README.md for detailed documentation
- Review component code for usage examples
- API routes include inline comments explaining functionality

---

**Happy coding! 🌱**
