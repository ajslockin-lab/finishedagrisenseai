import sharp from 'sharp';
import { mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');
const iconsDir = join(publicDir, 'icons');
const sourceImage = process.argv[2];

if (!sourceImage) {
    console.error('Usage: node generate-icons.mjs <source-image-path>');
    process.exit(1);
}

// Create icons directory
mkdirSync(iconsDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
    // Copy source as the main logo
    await sharp(sourceImage)
        .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(join(publicDir, 'logo.png'));

    console.log('Created logo.png');

    for (const size of sizes) {
        const filename = `icon-${size}x${size}.png`;
        await sharp(sourceImage)
            .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(join(iconsDir, filename));
        console.log(`Created ${filename}`);
    }

    // Create maskable icon (with padding for safe zone)
    const maskableSize = 192;
    const padding = Math.round(maskableSize * 0.1); // 10% padding
    const innerSize = maskableSize - (padding * 2);

    await sharp(sourceImage)
        .resize(innerSize, innerSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 248, g: 252, b: 249, alpha: 1 } // Light green background
        })
        .png()
        .toFile(join(iconsDir, `icon-${maskableSize}x${maskableSize}-maskable.png`));

    console.log(`Created icon-${maskableSize}x${maskableSize}-maskable.png`);

    // Create header logo (small, for in-app use)
    await sharp(sourceImage)
        .resize(40, 40, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(join(publicDir, 'header-logo.png'));

    console.log('Created header-logo.png');

    // Create favicon
    await sharp(sourceImage)
        .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(join(publicDir, 'favicon.png'));

    console.log('Created favicon.png');

    // Create apple touch icon
    await sharp(sourceImage)
        .resize(180, 180, { fit: 'contain', background: { r: 248, g: 252, b: 249, alpha: 1 } })
        .png()
        .toFile(join(publicDir, 'apple-touch-icon.png'));

    console.log('Created apple-touch-icon.png');

    console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
