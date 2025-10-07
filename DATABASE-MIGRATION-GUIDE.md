# Database Migration & Setup Guide

## 🔄 Current Situation: You Have Existing Data

If you're seeing the error: **"column session_id does not exist"**, it means you already have a `contact_inquiries` table with the old schema.

---

## ✅ Solution: Run the Migration Script

### Option 1: Safe Migration (Recommended - Keeps Existing Data)

1. **Open your database SQL editor** (Supabase, PostgreSQL, etc.)
2. **Run this file**: `supabase-migration-contact-multistep.sql`
3. Click **Execute/Run**

**What it does:**
- ✅ Backs up your existing data
- ✅ Adds new columns to existing table
- ✅ Preserves all old submissions
- ✅ Marks old submissions as "completed"
- ✅ Adds indexes for performance

### Option 2: Fresh Start (If You Don't Need Old Data)

If you don't have important data and want to start fresh:

```sql
-- Drop the old table
DROP TABLE IF EXISTS contact_inquiries CASCADE;

-- Then run the fresh schema
-- (Copy contents from supabase-schema-contact-multistep.sql)
```

---

## 🗄️ Database Compatibility

This multi-step form works with **ANY PostgreSQL database**:

### Supported Databases:
✅ **Supabase** (PostgreSQL + Auth)
✅ **Plain PostgreSQL** (Self-hosted or cloud)
✅ **Neon** (Serverless PostgreSQL)
✅ **Railway** (PostgreSQL)
✅ **Render** (PostgreSQL)
✅ **AWS RDS** (PostgreSQL)
✅ **Google Cloud SQL** (PostgreSQL)
✅ **Azure Database** (PostgreSQL)

### If Switching Databases:

**1. Export Your Data (from current database):**
```sql
-- In Supabase SQL Editor or your current database
COPY (SELECT * FROM contact_inquiries) TO '/tmp/contact_inquiries.csv' CSV HEADER;
```

Or use the database's export feature (Supabase: Table Editor → Export as CSV)

**2. Set Up New Database:**
- Create a new PostgreSQL database in your new provider
- Run the migration script: `supabase-migration-contact-multistep.sql`

**3. Import Your Data:**
```sql
-- In your new database
COPY contact_inquiries FROM '/tmp/contact_inquiries.csv' CSV HEADER;
```

**4. Update Environment Variables:**

Update your `.env.local` or environment configuration:

```bash
# Old (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# New (Direct PostgreSQL - Example)
DATABASE_URL=postgresql://user:password@host:5432/database
```

**5. Update Code (if not using Supabase):**

If switching away from Supabase, you'll need to replace the Supabase client with a direct PostgreSQL client.

---

## 🔧 Making Code Database-Agnostic

### Current State:
The code uses Supabase client (`@supabase/supabase-js`) which is just a wrapper around PostgreSQL.

### To Switch to Direct PostgreSQL:

**Install PostgreSQL client:**
```bash
npm install pg
# or
npm install @vercel/postgres
```

**Update `/lib/supabase.ts`:**

```typescript
// Option 1: Keep Supabase (easiest)
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(url, key)

// Option 2: Use direct PostgreSQL (if switching databases)
import { Pool } from 'pg'
export const db = new Pool({
  connectionString: process.env.DATABASE_URL
})
```

**Update API route** (`/api/contact-inquiries/route.ts`):

Replace Supabase queries with raw SQL:

```typescript
// Instead of:
const { data, error } = await supabaseAdmin
  .from('contact_inquiries')
  .insert([...])

// Use:
const result = await db.query(
  'INSERT INTO contact_inquiries (...) VALUES (...) RETURNING *'
)
```

---

## 🚀 Quick Migration Steps (For You Right Now)

Since you're getting the `session_id` error:

### Step 1: Open Supabase Dashboard
Go to: **SQL Editor**

### Step 2: Copy Migration Script
Copy the entire contents of: `supabase-migration-contact-multistep.sql`

### Step 3: Run It
Paste and click **Run**

### Step 4: Verify
Check if it worked:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contact_inquiries'
ORDER BY ordinal_position;
```

You should see all the new columns including `session_id`.

### Step 5: Test the Form
Navigate to: `http://localhost:3000/contact`
Fill out the multi-step form and verify it saves correctly.

---

## 📊 Database Schema Overview

After migration, your `contact_inquiries` table will have:

### Core Fields (Existing):
- `id` - Primary key
- `created_at`, `updated_at` - Timestamps
- `status`, `priority` - Admin fields

### Step 1 Fields:
- `name` ✓
- `email` ✓
- `phone`
- `company`

### Step 2 Fields (NEW):
- `preferred_date`
- `preferred_time_slot`
- `preferred_mode`

### Step 3 Fields:
- `event_type` ✓
- `event_date`
- `event_country`
- `event_pincode`
- `event_region`
- `event_city`
- `guest_count`
- `message` ✓

### Tracking Fields (NEW):
- `session_id` - Unique session identifier
- `current_step` - Which step user is on
- `step_completed` - Last completed step
- `step1_completed_at` - When step 1 was completed
- `step2_completed_at` - When step 2 was completed
- `step3_completed_at` - When step 3 was completed
- `completed_at` - When entire form was completed

---

## 🐛 Troubleshooting

### Error: "column session_id does not exist"
**Solution:** You tried to run the fresh schema on an existing table. Use the migration script instead.

### Error: "relation contact_inquiries already exists"
**Solution:** Use migration script, not the fresh schema.

### Error: "permission denied"
**Solution:** Make sure you're using the service role key or database admin credentials.

### Old submissions showing as "partial"
**Solution:** Run this query:
```sql
UPDATE contact_inquiries 
SET step_completed = 3, completed_at = created_at 
WHERE step_completed < 3 AND message IS NOT NULL;
```

---

## 🔒 Security Notes (Database-Agnostic)

### Row Level Security (RLS):
- **Supabase**: Automatically enforced via policies
- **Other databases**: Need to implement at application level

### If NOT using Supabase RLS:
Add authentication checks in your API route:

```typescript
// In /api/contact-inquiries/route.ts
export async function POST(request: Request) {
  // Add authentication check here if needed
  // const session = await getServerSession()
  
  // ... rest of code
}
```

---

## 📈 Monitoring Submissions

### View all submissions:
```sql
SELECT 
  id,
  name,
  email,
  step_completed,
  created_at,
  completed_at
FROM contact_inquiries
ORDER BY created_at DESC
LIMIT 20;
```

### View incomplete submissions:
```sql
SELECT * FROM contact_inquiries 
WHERE step_completed < 3
ORDER BY updated_at DESC;
```

### Count by step:
```sql
SELECT 
  step_completed,
  COUNT(*) as count
FROM contact_inquiries
GROUP BY step_completed
ORDER BY step_completed;
```

---

## ✅ Next Steps

1. ✅ Run migration script: `supabase-migration-contact-multistep.sql`
2. ✅ Test the form: `http://localhost:3000/contact`
3. ✅ Verify data in database
4. ✅ (Optional) Plan database switch if needed

---

**Your data is safe! The migration preserves everything.** 🎉
