# AgriSense PWA Setup Guide

Your Next.js app is now configured as a Progressive Web App (PWA)! 🎉

## ✅ What's Already Done

- ✅ PWA package added to dependencies (`@ducanh2912/next-pwa`)
- ✅ `next.config.ts` configured with PWA settings
- ✅ `manifest.json` created in `/public` folder
- ✅ Layout updated with PWA metadata and meta tags
- ✅ PWA install prompt component added
- ✅ Offline fallback page created
- ✅ Service worker will auto-generate on build

## 🎨 Next Step: Create App Icons

You MUST create icons before deploying. Here's how:

### Option 1: Use Online Generator (Recommended - 5 minutes)

1. **Create a 512x512 Icon:**
   - Go to https://www.canva.com (free)
   - Create 512x512 design
   - Use green background (#386641)
   - Add rice/wheat icon or use the AgriSense logo
   - Download as PNG

2. **Generate All Sizes:**
   - Go to https://www.pwabuilder.com/imageGenerator
   - Upload your 512x512 icon
   - Click "Generate"
   - Download the zip file

3. **Add Icons to Project:**
   - Extract the downloaded zip
   - Copy ALL icon files to `public/icons/` folder
   - Make sure you have these sizes:
     - icon-72x72.png
     - icon-96x96.png
     - icon-128x128.png
     - icon-144x144.png
     - icon-152x152.png
     - icon-192x192.png
     - icon-192x192-maskable.png
     - icon-384x384.png
     - icon-512x512.png

### Option 2: Quick Test (Use Existing SVG)

If you just want to test quickly:

1. Create a simple 512x512 PNG using the inline SVG from your layout
2. Name it `icon-512x512.png`
3. Place in `public/icons/`
4. Copy it with different names for all sizes (not ideal but works for testing)

### Option 3: Professional Icons

For best results, hire a designer to create:
- A simple, recognizable icon
- Works well at small sizes
- Looks good on light and dark backgrounds
- Represents agriculture/farming

## 🚀 Installation & Deployment

### Install Dependencies:

```bash
npm install
```

This will install `@ducanh2912/next-pwa` and generate the service worker.

### Build for Production:

```bash
npm run build
```

The build process will:
- Generate service worker (`sw.js` in public folder)
- Create workbox files for caching
- Optimize all assets for PWA

### Deploy to Netlify:

1. Push to Git:
   ```bash
   git add .
   git commit -m "Add PWA support"
   git push
   ```

2. Netlify will automatically:
   - Run `npm run build`
   - Deploy your PWA
   - Serve over HTTPS (required for PWA)

### Local Testing:

```bash
npm run dev
```

**Note:** PWA features won't work in dev mode (service worker is disabled). You need to build and test the production build:

```bash
npm run build
npm start
```

Then visit http://localhost:3000

## 📱 Testing Your PWA

### Desktop (Chrome/Edge):

1. Build and start production server
2. Open http://localhost:3000
3. Press F12 → Application tab
4. Check:
   - Manifest loads correctly
   - Service Worker is registered
   - Icons show up properly
5. Click install button in address bar
6. App should install and open as standalone

### Mobile (Android):

1. Deploy to Netlify
2. Visit site on Android phone (Chrome)
3. After 5 seconds, install prompt appears
4. Click "Install"
5. App appears on home screen
6. Test offline mode (turn on airplane mode)

### Mobile (iOS):

1. Visit site on iPhone/iPad (Safari)
2. Banner appears showing install instructions
3. Tap Share button
4. Tap "Add to Home Screen"
5. App appears on home screen

### Lighthouse PWA Audit:

1. Open your deployed site
2. Press F12
3. Go to Lighthouse tab
4. Select "Progressive Web App"
5. Click "Generate report"
6. Should score 90+ (100 with proper icons)

## 🎯 PWA Features Enabled

Your app now has:

✅ **Install Prompt** - Users can install from browser (with custom UI)
✅ **Offline Support** - Caches pages and assets automatically
✅ **App Shortcuts** - Quick access to Advisor, Sensors, Prices
✅ **Standalone Mode** - Runs like a native app (no browser UI)
✅ **Fast Loading** - Instant load for cached pages
✅ **Background Sync** - Can sync data when connection returns
✅ **Push Notifications** - Ready for implementing alerts (needs backend)

## 📋 File Structure

```
agrisenseai-main/
├── public/
│   ├── manifest.json          ← App configuration
│   ├── icons/                 ← ADD YOUR ICONS HERE
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── ... (all sizes)
│   └── sw.js                  ← Auto-generated on build
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← Updated with PWA metadata
│   │   ├── offline/
│   │   │   └── page.tsx       ← Offline fallback page
│   │   └── ...
│   └── components/
│       └── PWAInstallPrompt.tsx  ← Install prompt UI
├── next.config.ts             ← PWA configuration
└── package.json               ← PWA dependency added
```

## 🔧 Customization

### Change App Colors:

Edit `public/manifest.json`:
```json
{
  "theme_color": "#386641",        // Browser bar color
  "background_color": "#ffffff"    // Splash screen background
}
```

Update `src/app/layout.tsx`:
```tsx
<meta name="theme-color" content="#386641" />
```

### Customize Install Prompt:

Edit `src/components/PWAInstallPrompt.tsx` to change:
- Timing (currently shows after 5 seconds)
- Text and styling
- Position on screen

### Add More Shortcuts:

Edit `public/manifest.json` shortcuts array:
```json
{
  "name": "Weather",
  "url": "/weather",
  "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }]
}
```

### Offline Page Customization:

Edit `src/app/offline/page.tsx` to match your branding.

## 🐛 Troubleshooting

### Icons not showing:
- Verify icons exist in `public/icons/`
- Check file names match exactly in manifest.json
- Clear browser cache
- Rebuild: `npm run build`

### Service Worker not registering:
- Must be production build (`npm run build && npm start`)
- Must be served over HTTPS (Netlify does this)
- Check console for errors
- Try clearing Application → Storage in DevTools

### Install prompt not appearing:
- Android: Chrome, Edge, Samsung Internet only
- iOS: No automatic prompt (use manual "Add to Home Screen")
- Desktop: Chrome and Edge
- May not show if already installed

### Build errors:
```bash
rm -rf .next
npm install
npm run build
```

## 📚 Resources

- Next PWA Docs: https://ducanh-next-pwa.vercel.app/
- Icon Generator: https://www.pwabuilder.com/imageGenerator
- PWA Guide: https://web.dev/progressive-web-apps/
- Manifest Spec: https://web.dev/add-manifest/

## 🎉 Next Steps

1. **Create icons** (see above)
2. **Install dependencies:** `npm install`
3. **Build:** `npm run build`
4. **Test locally:** `npm start`
5. **Deploy to Netlify:** `git push`
6. **Test on mobile devices**
7. **Share with farmers!** 🌾

## 💡 Future Enhancements

Consider adding:
- Push notification service (for price alerts, weather warnings)
- Camera integration (for crop disease detection)
- GPS location (for local weather/prices)
- Background sync (for offline data submission)
- Biometric authentication (for secure login)

---

**Need Help?**

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Check browser console for errors
3. Verify all icons are present
4. Make sure you're testing production build

Your AgriSense PWA is ready to help farmers! 🚜📱✨
