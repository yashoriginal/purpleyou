# Product Images Setup

This guide explains how to download and manage product images for your Purple You store.

## Quick Start

### Step 1: Download Random Images

Run the image download script:

```bash
npm run download-images 
```

This will download **12 random jewelry images** from Unsplash and organize them into categories:
- **3 necklace images** → `necklace-1.jpg`, `necklace-2.jpg`, `necklace-3.jpg`
- **3 ring images** → `ring-1.jpg`, `ring-2.jpg`, `ring-3.jpg`
- **3 bracelet images** → `bracelet-1.jpg`, `bracelet-2.jpg`, `bracelet-3.jpg`
- **3 earring images** → `earring-1.jpg`, `earring-2.jpg`, `earring-3.jpg`

All images are saved to: `public/images/products/`

### Step 2: Use Images in Products

Images are now available at these paths:

```
/images/products/necklace-1.jpg
/images/products/ring-1.jpg
/images/products/bracelet-1.jpg
/images/products/earring-1.jpg
...etc
```

### Step 3: Update Backend API

Update your backend product API to use these local images by setting the image URLs to:

```
https://yourdomaincom/images/products/[filename].jpg
```

Or if using a relative path:

```
/images/products/[filename].jpg
```

## Manual Image Management

### Adding Custom Images

1. **Download your own images** from:
   - Unsplash: https://unsplash.com
   - Pexels: https://pexels.com
   - Pixabay: https://pixabay.com

2. **Save to `public/images/products/`**

3. **Name them consistently**:
   - Good: `necklace-layered.jpg`, `ring-gold-band.jpg`
   - Avoid: `IMG_123456.jpg`, `photo.jpg`

### Renaming Images

After downloading, rename images to match your products:

```bash
# Example: rename necklace-1.jpg to match your product
mv public/images/products/necklace-1.jpg public/images/products/layering-necklace-set.jpg
```

### Image Recommendations

For best results:

- **Format**: JPG or PNG
- **Dimensions**: 600x600px minimum (square recommended)
- **File Size**: < 500KB per image
- **Quality**: High-quality product photos

## Fallback Images

If a product image fails to load, the system will use:

```
/images/hero1.jpg (default fallback)
```

This is defined in `src/services/product.service.ts`.

## Directory Structure

```
public/
├── images/
│   ├── hero1.jpg (hero/banner image)
│   └── products/
│       ├── necklace-1.jpg
│       ├── necklace-2.jpg
│       ├── ring-1.jpg
│       └── ...etc
```

## Using Images in Components

### Example: Product Component

```tsx
import Image from "next/image";

export function ProductCard({ product }) {
  return (
    <Image
      src={product.image}  // e.g., "/images/products/necklace-1.jpg"
      alt={product.name}
      width={600}
      height={600}
    />
  );
}
```

## Troubleshooting

### Images not showing?

1. Check image file exists: `public/images/products/[filename].jpg`
2. Verify backend API returns correct image paths
3. Check browser console for image loading errors
4. Ensure image paths start with `/images/` (relative path)

### Download script failed?

1. Check internet connection
2. Run again: `npm run download-images`
3. If Unsplash is unavailable, download images manually and place in `public/images/products/`

### How to update images?

1. Delete old images from `public/images/products/`
2. Run `npm run download-images` again, or
3. Manually add new images to the directory

## Image CDN (Optional)

For better performance in production, consider uploading images to:

- **Cloudinary**: https://cloudinary.com
- **AWS S3**: https://aws.amazon.com/s3/
- **Netlify Image Optimization**: Built-in with Netlify hosting

Then update backend API URLs to point to your CDN.

## Support

For issues with the download script:

1. Check that curl/wget is available on your system
2. Verify internet connectivity
3. Check Unsplash API status
4. Try downloading images manually from Unsplash and adding to `public/images/products/`
