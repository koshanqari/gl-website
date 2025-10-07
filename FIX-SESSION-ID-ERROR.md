# 🚨 Quick Fix: "column session_id does not exist" Error

## The Problem
You tried to run the new schema, but your `contact_inquiries` table already exists with the old structure.

---

## ✅ Solution (2 Minutes)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run Migration Script
1. Open the file: `supabase-migration-contact-multistep.sql`
2. **Copy ALL contents** (Ctrl+A, Ctrl+C)
3. **Paste** into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Success
You should see a message like:
```
Success. 15 rows returned.
```

And a table showing:
- `total_records`: Number of existing submissions
- `completed_submissions`: Old submissions (marked as complete)
- `partial_submissions`: Should be 0

---

## ✅ What This Does

✅ Adds `session_id` column (and all other new columns)
✅ Keeps all your existing data safe
✅ Marks old submissions as "completed" 
✅ Creates indexes for faster queries
✅ Sets up Row Level Security policies

---

## 🧪 Test It

After running the migration:

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to: `http://localhost:3000/contact`

3. Fill out the form step-by-step

4. Check your database - you should see the new submission with:
   - A unique `session_id`
   - `step_completed = 3`
   - All three timestamp fields filled

---

## 🔄 If You Need to Switch Databases Later

The code is **database-agnostic**. See `DATABASE-MIGRATION-GUIDE.md` for:
- How to export your data
- How to switch to any PostgreSQL database
- How to update the code (minimal changes needed)

---

## 🆘 Still Having Issues?

### Check 1: Does the table exist?
```sql
SELECT * FROM contact_inquiries LIMIT 1;
```
If this works, the table exists.

### Check 2: Did migration run successfully?
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'contact_inquiries' 
AND column_name = 'session_id';
```
Should return `session_id` if migration worked.

### Check 3: Are there any errors in the migration?
Re-run the migration script - it's safe to run multiple times!
All commands use `IF NOT EXISTS` so they won't cause errors.

---

**That's it! Your multi-step form should now work perfectly.** 🎉
