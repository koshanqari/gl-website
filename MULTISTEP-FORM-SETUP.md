# Multi-Step Contact Form - Setup Guide

## 📋 Overview

Your contact page now has a **3-step progressive form** that saves data after each step:

### Form Steps:
1. **Step 1: Basic Contact Info** - Name, Email, Phone, Company
2. **Step 2: Meeting Preferences** - Preferred Date, Time Slot, Connection Mode
3. **Step 3: Event Details** - Event Type, Date, Location, Guests, Message

### Key Features:
✅ **Progressive Data Saving** - Data is saved after each step
✅ **Session Tracking** - Uses unique `session_id` to track multi-step progress
✅ **Auto-fill Location** - Pincode auto-populates region and city
✅ **Progress Indicator** - Visual progress bar shows current step
✅ **Backward Compatible** - Old single-form API still works

---

## 🗄️ Database Setup

### Step 1: Run the SQL Schema

1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase-schema-contact-multistep.sql`
5. **Click "Run"**

The schema creates:
- `contact_inquiries` table with multi-step support
- Indexes for performance
- RLS policies for security
- Triggers for auto-updating timestamps

### Important Database Fields:

| Field | Type | Description |
|-------|------|-------------|
| `session_id` | UUID | Unique identifier for tracking form progress |
| `current_step` | Integer | Current step user is on (1-3) |
| `step_completed` | Integer | Last completed step (0-3) |
| `step1_completed_at` | Timestamp | When step 1 was completed |
| `step2_completed_at` | Timestamp | When step 2 was completed |
| `step3_completed_at` | Timestamp | When step 3 was completed |
| `completed_at` | Timestamp | When entire form was completed |

---

## 🚀 How It Works

### Data Flow:

```
┌─────────────────────────────────────────────────┐
│  User fills Step 1 (Name, Email, Phone, Company)│
│                      ↓                           │
│  POST /api/contact-inquiries                    │
│  { step: 1, name, email, phone, company }       │
│                      ↓                           │
│  Creates new record with session_id             │
│  Returns: { sessionId: "uuid..." }              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  User fills Step 2 (Meeting Preferences)        │
│                      ↓                           │
│  POST /api/contact-inquiries                    │
│  { step: 2, sessionId, preferredDate, ... }     │
│                      ↓                           │
│  UPDATES existing record (UPSERT)               │
│  Returns: { sessionId: "same-uuid..." }         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  User fills Step 3 (Event Details)              │
│                      ↓                           │
│  POST /api/contact-inquiries                    │
│  { step: 3, sessionId, eventType, message...}   │
│                      ↓                           │
│  UPDATES existing record, marks as COMPLETED    │
│  Shows success message                          │
└─────────────────────────────────────────────────┘
```

### API Endpoint Behavior:

**POST `/api/contact-inquiries`**

**Multi-Step Mode** (when `step` is provided):
- Step 1: Creates new record, returns `sessionId`
- Step 2 & 3: Updates existing record using `sessionId`
- Validates required fields per step
- Tracks completion timestamps

**Legacy Mode** (when no `step`):
- Creates complete record in one go
- Maintains backward compatibility
- Sets `step_completed = 3`

---

## 🧪 Testing the Multi-Step Form

### 1. Start your development server:
```bash
npm run dev
```

### 2. Navigate to the contact page:
```
http://localhost:3000/contact
```

### 3. Test the flow:

**Step 1:**
- Fill in: Name, Email (required)
- Optional: Phone, Company
- Click "Continue to Step 2"
- ✅ Check database - should see new record with `step_completed = 1`

**Step 2:**
- Fill in: Preferred Date, Time Slot, Connection Mode
- Click "Continue to Step 3"
- ✅ Check database - same record updated with `step_completed = 2`

**Step 3:**
- Fill in: Event Type (required), Message (required)
- Try entering a 6-digit pincode (e.g., 560001)
- Watch it auto-fill region and city!
- Click "Submit Inquiry"
- ✅ Check database - record updated with `step_completed = 3` and `completed_at` timestamp

### 4. Check the Database:

In Supabase SQL Editor, run:
```sql
SELECT 
  id, 
  session_id,
  name, 
  email,
  step_completed,
  step1_completed_at,
  step2_completed_at,
  step3_completed_at,
  completed_at,
  status
FROM contact_inquiries
ORDER BY created_at DESC
LIMIT 10;
```

You should see:
- Unique `session_id` for each form submission
- Progressive timestamps for each step
- `completed_at` only set when all 3 steps are done

---

## 📁 Files Changed/Created

### New Files:
1. ✅ `/components/MultiStepContactForm.tsx` - Multi-step form component
2. ✅ `/supabase-schema-contact-multistep.sql` - Database schema

### Modified Files:
1. ✅ `/app/contact/page.tsx` - Now uses MultiStepContactForm
2. ✅ `/app/api/contact-inquiries/route.ts` - Handles multi-step & legacy submissions

---

## 🎨 UI Features

### Progress Indicator:
- Visual progress bar at top of form
- Step numbers (1, 2, 3)
- Checkmarks for completed steps
- Current step highlighted

### Navigation:
- "Continue" button advances to next step
- "Back" button returns to previous step
- Data persists when going back/forward

### Form Validation:
- Required fields per step
- Email validation
- Number validation for guest count
- Date validation (can't select past dates)

---

## 🔧 Customization Options

### Change Step Titles:
In `MultiStepContactForm.tsx`, find:
```tsx
<h2>Let's Get Started</h2>  // Step 1
<h2>Schedule a Meeting</h2>  // Step 2
<h2>Tell Us About Your Event</h2>  // Step 3
```

### Add More Fields:
1. Add field to `formData` state
2. Add input in appropriate step
3. Update API route to save the field
4. Update database schema if needed

### Adjust Time Slots:
In Step 2, modify the time slot options:
```tsx
<option value="morning">Morning (9 AM - 12 PM)</option>
<option value="afternoon">Afternoon (12 PM - 4 PM)</option>
<option value="evening">Evening (4 PM - 7 PM)</option>
```

---

## 🐛 Troubleshooting

### Issue: "Failed to create inquiry"
**Solution:** Make sure you've run the SQL schema in Supabase

### Issue: Pincode auto-fill not working
**Solution:** Only works for Indian pincodes (6 digits). The API is: `https://api.postalpincode.in/pincode/{pin}`

### Issue: Data not persisting between steps
**Solution:** Check browser console for `sessionId`. It should be the same across all steps.

### Issue: "Missing required fields" error
**Solution:** 
- Step 1 requires: name, email
- Step 3 requires: eventType, message
- Check that these fields are filled

---

## 📊 Admin View (Viewing Submissions)

You can view all submissions in Supabase:

1. Go to **Supabase Dashboard** → **Table Editor**
2. Select `contact_inquiries` table
3. You'll see:
   - Partial submissions (step_completed < 3)
   - Complete submissions (step_completed = 3)
   - Timestamps for each step

### Filter Complete Submissions:
```sql
SELECT * FROM contact_inquiries 
WHERE step_completed = 3 
AND completed_at IS NOT NULL
ORDER BY created_at DESC;
```

### Filter Abandoned Forms (Started but not completed):
```sql
SELECT * FROM contact_inquiries 
WHERE step_completed < 3
AND created_at < NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

## ✅ Benefits of Multi-Step Form

1. **Reduced Abandonment** - Shorter, less overwhelming steps
2. **Better Data Quality** - Users can focus on one section at a time
3. **Progressive Profiling** - Collect basic info first, details later
4. **Analytics** - Track where users drop off
5. **User Experience** - Clear progress indication
6. **Data Recovery** - Partial submissions saved (useful for follow-up)

---

## 🔄 Migration from Old Form

The system is **backward compatible**:
- Old single-form submissions still work
- They're marked as `step_completed = 3`
- No data loss from existing submissions

If you have existing data in the old schema, you may want to backup before running the new schema.

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify the SQL schema was run successfully
4. Test with simple data first

---

**Happy form building! 🎉**
