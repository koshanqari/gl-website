# Image Optimization Guide

## 🎯 Automatic Compression

All images uploaded through the Media Manager are **automatically compressed** to ~500KB for optimal web performance.

## How It Works

### Upload Process:
1. **You upload** any image (up to 25MB)
2. **Server automatically:**
   - Resizes to max 2400px width (covers 4K displays)
   - Converts to WebP format (30% smaller than JPEG)
   - Compresses to target ~500KB
   - Adjusts quality (85% → 60%) until target size is reached
3. **Result:** Fast-loading, high-quality image stored on Bunny.net CDN

### Console Output Example:
```
Image compressed: Original 5200KB -> Final 485KB at 80% quality
```

## Using Images in Your Code

### Basic Usage:
```tsx
<img src="https://golden-lotus-prod.b-cdn.net/website/hero.webp" alt="Hero" />
```

### With Bunny.net Optimization (Recommended):
```tsx
<img 
  src="https://golden-lotus-prod.b-cdn.net/website/hero.webp?optimizer=image&width=1920&quality=80" 
  alt="Hero" 
/>
```

### Bunny.net Parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `optimizer=image` | Enable smart optimization | Required for optimization |
| `width=1920` | Resize to width (px) | Desktop: 1920, Mobile: 768 |
| `quality=80` | Quality (1-100) | 80 is recommended |
| `format=webp` | Force format | Usually auto-detected |

### Recommended Settings by Use Case:

**Hero Images (Full-width):**
```
?optimizer=image&width=1920&quality=85
```

**Section Images:**
```
?optimizer=image&width=1200&quality=80
```

**Thumbnails/Cards:**
```
?optimizer=image&width=600&quality=75
```

**Mobile (Responsive):**
```tsx
<picture>
  <source 
    media="(max-width: 768px)" 
    srcset="https://golden-lotus-prod.b-cdn.net/hero.webp?optimizer=image&width=768&quality=80" 
  />
  <img 
    src="https://golden-lotus-prod.b-cdn.net/hero.webp?optimizer=image&width=1920&quality=85" 
    alt="Hero" 
  />
</picture>
```

## File Size Limits

- **Images:** 25MB max (auto-compressed to ~500KB)
- **Videos:** 100MB max (no compression)

## Supported Formats

**Input:** JPG, PNG, GIF, WebP
**Output:** WebP (automatic conversion)

## Industry Standards

Your images will match or exceed these benchmarks:
- ✅ Apple.com: 150-300 KB
- ✅ Airbnb: 100-200 KB  
- ✅ Netflix: 150-300 KB
- ✅ Your site: ~500 KB (excellent quality)

## Tips

1. **Upload high-quality originals** - The server will optimize them
2. **Use Bunny.net parameters** - Further optimize based on context
3. **Check console logs** - See compression stats after upload
4. **Nested folders work** - `folder/subfolder/image.webp?optimizer=image` ✅

## Technical Details

- **Compression:** Sharp library (industry-standard)
- **Max Resolution:** 2400px width (4K-ready)
- **Quality Range:** 85% → 60% (adaptive)
- **Format:** WebP (30% smaller than JPEG, same quality)
- **CDN:** Bunny.net (global edge network)

---

**Questions?** Check the console logs after uploading to see compression stats!

