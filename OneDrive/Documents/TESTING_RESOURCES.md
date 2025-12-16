# Testing Resources - Phase 1 Week 1
## Complete Testing Package

---

## 📚 Available Testing Documents

### 1. **TESTING_QUICK_START.md** ⭐ START HERE
**Time:** 5 minutes
**Purpose:** Fast verification of all critical functionality

**Use when:**
- You want to quickly verify everything works
- You've just completed the implementation
- You're doing a sanity check before proceeding

**What it tests:**
- ✅ Dependencies installation
- ✅ Database migration
- ✅ Server startup
- ✅ Automated security tests (rate limiting, passwords)
- ✅ Database index verification
- ✅ Frontend integration (optional)

**Start command:**
```bash
# Follow instructions in TESTING_QUICK_START.md
```

---

### 2. **TESTING_GUIDE_PHASE1_WEEK1.md** 📖 DETAILED GUIDE
**Time:** 30-45 minutes
**Purpose:** Comprehensive testing with detailed explanations

**Use when:**
- Quick tests revealed issues
- You need detailed troubleshooting
- You want to understand each test
- You're documenting test results

**What it covers:**
- Detailed step-by-step instructions
- Expected outputs for each test
- Troubleshooting common issues
- Performance baseline recording
- Manual verification steps

---

### 3. **PHASE1_WEEK1_IMPLEMENTATION_SUMMARY.md** 📊 REFERENCE
**Time:** 10 minutes to read
**Purpose:** Understanding what was implemented and why

**Use when:**
- You want to see what changed
- You need deployment instructions
- You're reviewing the implementation
- You need to explain changes to stakeholders

**What it contains:**
- Complete list of all changes
- Security improvements breakdown
- Performance impact analysis
- Deployment instructions
- Success metrics

---

## 🤖 Automated Testing Scripts

### Script 1: Security Test Suite
**Location:** `server/scripts/test-security.sh`
**Command:** `npm run test:security` (from server directory)
**Time:** ~2 minutes

**Tests performed:**
1. ✅ Health check endpoint (HTTP 200)
2. ✅ Rate limiting - general API
3. ✅ Rate limiting - auth endpoints (blocks after 5)
4. ✅ Weak password rejection
5. ✅ Common password rejection
6. ✅ Strong password acceptance

**Example output:**
```
==========================================
  Security Testing - Phase 1 Week 1
==========================================

Test 1: Health Check Endpoint
------------------------------
✓ PASS: Health check returned 200 OK
✓ PASS: Health check status is 'ok'

Test 2: Authentication Rate Limiting
-------------------------------------
ℹ Sending 7 login requests (limit is 5)...
✓ PASS: First 5 requests allowed (not rate limited)
✓ PASS: Requests after limit were blocked (HTTP 429)

...

==========================================
  Test Summary
==========================================
Total Tests: 10
Passed: 10
Failed: 0

✓ All security tests passed!
```

---

### Script 2: Database Index Verification
**Location:** `server/scripts/verify-indexes.js`
**Command:** `npm run verify:indexes` (from server directory)
**Time:** ~30 seconds

**Verifies:**
- ESGMetric collection has 7 required indexes
- GHGEmission collection has 7 required indexes
- All compound indexes are present
- All single-field indexes are present

**Example output:**
```
🔍 Verifying database indexes...

📋 Checking collection: esgmetrics
──────────────────────────────────────────────────
Expected indexes: 7
Actual indexes:   7
  ✓ _id_
  ✓ companyId_1_framework_1_reportingPeriod_1
  ✓ companyId_1_status_1
  ✓ companyId_1_topic_1_createdAt_-1
  ✓ companyId_1_pillar_1_createdAt_-1
  ✓ createdAt_-1
  ✓ framework_1

  ✅ All required indexes present (7/7)

...

==================================================
  VERIFICATION SUMMARY
==================================================
Total indexes across all collections: 14

✅ All required indexes are present!
   Database is properly optimized.
```

---

### Script 3: Database Index Migration
**Location:** `server/scripts/add-indexes.js`
**Command:** `npm run migrate:indexes` (from server directory)
**Time:** ~30 seconds

**What it does:**
- Creates all required indexes
- Verifies creation was successful
- Lists all indexes for each collection
- Safe to run multiple times (idempotent)

---

## 🎯 Recommended Testing Workflow

### First Time Testing

```
1. READ: TESTING_QUICK_START.md (2 min)
   ↓
2. RUN: Quick Start commands (5 min)
   ↓
3. ✅ All passed? → Done! Proceed to Phase 1 Week 2
   ↓
4. ❌ Tests failed? → Continue to detailed testing
   ↓
5. READ: TESTING_GUIDE_PHASE1_WEEK1.md (Relevant sections)
   ↓
6. FIX: Issues found
   ↓
7. RETEST: Quick Start again
```

### Regular Testing (After Changes)

```
1. npm run test:security (2 min)
   ↓
2. npm run verify:indexes (30 sec)
   ↓
3. Manual Scope data save test (1 min)
   ↓
4. ✅ All good? → Commit changes
```

### Before Deployment

```
1. Full test suite from TESTING_GUIDE_PHASE1_WEEK1.md
   ↓
2. All automated tests
   ↓
3. Manual frontend testing
   ↓
4. Performance baseline recording
   ↓
5. Review PHASE1_WEEK1_IMPLEMENTATION_SUMMARY.md
   ↓
6. Deploy
```

---

## 📝 Test Checklist

Use this checklist to track your testing progress:

### Quick Tests (5 min)
- [ ] Dependencies installed
- [ ] Database migration ran successfully
- [ ] Server starts without errors
- [ ] Automated security tests pass
- [ ] Index verification passes
- [ ] Frontend Scope forms work (optional)

### Detailed Tests (30-45 min)
- [ ] Rate limiting works (general)
- [ ] Rate limiting works (auth - blocks after 5)
- [ ] Weak passwords rejected (<12 chars)
- [ ] Weak passwords rejected (no complexity)
- [ ] Common passwords rejected
- [ ] Strong passwords accepted
- [ ] Session secret enforced in production
- [ ] Scope 1 data saves via API
- [ ] Scope 2 data saves via API
- [ ] Scope 3 data saves via API
- [ ] Data persists in MongoDB
- [ ] All indexes created correctly
- [ ] No console errors in browser
- [ ] No server errors in logs

### Performance Tests (optional)
- [ ] Query execution plans show index usage
- [ ] Baseline metrics recorded
- [ ] No performance degradation

---

## 🚨 What to Do When Tests Fail

### 1. Identify Which Test Failed
- Note the exact error message
- Check which script/test failed
- Record HTTP status codes if applicable

### 2. Check the Basics
```bash
# Is MongoDB running?
mongosh

# Is the server running?
curl http://localhost:5500/api/health

# Any errors in server logs?
# (Check the server terminal)

# Any missing environment variables?
cat server/.env
```

### 3. Consult Documentation
- For automated test failures → Check script output details
- For manual test failures → See TESTING_GUIDE_PHASE1_WEEK1.md troubleshooting
- For implementation questions → See PHASE1_WEEK1_IMPLEMENTATION_SUMMARY.md

### 4. Common Fixes
```bash
# MongoDB not running
mongod
# or
brew services start mongodb-community

# Port already in use
lsof -ti:5500 | xargs kill -9

# Indexes not created
cd server && npm run migrate:indexes

# Dependencies not installed
npm install
cd server && npm install

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### 5. Still Stuck?
- Review the implementation files directly
- Check git diff to see what changed
- Ensure all files were saved properly
- Verify you're in the correct directory

---

## 📊 Success Criteria

**Phase 1 Week 1 is complete when:**

✅ **All automated tests pass:**
- `npm run test:security` → 10/10 tests passed
- `npm run verify:indexes` → All indexes present

✅ **Manual verification successful:**
- Server starts without errors
- Scope 1/2/3 forms save data (not just alert)
- Strong passwords accepted, weak rejected

✅ **No regressions:**
- Existing functionality still works
- No new errors in logs
- Application is stable

✅ **Ready for next phase:**
- All changes committed to git
- Database backed up
- Team informed of changes

---

## 🔗 Quick Links

| Document | Purpose | Time |
|----------|---------|------|
| `TESTING_QUICK_START.md` | Fast verification | 5 min |
| `TESTING_GUIDE_PHASE1_WEEK1.md` | Detailed testing | 30-45 min |
| `PHASE1_WEEK1_IMPLEMENTATION_SUMMARY.md` | Implementation reference | 10 min read |
| `ENTERPRISE_REFACTORING_PLAN.md` | Full refactoring plan | Reference |

---

## 💡 Pro Tips

1. **Always run automated tests first** - They catch 90% of issues in 2 minutes
2. **Keep server terminal visible** - Watch for errors in real-time
3. **Use MongoDB Compass** - Great for visually verifying data and indexes
4. **Test in clean state** - Restart server between test runs to avoid state issues
5. **Document failures** - Take screenshots/logs if something doesn't work
6. **Test incrementally** - Don't wait until everything is done to test

---

## 📈 Next Steps After Testing

### ✅ All Tests Passed
1. Review implementation summary
2. Commit changes to git
3. Create database backup
4. Proceed to Phase 1 Week 2 (Database Optimization)

### ❌ Some Tests Failed
1. Document which tests failed and error messages
2. Review detailed testing guide for troubleshooting
3. Fix issues
4. Re-run tests
5. Don't proceed until all tests pass

### 🤔 Unsure About Results
1. Compare your output with expected output in guides
2. Check if it's a warning vs an error
3. Run tests again to ensure consistency
4. Review implementation files to understand what should happen

---

**Happy Testing! 🧪**

**Questions or Issues?**
- Check TESTING_GUIDE_PHASE1_WEEK1.md troubleshooting section
- Review server logs for error details
- Verify environment variables are set correctly

---

**Last Updated:** December 3, 2025
