# Quick Icon Generation Script

If you have ImageMagick installed, you can quickly generate placeholder icons from an SVG or PNG.

## Using ImageMagick (if installed):

### From your logo PNG:
```bash
# Navigate to your project
cd agrisenseai-main/public/icons

# If you have a 512x512 source image called 'source.png':
convert source.png -resize 72x72 icon-72x72.png
convert source.png -resize 96x96 icon-96x96.png
convert source.png -resize 128x128 icon-128x128.png
convert source.png -resize 144x144 icon-144x144.png
convert source.png -resize 152x152 icon-152x152.png
convert source.png -resize 192x192 icon-192x192.png
convert source.png -resize 192x192 icon-192x192-maskable.png
convert source.png -resize 384x384 icon-384x384.png
convert source.png -resize 512x512 icon-512x512.png
```

## Without ImageMagick:

### Option 1: Online Tool (Easiest)
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload 512x512 PNG
3. Download all generated icons
4. Place in `public/icons/` folder

### Option 2: Create Simple Placeholder
For testing only, create a simple colored square:

1. Open paint/preview/photoshop
2. Create 512x512 canvas
3. Fill with green (#386641)
4. Add text "AS" in white
5. Save as PNG
6. Use online tool to generate all sizes

## Temporary Placeholder (for quick testing):

If you just want to test the PWA RIGHT NOW:

```bash
cd public/icons

# Create a simple green square using ImageMagick
convert -size 512x512 xc:#386641 \
  -gravity center \
  -pointsize 200 \
  -fill white \
  -annotate +0+0 "AS" \
  icon-512x512.png

# Then generate all sizes from it
convert icon-512x512.png -resize 72x72 icon-72x72.png
convert icon-512x512.png -resize 96x96 icon-96x96.png
convert icon-512x512.png -resize 128x128 icon-128x128.png
convert icon-512x512.png -resize 144x144 icon-144x144.png
convert icon-512x512.png -resize 152x152 icon-152x152.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 192x192 icon-192x192-maskable.png
convert icon-512x512.png -resize 384x384 icon-384x384.png
```

## Best Practice:

Use https://www.pwabuilder.com/imageGenerator

It automatically creates:
- Proper padding for maskable icons
- All required sizes
- Optimized PNGs
- Apple touch icons

Takes 2 minutes total!
