# Database Connection Summary
## Carbon Depict ESG Platform - December 11, 2025

---

## ✅ All Frontend Components Connected to Database

This document confirms that ALL frontend UI components are now properly connected to fetch and display real data from the MongoDB database.

---

## 🔌 Database Integration Status

### 1. Notification System ✅
**Component:** `NotificationPanel.jsx`
**Context:** `AppStateContext.jsx`
**Database:** MongoDB `notifications` collection

**How it works:**
1. `AppStateContext` loads notifications from `/api/notifications` on mount
2. Auto-refreshes every 30 seconds to fetch new notifications
3. All CRUD operations sync with database:
   - Mark as read → `PUT /api/notifications/:id/read`
   - Remove → `DELETE /api/notifications/:id`
   - Clear all → `DELETE /api/notifications`
4. Optimistic UI updates with automatic rollback on error
5. Loading state while fetching from database

**API Endpoints:**
- `GET /api/notifications` - Fetch all user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Clear all

---

### 2. Internal Messaging System ✅
**Component:** `MessagingPage.jsx`
**Database:** MongoDB `conversations` and `messages` collections

**How it works:**
1. Loads all conversations from `/api/messages/conversations` on mount
2. Fetches conversation messages from `/api/messages/conversations/:id`
3. Creates new conversations → `POST /api/messages/conversations`
4. Sends messages → `POST /api/messages/conversations/:id`
5. Deletes conversations → `DELETE /api/messages/conversations/:id`
6. Displays unread counts from database
7. Marks messages as read automatically

**API Endpoints:**
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversations/:id` - Get messages
- `POST /api/messages/conversations` - Create conversation
- `POST /api/messages/conversations/:id` - Send message
- `DELETE /api/messages/conversations/:id` - Delete conversation

**Real-time Features:**
- Auto-loads conversations on page load
- Fetches message history from database
- Updates UI when new messages arrive
- Persistent storage of all conversations

---

### 3. Manager Approval Workflow ✅
**Component:** `ApprovalsPage.jsx`
**Database:** Multiple collections with `approvalStatus` field

**How it works:**
1. Queries multiple collections for entries with approval status:
   - `esgmetrics` collection via `/api/esg/metrics?approvalStatus=pending`
   - `scope3emissions` via `/api/scope3?approvalStatus=pending`
   - `csrddisclosures` via `/api/csrd?approvalStatus=pending`
   - `materialityassessments` via `/api/materiality?approvalStatus=pending`
2. Filters by status (pending/approved/rejected)
3. Approves entry → `PUT /api/esg/metrics/:id/approve`
4. Rejects entry → `PUT /api/esg/metrics/:id/reject`
5. Creates notification for data entry clerk
6. Updates entry status in database

**API Endpoints:**
- `GET /api/esg/metrics?approvalStatus=...` - Query by status
- `PUT /api/esg/metrics/:id/approve` - Approve entry
- `PUT /api/esg/metrics/:id/reject` - Reject entry
- `POST /api/notifications` - Create notification for clerk

**Database Fields:**
```javascript
{
  approvalStatus: 'pending' | 'approved' | 'rejected',
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  notes: String
}
```

---

### 4. Broadcast Notifications ✅
**Component:** `BroadcastPage.jsx`
**Database:** MongoDB `notifications` collection

**How it works:**
1. Admin composes broadcast message
2. Sends to `/api/notifications/broadcast`
3. Backend creates notification for ALL users in company
4. Returns recipient count
5. All users receive notification in their panel

**API Endpoint:**
- `POST /api/notifications/broadcast` - Send to all users

**Response:**
```json
{
  "success": true,
  "message": "Broadcast sent to 47 users",
  "recipientCount": 47
}
```

---

### 5. Reports Page ✅
**Component:** `ReportsPage.jsx`
**Database:** MongoDB `reports` and `esgframeworkdata` collections

**How it works:**
1. Loads framework data → `GET /api/esg/framework-data/overview`
2. Loads generated reports → `GET /api/reports`
3. Downloads framework reports → Framework-specific endpoints
4. Exports data → Various export endpoints

**API Endpoints:**
- `GET /api/esg/framework-data/overview` - Framework metrics
- `GET /api/reports` - All generated reports
- `GET /api/esg/framework-data/framework/:id` - Specific framework
- Export endpoints for CSV/Excel/JSON/PDF

---

### 6. ESG Data Entry Forms ✅
**Components:** All Scope 1/2/3 and ESG metric collection pages
**Database:** MongoDB `esgmetrics` and `scope3emissions` collections

**How it works:**
1. Loads existing data on mount via `useESGMetricForm` hook
2. Saves data → `POST /api/esg/metrics` or `PUT /api/esg/metrics/:id`
3. Deletes data → `DELETE /api/esg/metrics/:id`
4. Exports data → `/api/esg/metrics/export/:format`
5. All changes persist to database immediately

**API Endpoints:**
- `GET /api/esg/metrics?sourceType=...` - Load data
- `POST /api/esg/metrics` - Create new entry
- `PUT /api/esg/metrics/:id` - Update entry
- `DELETE /api/esg/metrics/:id` - Delete entry

---

## 🔄 Data Flow Architecture

### Frontend → Backend → Database

```
┌──────────────────┐
│  React Frontend  │
│   (UI Components)│
└────────┬─────────┘
         │
         │ API Requests (apiClient)
         ▼
┌──────────────────┐
│  Express Backend │
│  (API Routes)    │
└────────┬─────────┘
         │
         │ Mongoose Queries
         ▼
┌──────────────────┐
│  MongoDB Database│
│  (Collections)   │
└──────────────────┘
```

### Key Components:

1. **apiClient** (`src/utils/api.js`)
   - Axios instance with interceptors
   - Authentication token injection
   - Error handling
   - All API endpoints defined

2. **Backend Routes** (`server/routes/`)
   - Express route handlers
   - Authentication middleware
   - Role-based authorization
   - Database queries via Mongoose

3. **MongoDB Models** (`server/models/mongodb/`)
   - Mongoose schemas
   - Data validation
   - Indexes for performance
   - Relationships between collections

---

## 🎯 Data Synchronization Features

### Optimistic Updates
All components use optimistic UI updates:
1. Update UI immediately (fast user experience)
2. Send request to backend
3. If successful: Keep UI update
4. If failed: Rollback UI and show error

**Example:**
```javascript
// Mark notification as read
markNotificationRead(id) {
  // 1. Update UI instantly
  setNotifications(prev =>
    prev.map(n => n.id === id ? {...n, read: true} : n)
  )

  // 2. Update database
  try {
    await apiClient.put(`/api/notifications/${id}/read`)
  } catch (error) {
    // 3. Rollback on error
    setNotifications(prev =>
      prev.map(n => n.id === id ? {...n, read: false} : n)
    )
  }
}
```

### Auto-Refresh
- Notifications: Refresh every 30 seconds
- Messages: Real-time when conversation open
- Approvals: Refresh on filter change
- Reports: Refresh on data change events

### Loading States
All components show loading indicators while fetching:
- Spinner animations
- Skeleton loaders
- "Loading..." messages
- Disabled buttons during operations

---

## ✅ Verification Checklist

### All Components Connected ✅

- [x] NotificationPanel → MongoDB `notifications`
- [x] MessagingPage → MongoDB `conversations` & `messages`
- [x] ApprovalsPage → Multiple collections with `approvalStatus`
- [x] BroadcastPage → MongoDB `notifications` (broadcast)
- [x] ReportsPage → MongoDB `reports` & `esgframeworkdata`
- [x] Scope 1/2/3 Forms → MongoDB `esgmetrics` & `scope3emissions`
- [x] ESG Data Entry → MongoDB `esgmetrics`
- [x] All custom data forms → MongoDB collections

### Data Integrity ✅

- [x] All data persists to database
- [x] Data survives page refresh
- [x] Multi-tenant isolation (companyId filtering)
- [x] User authentication required
- [x] Role-based access control
- [x] Optimistic UI updates
- [x] Error handling and rollback
- [x] Loading states displayed

---

## 🧪 Testing Database Connections

### Test Notifications:
1. Open app → Bell icon should load notifications from DB
2. Create approval → Notification sent to DB and appears
3. Mark as read → Updates in DB
4. Delete → Removes from DB
5. Refresh page → Data persists

### Test Messaging:
1. Navigate to Messages → Loads conversations from DB
2. Create conversation → Saves to DB
3. Send message → Saves to DB
4. Refresh page → History persists
5. Delete conversation → Removes from DB

### Test Approvals:
1. Navigate to Approvals → Loads pending entries from DB
2. Approve entry → Updates status in DB
3. Reject entry → Updates status and creates notification
4. Filter by status → Queries DB with filter
5. Refresh page → Correct entries displayed

### Test Broadcasts:
1. Admin sends broadcast → Creates notification for all users
2. All users see in notification panel
3. Data persists in DB
4. Refresh page → Notifications still visible

---

## 🚀 Production Ready

All frontend components are now:
✅ Connected to correct database collections
✅ Fetching real data from MongoDB
✅ Displaying correct data only
✅ Persisting changes to database
✅ Handling errors gracefully
✅ Showing loading states
✅ Using optimistic updates
✅ Auto-refreshing data

**No Mock Data** - Everything is real database data!

---

## 📊 API Response Examples

### Notifications Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "674a1b2c3d4e5f6789012345",
      "recipient": "674a1b2c3d4e5f6789012346",
      "type": "approval",
      "title": "Data Entry Approved",
      "message": "Your Scope 1 Emissions submission has been approved.",
      "read": false,
      "createdAt": "2025-12-11T10:30:00Z",
      "metadata": {...}
    }
  ],
  "unreadCount": 3
}
```

### Conversations Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "674a1b2c3d4e5f6789012347",
      "participants": [...],
      "lastMessage": {...},
      "unreadCount": 2,
      "updatedAt": "2025-12-11T10:00:00Z"
    }
  ]
}
```

### Approvals Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "674a1b2c3d4e5f6789012348",
      "sourceType": "scope1_emissions",
      "approvalStatus": "pending",
      "createdBy": {...},
      "createdAt": "2025-12-11T09:00:00Z",
      ...
    }
  ]
}
```

---

## 🎉 Summary

**100% Database Integration Complete!**

Every UI component is now connected to the MongoDB database and displays only real, verified data. No mock data, no placeholders - everything is live and production-ready.

**Implementation Date:** December 11, 2025
**Status:** ✅ Complete and Verified
