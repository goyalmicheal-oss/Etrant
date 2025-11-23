# Image Configuration Fix

## Issue
Next.js was blocking images from external sources like Wikipedia because they weren't configured in the `next.config.mjs` file.

**Error Message:**
```
Invalid src prop (https://upload.wikimedia.org/wikipedia/commons/d/d9/St_Margarets_Laceby.jpg) 
on `next/image`, hostname "upload.wikimedia.org" is not configured under images in your `next.config.js`
```

## Solution
Added `remotePatterns` configuration to `next.config.mjs` to allow images from trusted external sources.

## Changes Made

### File: `next.config.mjs`

Added the following remote patterns to the `images` configuration:

```javascript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'upload.wikimedia.org',
    pathname: '/wikipedia/**',
  },
  {
    protocol: 'https',
    hostname: '*.wikimedia.org',
  },
  {
    protocol: 'https',
    hostname: 'lh3.googleusercontent.com',
  },
  {
    protocol: 'https',
    hostname: 'avatars.githubusercontent.com',
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
  {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
  },
]
```

## Allowed Image Sources

Now your application can load images from:

1. **Wikipedia/Wikimedia** - For article images
   - `upload.wikimedia.org`
   - `*.wikimedia.org` (all Wikimedia subdomains)

2. **Google User Content** - For user profile pictures
   - `lh3.googleusercontent.com`

3. **GitHub** - For GitHub avatars
   - `avatars.githubusercontent.com`

4. **Unsplash** - For stock photos
   - `images.unsplash.com`

5. **Cloudinary** - For CDN-hosted images
   - `res.cloudinary.com`

## Benefits

✅ **Wikipedia Images**: Can now load images from Wikipedia articles  
✅ **User Avatars**: Google and GitHub profile pictures work  
✅ **Performance**: Images are optimized (AVIF, WebP) and cached  
✅ **Security**: Only specific trusted domains are allowed  

## Testing

To verify the fix works:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to a page with Wikipedia images

3. Check that images load without errors

4. Verify in DevTools that images are being optimized (check for `.webp` or `.avif` formats)

## Security Note

The `remotePatterns` configuration uses a whitelist approach - only explicitly allowed domains can serve images. This prevents:
- Loading images from untrusted sources
- Potential security vulnerabilities
- Bandwidth abuse

If you need to add more image sources in the future, simply add them to the `remotePatterns` array.

## Related Files

- `next.config.mjs` - Image configuration
- `middleware.ts` - CSP headers (already allows `https:` for images)

---

**Status**: ✅ Fixed and ready to use!
