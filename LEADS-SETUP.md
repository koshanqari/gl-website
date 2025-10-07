# 🎯 Leads (CRM) Setup Guide

## Quick Start (2 Steps)

### Step 1: Run SQL in Supabase

1. **Open Supabase Dashboard** → **SQL Editor**
2. **Copy this file**: `supabase-leads-schema.sql`
3. **Paste** and **Run**
4. ✅ Done! Table created

### Step 2: Test the Form

```bash
npm run dev
```

Go to: `http://localhost:3000/contact`

Fill out the 3-step form and check your Supabase `leads` table!

---

## 📊 What You Get

### Clean Leads Table

**Only Essential Fields:**
- ✅ Contact info (name, email, phone, company)
- ✅ Meeting preferences (date, time, mode)
- ✅ Event details (type, date, location, guests, details)
- ✅ CRM fields (status, priority, admin_notes)
- ✅ Marketing tracking (lead_source, UTM parameters)
- ✅ Timestamps (created_at, updated_at, step completion times)

**No Bloat:**
- ❌ No unnecessary legacy fields
- ❌ No session_id (uses id instead)
- ❌ No redundant fields

---

## 🎨 Admin Panel Features

### Dashboard Stats:
- Total Leads
- New Leads (status = new)
- Converted (status = won)
- High Priority

### Filters:
- Search by name/email/company
- Filter by Status (new, contacted, qualified, proposal_sent, won, lost)
- Filter by Priority (low, medium, high)
- Sort by Date/Name/Event Type

### Actions:
- Update Status (dropdown in table)
- Update Priority (dropdown in table)
- Add Admin Notes (button)
- Delete Lead (button)
- Export to CSV (all leads with UTM data)

---

## 🚀 Multi-Step Form Flow

```
Step 1: Basic Info
├─ Name *
├─ Email *
├─ Phone
└─ Company
   ↓ [Continue] → Saves to DB, returns leadId
   
Step 2: Meeting Preferences  
├─ Preferred Date
├─ Preferred Time
└─ Preferred Mode
   ↓ [Continue] → Updates same lead
   
Step 3: Event Details
├─ Event Type *
├─ Event Date
├─ Location (Country, Pincode, Region, City)
├─ Guest Count
└─ Additional Details *
   ↓ [Submit] → Final update, marks complete
```

---

## 📈 Marketing Tracking

### UTM Parameters Auto-Captured

If someone visits:
```
https://yoursite.com/contact?utm_source=google&utm_medium=cpc&utm_campaign=summer2024
```

The form automatically saves:
- `utm_source`: "google"
- `utm_medium`: "cpc"
- `utm_campaign`: "summer2024"
- `lead_source`: "form"

**Use Case**: Track which marketing campaigns generate the most leads!

---

## 🗄️ Database Portability

### Works with ANY PostgreSQL Database:

✅ **Supabase** (current)
✅ **Neon** (serverless)
✅ **Railway**
✅ **Render**
✅ **AWS RDS**
✅ **Self-hosted PostgreSQL**

To switch:
1. Export data from Supabase
2. Run `supabase-leads-schema.sql` on new database
3. Import data
4. Update connection string in `.env`

---

## 🔧 Files Created/Updated

### Database:
- ✅ `supabase-leads-schema.sql` - Fresh schema (run this!)

### Frontend:
- ✅ `/components/MultiStepContactForm.tsx` - 3-step form
- ✅ `/app/contact/page.tsx` - Uses new form

### API:
- ✅ `/api/contact-inquiries/route.ts` - Handles submissions
- ✅ `/api/intellsys/contact-inquiries/route.ts` - Admin GET/POST
- ✅ `/api/intellsys/contact-inquiries/[id]/route.ts` - Admin UPDATE/DELETE

### Admin Panel:
- ✅ `/app/intellsys/contact-inquiries/page.tsx` - CRM dashboard

---

## 🎯 Status Workflow

```
new → contacted → qualified → proposal_sent → won
  ↓
 lost (at any stage)
```

### Status Definitions:
- **new**: Fresh lead, not yet contacted
- **contacted**: Initial contact made
- **qualified**: Lead is qualified and interested
- **proposal_sent**: Proposal/quote sent
- **won**: Lead converted to customer! 🎉
- **lost**: Lead didn't convert

---

## 📞 CRM Best Practices

### Priority Assignment:
- **High**: Large events, Fortune 500 clients, urgent deadlines
- **Medium**: Standard inquiries
- **Low**: General questions, small events

### Lead Source Tracking:
- **form**: Website contact form (default)
- **manual**: Manually added by admin
- **referral**: Referred by existing client
- **social**: Social media
- **email**: Email campaign
- **phone**: Phone inquiry

---

## ✅ Checklist

- [ ] Run `supabase-leads-schema.sql` in Supabase
- [ ] Test form at `/contact`
- [ ] Check `leads` table in Supabase
- [ ] Test admin panel at `/intellsys/contact-inquiries`
- [ ] Try filtering by status/priority
- [ ] Export CSV to verify all fields
- [ ] Test with UTM parameters

---

**Ready to capture and convert leads! 🚀**
