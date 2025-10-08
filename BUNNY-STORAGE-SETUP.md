# Bunny.net Storage Setup Guide

## Why Bunny.net Instead of S3?

✅ **Simpler** - No complex IAM policies or bucket configurations
✅ **Cheaper** - More affordable pricing than AWS S3
✅ **Built-in CDN** - Fast global delivery included
✅ **No Expiration** - URLs never expire (unlike pre-signed URLs)
✅ **Easy API** - Simple HTTP PUT/DELETE requests
✅ **Image Optimization** - Automatic optimization and resizing

## Setup Steps

### 1. Create Bunny.net Account
- Go to: https://bunny.net
- Sign up for a free account

### 2. Create Storage Zone
1. Go to: https://panel.bunny.net/storage
2. Click "Add Storage Zone"
3. Choose a name (e.g., `golden-lotus-storage`)
4. Select region:
   - `sg` = Singapore (Asia)
   - `de` = Germany (Europe)
   - `ny` = New York (US East)
   - `la` = Los Angeles (US West)
5. Click "Add Storage Zone"

### 3. Get Storage Password

**IMPORTANT:** There are TWO different passwords in Bunny.net:
1. **FTP Password** - For FileZilla/FTP clients (what your DevOps team provided)
2. **API Password** - For programmatic access (what we need)

**To get the API Password:**
1. Go to: https://panel.bunny.net/storage
2. Click on your storage zone (`golden-lotus-prod`)
3. Click on "FTP & API Access" tab
4. Look for **"Password"** field (NOT "FTP Password")
5. Copy the password - this is your `BUNNY_STORAGE_PASSWORD`

**Note:** The FTP password and API password are usually the same, but if 401 errors occur, verify you're using the correct one.

### 4. Create Pull Zone (CDN)
1. Go to: https://panel.bunny.net/pullzones
2. Click "Add Pull Zone"
3. Choose "Bunny Storage" as origin
4. Select your storage zone
5. Choose a name (e.g., `golden-lotus-cdn`)
6. Click "Add Pull Zone"
7. Note your Pull Zone URL (e.g., `https://golden-lotus-cdn.b-cdn.net`)

### 5. Update Environment Variables

✅ **Already configured!** Your DevOps team has set this up:

```env
# Bunny.net Storage Configuration
BUNNY_STORAGE_ZONE_NAME=golden-lotus-prod
BUNNY_STORAGE_PASSWORD=35af7c7f-3900-4113-9ef07739ce9a-d363-4ed7
BUNNY_CDN_URL=https://golden-lotus-prod.b-cdn.net
```

**Note:** We use the main storage endpoint (`storage.bunnycdn.com`) without region prefix.

### 6. Test Upload

Run the test script:
```bash
npm run test:bunny
```

Or manually test through the admin panel:
1. Go to `/intellsys/blogs/new`
2. Try uploading an image
3. Check if the image URL works

## API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File (image only, max 5MB)
- folder: string (optional, default: 'uploads')

Response:
{
  "success": true,
  "url": "https://your-cdn.b-cdn.net/blogs/1234567890-image.jpg",
  "key": "blogs/1234567890-image.jpg"
}
```

## Folder Structure

Recommended folder organization:
- `blogs/` - Blog post images
- `work/` - Portfolio/work images
- `capabilities/` - Capability images
- `testimonials/` - Testimonial avatars
- `uploads/` - General uploads

## Pricing (as of 2024)

**Bunny.net:**
- Storage: $0.01/GB/month
- Bandwidth: $0.01-0.05/GB (depending on region)
- No request fees
- **Example:** 10GB storage + 100GB bandwidth = ~$1.50/month

**AWS S3 (comparison):**
- Storage: $0.023/GB/month
- Bandwidth: $0.09/GB
- Request fees: $0.0004 per 1000 requests
- **Example:** 10GB storage + 100GB bandwidth = ~$11/month

**Bunny is ~7x cheaper!** 💰

## Troubleshooting

### Error: "Invalid AccessKey"
- Check `BUNNY_STORAGE_PASSWORD` in `.env.local`
- Verify password in Bunny panel under "FTP & API Access"

### Error: "Storage zone not found"
- Check `BUNNY_STORAGE_ZONE_NAME` matches exactly
- No spaces or special characters

### Images not loading
- Verify `BUNNY_CDN_URL` is correct
- Check Pull Zone is connected to Storage Zone
- Wait 1-2 minutes for CDN propagation

### Upload works but image not accessible
- Check Pull Zone settings
- Ensure Pull Zone is enabled
- Verify Storage Zone is linked to Pull Zone

## Benefits Summary

✅ **No bucket policies needed** - Just works out of the box
✅ **No IAM complexity** - Simple password-based authentication
✅ **Global CDN included** - Fast delivery worldwide
✅ **Permanent URLs** - Never expire
✅ **Cost effective** - Much cheaper than S3
✅ **Image optimization** - Built-in resizing and optimization

## Migration from S3

If you have existing images in S3, you can:
1. Download them from S3
2. Upload to Bunny.net
3. Update image URLs in database

Or keep using both:
- Old images: S3 URLs
- New images: Bunny.net URLs
