# 🔐 Carbon Depict Test Credentials

## Test User Account

### Login Credentials
```
Email:    db@carbondepict.com
Password: Db123!Admin&
```

### User Details
- **First Name:** DB
- **Last Name:** Admin
- **Role:** Admin
- **Status:** Active ✅
- **Email Verified:** Yes ✅

### Company Details
- **Company Name:** Carbon Depict Test Company
- **Industry:** Other
- **Region:** UK
- **Subscription:** Free
- **Status:** Active ✅

---

## Authentication Flow

### 1. Login Endpoint
```http
POST http://localhost:5500/api/auth/login
Content-Type: application/json

{
  "email": "db@carbondepict.com",
  "password": "Db123!Admin&"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "db@carbondepict.com",
    "firstName": "DB",
    "lastName": "Admin",
    "role": "admin",
    "emailVerified": true,
    "company": {
      "id": "uuid",
      "name": "Carbon Depict Test Company",
      "industry": "other",
      "subscription": "free"
    }
  }
}
```

### 2. Get User Info Endpoint
```http
GET http://localhost:5500/api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "db@carbondepict.com",
    "firstName": "DB",
    "lastName": "Admin",
    "role": "admin",
    "emailVerified": true,
    "lastLogin": "2025-10-21T...",
    "company": {
      "id": "uuid",
      "name": "Carbon Depict Test Company",
      "industry": "other",
      "subscription": "free"
    }
  }
}
```

### 3. Logout Endpoint
```http
POST http://localhost:5500/api/auth/logout
Authorization: Bearer {token}
```

---

## Frontend Login

### Access Points
- **Login Page:** http://localhost:3500/login
- **Dashboard:** http://localhost:3500/dashboard
- **ESG Frameworks:** http://localhost:3500/dashboard/esg

### Login Steps
1. Navigate to http://localhost:3500/login
2. Enter email: `db@carbondepict.com`
3. Enter password: `Db123!Admin&`
4. Click "Sign In"
5. You'll be redirected to the dashboard

---

## Token Information

### JWT Token Structure
```json
{
  "userId": "uuid",
  "companyId": "uuid",
  "role": "admin",
  "email": "db@carbondepict.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Token Expiration
- **Access Token:** 7 days
- **Refresh Token:** 30 days

### Token Storage
- Stored in localStorage as: `token` and `refreshToken`
- Automatically attached to API requests via Authorization header

---

## User Permissions

### Admin Role Capabilities
✅ Access all ESG frameworks (GRI, TCFD, CDP, SBTi, SDG, CSRD)
✅ Create and manage emissions data
✅ Generate reports
✅ Manage company settings
✅ Access all dashboard features
✅ View and manage all company data
✅ AI-powered compliance validation
✅ Upload proof documents

---

## Testing Endpoints

### Check Backend Health
```bash
curl http://localhost:5500/api/health
```

### Test Login
```bash
curl -X POST http://localhost:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "db@carbondepict.com",
    "password": "db123!@#DB"
  }'
```

### Test Authenticated Route
```bash
# Replace {TOKEN} with actual token from login response
curl http://localhost:5500/api/auth/me \
  -H "Authorization: Bearer {TOKEN}"
```

---

## Database Connection

### PostgreSQL
- **Host:** localhost
- **Port:** 5432
- **Database:** carbondepict
- **User:** carbonuser
- **Password:** carbonpass123

### View User in Database
```sql
-- Connect to database
docker exec -it carbon-depict-db psql -U carbonuser -d carbondepict

-- Check user
SELECT id, email, "firstName", "lastName", role, "emailVerified", "isActive" 
FROM users 
WHERE email = 'db@carbondepict.com';

-- Check company
SELECT id, name, industry, subscription, "isActive"
FROM companies
WHERE name = 'Carbon Depict Test Company';
```

---

## Troubleshooting

### Issue: Login fails with "Email not verified"
**Solution:** The test user is created with `emailVerified: true`, so this shouldn't happen.

### Issue: "Invalid email or password"
**Solution:** Make sure you're using the exact password: `Db123!Admin&` (case-sensitive)

### Issue: "Account has been deactivated"
**Solution:** Check database - user `isActive` should be `true`

### Issue: Token expired
**Solution:** Use the refresh token endpoint to get a new access token

### Issue: Can't access protected routes
**Solution:** Make sure the token is included in the Authorization header as `Bearer {token}`

---

## Security Notes

⚠️ **Important:** These are TEST credentials only!
- Never use these in production
- Change default JWT secret in production
- Implement proper password hashing (already done with bcrypt)
- Use HTTPS in production
- Implement rate limiting for login attempts
- Enable email verification for real users
- Use strong passwords for production accounts

---

## Additional Test Scenarios

### 1. Test ESG Data Entry
- Login as db@carbondepict.com
- Navigate to /dashboard/esg/gri
- Click "Enhanced Form" toggle
- Fill in ESG metrics
- Upload proof documents
- Submit and verify AI validation

### 2. Test Emissions Tracking
- Navigate to /dashboard/emissions/scope1
- Add emission entries
- Generate reports
- View analytics

### 3. Test Role-Based Access
- Admin user (db@carbondepict.com) has full access
- Can create additional users with different roles
- Test manager and user roles if needed

---

**Last Updated:** October 21, 2025
**Created By:** Carbon Depict Setup Script
