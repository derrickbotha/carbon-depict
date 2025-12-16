# Quick Start Testing Guide
## Phase 1 Week 1 - 5 Minute Test

**Goal:** Quickly verify all critical implementations work correctly

---

## Prerequisites

- ✅ MongoDB running
- ✅ Node.js 18+ installed
- ✅ Project dependencies installed

---

## 🚀 Quick Test (5 minutes)

### 1. Install Dependencies (1 min)

```bash
# Root directory
npm install

# Server directory
cd server
npm install
cd ..
```

---

### 2. Run Database Migration (30 seconds)

```bash
cd server
npm run migrate:indexes
```

**✅ Success:** Should see "Index migration completed successfully"

**❌ If failed:** Make sure MongoDB is running (`mongosh` to test)

---

### 3. Start the Server (30 seconds)

```bash
# From server directory
npm run dev
```

**✅ Success:** Server starts on port 5500, shows "✅ Databases connected"

**Keep this terminal open!**

---

### 4. Run Automated Security Tests (2 min)

**Open a new terminal:**

```bash
cd server
chmod +x scripts/test-security.sh
npm run test:security
```

**✅ Success:** Should see:
```
✓ All security tests passed!
```

This tests:
- ✅ Health check endpoint
- ✅ Rate limiting (general + auth)
- ✅ Weak password rejection
- ✅ Common password rejection
- ✅ Strong password acceptance

---

### 5. Verify Database Indexes (30 seconds)

```bash
# From server directory
npm run verify:indexes
```

**✅ Success:** Should see:
```
✅ All required indexes are present!
   Database is properly optimized.
```

---

### 6. Test Frontend (Optional - 1 min)

**Open a new terminal:**

```bash
# From root directory
npm run dev
```

Then in your browser:
1. Go to `http://localhost:3000`
2. Register with a strong password: `MyStr0ng!Pass2025`
3. Navigate to: Dashboard → Emissions → Scope 1
4. Fill form and click Save
5. Should see success message (NOT "API integration pending")

---

## ✅ All Tests Passed?

If all tests pass, you're ready to proceed to **Phase 1 Week 2**!

---

## ❌ Tests Failed?

### Common Issues

**Issue: MongoDB connection failed**
```bash
# Start MongoDB
mongod

# Or with Homebrew (Mac)
brew services start mongodb-community

# Or with systemctl (Linux)
sudo systemctl start mongod
```

**Issue: Port 5500 already in use**
```bash
# Kill process on port 5500
lsof -ti:5500 | xargs kill -9

# Or change PORT in server/.env
PORT=5501
```

**Issue: Security tests fail**
- Check server is running on port 5500
- Verify no proxy/VPN interfering
- Check server logs for errors

**Issue: Indexes not created**
- Verify MongoDB user has permissions
- Try running migration again
- Check MongoDB logs

---

## 📊 Manual Test Checklist

If automated tests fail, manually verify:

- [ ] Server starts without errors
- [ ] Health endpoint returns 200: `curl http://localhost:5500/api/health`
- [ ] Rate limiting blocks after 5 auth attempts
- [ ] Password "password123" is rejected
- [ ] Password "MyStr0ng!Pass2025" is accepted
- [ ] Scope 1/2/3 forms save data (not just alert)
- [ ] MongoDB has 7+ indexes per collection

---

## 📖 Detailed Testing

For comprehensive testing instructions, see:
**`TESTING_GUIDE_PHASE1_WEEK1.md`**

---

## 🔧 Troubleshooting

**View server logs:**
```bash
# In server terminal - you'll see all requests and errors
```

**Test MongoDB connection:**
```bash
mongosh
use carbondepict
db.stats()
```

**Check for errors:**
```bash
# Look for any uncaught errors in server terminal
# Check browser console (F12) for frontend errors
```

---

## Next Steps

✅ **All tests passed?**
→ Great! Review `PHASE1_WEEK1_IMPLEMENTATION_SUMMARY.md`
→ Ready for Phase 1 Week 2

❌ **Tests failed?**
→ Review error messages
→ Check `TESTING_GUIDE_PHASE1_WEEK1.md` for detailed troubleshooting
→ Fix issues before proceeding

---

**Testing Time:** ~5 minutes
**Last Updated:** December 3, 2025
