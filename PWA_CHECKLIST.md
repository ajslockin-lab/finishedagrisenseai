# AgriSense Next.js PWA Setup Checklist

Follow this step-by-step to get your PWA live!

## ✅ Pre-Setup (Already Done)

- [x] PWA package added to package.json
- [x] next.config.ts configured
- [x] manifest.json created
- [x] Layout updated with PWA metadata
- [x] Install prompt component created
- [x] Offline page created
- [x] .gitignore updated

## 📦 Step 1: Create App Icons (REQUIRED)

Choose ONE method:

### Method A: Online Generator (Recommended - 5 min)
- [ ] Create 512x512 icon (use Canva, Photoshop, or similar)
  - Green background (#386641)
  - Rice/wheat symbol or "AS" text
  - Simple and recognizable
- [ ] Go to https://www.pwabuilder.com/imageGenerator
- [ ] Upload your 512x512 icon
- [ ] Download generated icons zip
- [ ] Extract and copy ALL icons to `public/icons/` folder
- [ ] Verify you have all 9 icon files:
  - [ ] icon-72x72.png
  - [ ] icon-96x96.png
  - [ ] icon-128x128.png
  - [ ] icon-144x144.png
  - [ ] icon-152x152.png
  - [ ] icon-192x192.png
  - [ ] icon-192x192-maskable.png
  - [ ] icon-384x384.png
  - [ ] icon-512x512.png

### Method B: Quick Placeholder (Testing only - 2 min)
- [ ] Create simple 512x512 green square with "AS" text
- [ ] Save as icon-512x512.png in `public/icons/`
- [ ] Copy same file with all required names (not ideal but works)

## 🔧 Step 2: Install Dependencies

```bash
cd agrisenseai-main
npm install
```

- [ ] Run `npm install`
- [ ] Verify no errors
- [ ] Check that `@ducanh2912/next-pwa` is installed

## 🏗️ Step 3: Build the App

```bash
npm run build
```

- [ ] Run build command
- [ ] Wait for build to complete
- [ ] Check for any errors
- [ ] Verify service worker files are generated in `public/`

## 🧪 Step 4: Test Locally

```bash
npm start
```

- [ ] Start production server (port 3000)
- [ ] Open http://localhost:3000 in Chrome
- [ ] Press F12 (DevTools)
- [ ] Go to Application tab
- [ ] Check Manifest section:
  - [ ] Manifest loads without errors
  - [ ] All icons show preview
  - [ ] Theme color is correct
- [ ] Check Service Workers section:
  - [ ] Service worker is registered
  - [ ] Shows as "activated and running"
- [ ] Check install prompt:
  - [ ] After 5 seconds, install button appears
  - [ ] Can dismiss or install

## 🔍 Step 5: Lighthouse Audit

With app still running locally:

- [ ] F12 → Lighthouse tab
- [ ] Select "Progressive Web App" category
- [ ] Click "Analyze page load"
- [ ] Check PWA score (should be 90+)
- [ ] Review any warnings
- [ ] Fix issues if score is low

## 📤 Step 6: Deploy to Netlify

```bash
git add .
git commit -m "Add PWA support with icons"
git push
```

- [ ] Commit all changes
- [ ] Push to GitHub/GitLab
- [ ] Wait for Netlify deployment
- [ ] Check deployment log for errors
- [ ] Visit deployed site

## 📱 Step 7: Test on Devices

### Android Phone
- [ ] Visit deployed site in Chrome
- [ ] Wait for install prompt (5 seconds)
- [ ] Click "Install"
- [ ] Verify app appears on home screen
- [ ] Open app from home screen
- [ ] Check it runs in standalone mode (no browser UI)
- [ ] Turn on Airplane Mode
- [ ] Verify offline page appears
- [ ] Turn off Airplane Mode
- [ ] Verify app reconnects

### iPhone/iPad
- [ ] Visit deployed site in Safari
- [ ] Look for iOS install banner
- [ ] Tap Share button (square with arrow)
- [ ] Tap "Add to Home Screen"
- [ ] Verify app on home screen
- [ ] Test offline functionality

### Desktop
- [ ] Visit in Chrome or Edge
- [ ] Look for install icon in address bar
- [ ] Click install
- [ ] App opens in new window
- [ ] Test functionality

## 🎯 Step 8: Verify All Features

- [ ] Install prompt works
- [ ] Offline mode works
- [ ] All pages cache properly
- [ ] Navigation works in standalone mode
- [ ] Icons display correctly
- [ ] Theme color matches in browser
- [ ] App shortcuts work (long press icon on Android)

## 📊 Final Checks

- [ ] Run Lighthouse on deployed site
- [ ] PWA score 90+ ✅
- [ ] Installable ✅
- [ ] Works offline ✅
- [ ] Configured for HTTPS ✅
- [ ] No console errors
- [ ] All icons load
- [ ] Manifest valid

## 🎉 Launch

- [ ] Announce to users
- [ ] Add "Install App" call-to-action on website
- [ ] Create installation guide for farmers
- [ ] Share on social media
- [ ] Monitor installation analytics

---

## ⏱️ Estimated Time

- Icon creation: 5-10 minutes
- Installation & build: 5 minutes
- Local testing: 10 minutes
- Deployment: 5 minutes
- Device testing: 15 minutes

**Total: ~40-45 minutes**

---

## 🐛 Common Issues

### Icons not showing
✅ Solution: Verify files in `public/icons/` match manifest.json exactly

### Service worker not registering
✅ Solution: Must use production build (`npm run build && npm start`)

### Install prompt not appearing
✅ Solution: 
- Clear browser cache
- Check Application → Service Workers in DevTools
- Android: Use Chrome/Edge only
- iOS: Use manual "Add to Home Screen"

### Build fails
✅ Solution:
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Need Help?

Refer to:
- `PWA_SETUP.md` - Detailed setup guide
- `ICON_GENERATION.md` - Icon creation help
- Browser DevTools → Application tab
- Netlify deployment logs

---

**Ready to launch!** 🚀🌾

Once all boxes are checked, your AgriSense PWA is ready for farmers!
