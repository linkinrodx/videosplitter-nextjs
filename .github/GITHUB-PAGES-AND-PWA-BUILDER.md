# GitHub Pages + PWABuilder (TWA) Deployment Guide

## Overview

This guide explains how to deploy Video Splitter to GitHub Pages and convert it to a native Android app using PWABuilder.

## Part 1: GitHub Pages Deployment

### Step 1: Enable GitHub Pages in Repository Settings

1. Go to your GitHub repo → **Settings**
2. Scroll to **Pages** section
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions" (already configured)
   - **Branch**: Should auto-detect `main`
4. Click **Save**

### Step 2: Configure Next.js for Static Export

The workflow automatically uses `next.config.github-pages.mjs` which adds:
- `output: 'export'` - Exports as static site
- `basePath: '/videosplitter-nextjs'` - GitHub Pages subdomain path
- `assetPrefix: '/videosplitter-nextjs'` - Asset URL prefix

> **Note**: Your app path will be: `https://linkinrodx.github.io/videosplitter-nextjs`

### Step 3: Deploy

Push to `main` and the workflow runs automatically:

```bash
git add .
git commit -m "chore: enable GitHub Pages deployment"
git push origin main
```

The GitHub Actions workflow will:
1. Build the Next.js app with static export
2. Upload to GitHub Pages
3. Deploy automatically

Check progress in **Actions** tab on GitHub.

### Step 4: Access Your App

Once deployed (usually 1-2 minutes):
```
https://linkinrodx.github.io/videosplitter-nextjs
```

---

## Part 2: Convert to Android App with PWABuilder

### What is TWA?

**TWA (Trusted Web Activity)** = Your PWA wrapped as a native Android app
- Runs your website in a full-screen Android WebView
- Can be distributed on Google Play Store
- User can install from Play Store or APK file

### Step 1: Prepare Your PWA

Your app already has everything needed:
- ✅ Manifest: `public/manifest.json`
- ✅ Service Worker: `public/sw.js`
- ✅ Icons: SVG icons in `public/icons/`
- ✅ HTTPS: GitHub Pages provides HTTPS

### Step 2: Generate APK with PWABuilder

1. Go to [PWABuilder.com](https://www.pwabuilder.com)

2. Enter your app URL:
   ```
   https://linkinrodx.github.io/videosplitter-nextjs
   ```

3. Click "Start" and let it analyze your PWA

4. Review the PWA quality score:
   - ✅ Manifest validation
   - ✅ Service Worker check
   - ✅ HTTPS verification
   - ✅ Icon requirements

5. Click "Package for stores" → **Android** (Google Play)

6. Fill in required information:
   - **App name**: Video Splitter
   - **App URL**: `https://linkinrodx.github.io/videosplitter-nextjs`
   - **Package ID**: `com.yourdomain.videosplitter` (or similar)
   - **Version**: 1.0.0
   - **Publisher email**: Your email
   - **Logo**: Use your app icon

7. Click "Generate" → Download **APK file**

### Step 3: Test the APK

#### Option A: Install on Android Phone
1. Enable "Unknown sources" in phone settings
2. Transfer APK to phone
3. Tap to install
4. Launch app and test

#### Option B: Test in Emulator
1. Download [Android Studio](https://developer.android.com/studio)
2. Create virtual device
3. Drag APK to emulator
4. App installs automatically

#### Option C: Generate Signing Certificate (for Play Store)
If you want to distribute on Google Play Store:

PWABuilder generates a **Signing Certificate** (.jks file):
1. Download the signing certificate
2. Keep it safe (you'll need it for updates)
3. Upload APK + certificate to Google Play Console

---

## Manifest Checklist for PWABuilder

PWABuilder requires these manifest fields. Yours already has:

```json
{
  "name": "Video Splitter",
  "short_name": "VidSplit",
  "description": "Split videos into segments right from your Android device",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1a1a2e",
  "background_color": "#1a1a2e",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-maskable.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "maskable"
    }
  ]
}
```

**Recommended improvements for better PWABuilder score:**

Add screenshot thumbnails in manifest:

```json
{
  "screenshots": [
    {
      "src": "/screenshots/screenshot1.png",
      "sizes": "540x720",
      "form_factor": "narrow",
      "type": "image/png"
    },
    {
      "src": "/screenshots/screenshot2.png",
      "sizes": "1280x720",
      "form_factor": "wide",
      "type": "image/png"
    }
  ]
}
```

Add to `public/manifest.json` for better PWABuilder score.

---

## Workflow: Update APK on GitHub Pages Update

When you push changes to `main`:
1. GitHub Pages workflow builds and deploys
2. App updates at `https://linkinrodx.github.io/videosplitter-nextjs`
3. Service Worker caches new version
4. Users get updates on next visit

To release new APK after updates:
1. Test app at deployed URL
2. Return to PWABuilder
3. Re-generate APK with same URL
4. Share new APK version

---

## Distribution Options

### Option 1: Direct APK Download (Easiest)
- Users download APK from your website
- They sideload to phone manually
- No Play Store required

### Option 2: Google Play Store (Recommended)
- Professional distribution channel
- Easier for users to discover
- Automatic updates
- Requires Google Play Developer account ($25)

### Option 3: Both
- Offer both APK download + Play Store version
- Reach different user preferences

---

## Troubleshooting

### PWABuilder shows low score
- Ensure all manifest fields are present
- Check icons are accessible at deployed URL
- Verify Service Worker is loaded
- Look for CORS errors in browser console

### App crashes after installation
- Check browser console (DevTools on Android)
- Ensure all resources load correctly
- Verify CORS headers are correct (already configured)

### Can't generate APK
- Check that GitHub Pages deployment is working
- Verify URL is accessible and HTTPS
- Wait a few minutes for Service Worker to cache

### App won't launch from Play Store
- Ensure signing certificate is correct
- Verify package ID matches
- Check app version isn't downgraded

---

## Security Notes

**Never share** your signing certificate (.jks file) if distributing on Play Store.

**URLs in manifest** should always be HTTPS for security.

Your app processes all data client-side (FFmpeg in browser), so no privacy concerns with GitHub Pages hosting.

---

## Next Steps

1. ✅ Commit these files to GitHub
2. ✅ Wait for GitHub Pages deployment (check Actions tab)
3. ✅ Visit your app URL: `https://linkinrodx.github.io/videosplitter-nextjs`
4. ✅ Go to PWABuilder.com to generate APK
5. ✅ Test APK on Android device
6. ✅ (Optional) Publish to Google Play Store

---

## References

- [PWABuilder Documentation](https://docs.pwabuilder.com/)
- [GitHub Pages Setup](https://docs.github.com/en/pages)
- [Next.js Static Export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Google Play Store Console](https://play.google.com/console)
