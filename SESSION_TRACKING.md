# Session Check-In & Tracking System

## Overview

The Keep Pedaling Foundation app now includes a comprehensive session check-in and tracking system. This allows approved applicants to check in for their therapy sessions, and admins to track and verify all session attendance.

## Features

### For Users (Approved Applicants)

**Dashboard Check-In:**
- Once approved, users see a "Therapy Sessions" section on their dashboard
- Click "Check In" button to record session attendance
- Select session number (1-4 for the month program)
- Optionally add:
  - Therapist name
  - Session notes (how it went, reflections, etc.)
- View complete session history with timestamps

**Session History:**
- See all past check-ins
- View check-in timestamps
- See which sessions have been verified by admin
- Completion celebration when all 4 sessions are done

### For Admins

**Session Management Portal** (`/admin/sessions`):
- View all session check-ins across all users
- Statistics dashboard:
  - Total check-ins
  - Verified vs. unverified sessions
  - Number of active users
- Filter and search capabilities
- Edit session details:
  - Verify session attendance
  - Add admin notes
  - Update therapist name
- Delete invalid check-ins

**Verification Workflow:**
1. User checks in for session
2. Admin reviews check-in
3. Admin verifies session occurred
4. Admin can add notes for tracking

## Database Schema

### Session Model

```prisma
model Session {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(...)

  // Session details
  checkInTime     DateTime @default(now())  // When user checked in
  sessionNumber   Int      // Which session (1-4)
  notes           String?  // User notes

  // Admin tracking
  therapistName   String?  // Therapist for this session
  adminNotes      String?  // Admin notes
  verified        Boolean  @default(false)  // Admin verified

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## API Endpoints

### User Endpoints

**POST /api/sessions**
- Create a new session check-in
- Requires: authenticated user with approved application
- Body:
```json
{
  "sessionNumber": 1,  // 1-4
  "notes": "Great session today...",
  "therapistName": "Dr. Smith"
}
```
- Returns: Created session object

**GET /api/sessions**
- Get all sessions for current user
- Requires: authenticated user
- Returns: Array of session objects

### Admin Endpoints

**GET /api/admin/sessions**
- Get all sessions (all users)
- Requires: admin role
- Query params:
  - `userId` (optional) - Filter by user
- Returns: Array of sessions with user info

**PATCH /api/admin/sessions/[id]**
- Update a session
- Requires: admin role
- Body:
```json
{
  "verified": true,
  "adminNotes": "Confirmed with therapist",
  "therapistName": "Dr. Jane Smith"
}
```

**DELETE /api/admin/sessions/[id]**
- Delete a session check-in
- Requires: admin role
- Use case: Remove duplicate or invalid check-ins

## User Flow

### Applicant Journey

1. **Apply** → Submit application
2. **Wait** → Application reviewed by admin
3. **Approved** → Applicant receives approved status
4. **Check-In** → After each session, tap "Check In" button
5. **Track Progress** → View session history on dashboard
6. **Complete** → After 4 sessions, program complete

### Admin Journey

1. **Review Applications** → Approve qualified applicants
2. **Monitor Check-Ins** → View `/admin/sessions`
3. **Verify Sessions** → Confirm attendance with therapist
4. **Track Progress** → Monitor program completion
5. **Add Notes** → Document session details

## Validation Rules

- Users can only check in if application is "approved"
- Session numbers must be 1-4
- Cannot check in for same session number twice
- Check-in creates timestamp automatically
- Therapist name and notes are optional

## Statistics & Reporting

### User Dashboard Shows:
- Total sessions completed (out of 4)
- Session history with dates
- Verification status
- Completion celebration

### Admin Dashboard Shows:
- Total check-ins across all users
- Verified vs. unverified count
- Active users (users with at least one session)
- Recent check-ins

## Use Cases

### UC-1: User Checks In After Session
1. User attends therapy session
2. User logs into dashboard
3. Clicks "Check In - Session X"
4. Fills optional therapist name and notes
5. Submits check-in
6. Timestamp recorded automatically
7. Appears in session history

### UC-2: Admin Verifies Session
1. Admin views sessions portal
2. Sees new unverified check-in
3. Contacts therapist to confirm
4. Clicks "Edit" on session
5. Checks "Mark as Verified"
6. Adds admin notes
7. Saves changes
8. User sees verified badge

### UC-3: Tracking Program Completion
1. Admin views sessions portal
2. Filters by specific user
3. Sees 4 verified sessions
4. Confirms program completion
5. Can export or document for records

## Security

- All endpoints require authentication
- User endpoints restricted to own data
- Admin endpoints require admin role
- Session updates only by admin
- Cascade delete (if user deleted, sessions deleted)

## Future Enhancements

Potential additions:
- Export session data to CSV
- Email notifications for check-ins
- Therapist portal access
- Session scheduling integration
- Reminder notifications
- Program completion certificates
- Session feedback/ratings
- Multi-month program support

## Technical Implementation

**Components:**
- `SessionCheckIn` - Client component for user check-in
- Admin sessions page - Full CRUD interface

**API Routes:**
- `/api/sessions` - User operations
- `/api/admin/sessions` - Admin operations

**Database:**
- `Session` table with user relation
- Indexed on userId and checkInTime

## Testing the Feature

### Test as User:
1. Create account and login
2. Submit application
3. Have admin approve your application
4. Go to dashboard
5. See "Therapy Sessions" section
6. Click "Check In"
7. Fill form and submit
8. Verify session appears in history

### Test as Admin:
1. Login as admin
2. Go to `/admin/sessions`
3. View all check-ins
4. Click "Edit" on a session
5. Add notes and verify
6. Save changes
7. Verify updates appear

## Troubleshooting

**User can't see check-in button:**
- Check application status is "approved"
- Verify user is logged in
- Refresh the dashboard page

**Sessions not appearing:**
- Check browser console for errors
- Verify API endpoints are accessible
- Check database connection

**Can't verify as admin:**
- Confirm admin role in database
- Check session ID is valid
- Verify API route permissions

---

**The session tracking system is now live and ready to track therapy attendance!** 🎉
