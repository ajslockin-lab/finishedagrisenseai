import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');
const iconsDir = join(publicDir, 'icons');

mkdirSync(iconsDir, { recursive: true });

// High-quality SVG logo: Circuit-leaf on dark green background
const svgLogo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Leaf gradient -->
    <linearGradient id="leafGrad" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="40%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
    <!-- Glow gradient -->
    <linearGradient id="glowGrad" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#86efac"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
    <!-- Background gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a3d2a"/>
      <stop offset="100%" stop-color="#062016"/>
    </linearGradient>
    <!-- Glow filter -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <!-- Strong glow for dots -->
    <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <!-- Subtle shadow -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background rounded rectangle -->
  <rect x="16" y="16" width="480" height="480" rx="96" ry="96" fill="url(#bgGrad)"/>

  <!-- Circuit board traces in background -->
  <g stroke="#1a6b45" stroke-width="2" fill="none" opacity="0.5">
    <!-- Horizontal traces -->
    <path d="M80,140 H180 L200,160 H280"/>
    <path d="M80,200 H140 L160,180 H220"/>
    <path d="M290,340 H380 L400,360 H432"/>
    <path d="M80,360 H140 L160,340 H200"/>
    <path d="M320,160 H400 L420,180 H432"/>
    <path d="M80,300 H120"/>
    <path d="M400,280 H432"/>
    <!-- Vertical traces -->
    <path d="M120,80 V140 L140,160 V200"/>
    <path d="M380,80 V120 L360,140 V180"/>
    <path d="M400,320 V380 L380,400 V432"/>
    <path d="M120,380 V432"/>
    <path d="M180,80 V110"/>
    <path d="M340,400 V432"/>
  </g>

  <!-- Circuit dots in background -->
  <g fill="#1a6b45" opacity="0.6">
    <circle cx="80" cy="140" r="4"/>
    <circle cx="280" cy="160" r="4"/>
    <circle cx="80" cy="200" r="4"/>
    <circle cx="220" cy="180" r="4"/>
    <circle cx="432" cy="360" r="4"/>
    <circle cx="200" cy="340" r="4"/>
    <circle cx="432" cy="180" r="4"/>
    <circle cx="80" cy="300" r="4"/>
    <circle cx="432" cy="280" r="4"/>
    <circle cx="120" cy="80" r="4"/>
    <circle cx="140" cy="200" r="4"/>
    <circle cx="380" cy="80" r="4"/>
    <circle cx="360" cy="180" r="4"/>
    <circle cx="380" cy="432" r="4"/>
    <circle cx="120" cy="432" r="4"/>
    <circle cx="180" cy="80" r="4"/>
    <circle cx="340" cy="432" r="4"/>
    <circle cx="80" cy="360" r="4"/>
    <circle cx="120" cy="380" r="4"/>
  </g>

  <!-- Main Leaf shape -->
  <g filter="url(#shadow)">
    <path d="
      M256,88
      C256,88 310,130 345,175
      C380,220 405,280 405,340
      C405,380 380,410 340,420
      C310,428 275,415 256,400
      C237,415 202,428 172,420
      C132,410 107,380 107,340
      C107,280 132,220 167,175
      C202,130 256,88 256,88
      Z
    " fill="url(#leafGrad)" stroke="#15803d" stroke-width="1"/>
  </g>

  <!-- Leaf center vein -->
  <g filter="url(#glow)">
    <path d="M256,115 V395" stroke="url(#glowGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>

  <!-- Circuit veins on left side of leaf -->
  <g stroke="#86efac" stroke-width="2" fill="none" filter="url(#glow)" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left branches -->
    <path d="M256,160 L200,195 L175,195"/>
    <path d="M256,210 L195,250 L165,250"/>
    <path d="M256,255 L190,295 L155,295"/>
    <path d="M256,300 L200,335 L170,335"/>
    <path d="M256,340 L215,365 L190,365"/>

    <!-- Right branches -->
    <path d="M256,160 L312,195 L337,195"/>
    <path d="M256,210 L317,250 L347,250"/>
    <path d="M256,255 L322,295 L357,295"/>
    <path d="M256,300 L312,335 L342,335"/>
    <path d="M256,340 L297,365 L322,365"/>

    <!-- Sub-branches left -->
    <path d="M200,195 L190,175"/>
    <path d="M195,250 L180,232"/>
    <path d="M190,295 L172,278"/>
    <path d="M200,335 L185,320"/>

    <!-- Sub-branches right -->
    <path d="M312,195 L322,175"/>
    <path d="M317,250 L332,232"/>
    <path d="M322,295 L340,278"/>
    <path d="M312,335 L327,320"/>
  </g>

  <!-- Glowing circuit dots on leaf -->
  <g fill="#86efac" filter="url(#dotGlow)">
    <!-- Center vein dots -->
    <circle cx="256" cy="130" r="4"/>
    <circle cx="256" cy="185" r="3.5"/>
    <circle cx="256" cy="235" r="3.5"/>
    <circle cx="256" cy="280" r="3.5"/>
    <circle cx="256" cy="320" r="3.5"/>
    <circle cx="256" cy="365" r="4"/>

    <!-- Left junction dots -->
    <circle cx="175" cy="195" r="3.5"/>
    <circle cx="165" cy="250" r="3.5"/>
    <circle cx="155" cy="295" r="3.5"/>
    <circle cx="170" cy="335" r="3.5"/>
    <circle cx="190" cy="365" r="3.5"/>
    <circle cx="190" cy="175" r="3"/>
    <circle cx="180" cy="232" r="3"/>
    <circle cx="172" cy="278" r="3"/>
    <circle cx="185" cy="320" r="3"/>

    <!-- Right junction dots -->
    <circle cx="337" cy="195" r="3.5"/>
    <circle cx="347" cy="250" r="3.5"/>
    <circle cx="357" cy="295" r="3.5"/>
    <circle cx="342" cy="335" r="3.5"/>
    <circle cx="322" cy="365" r="3.5"/>
    <circle cx="322" cy="175" r="3"/>
    <circle cx="332" cy="232" r="3"/>
    <circle cx="340" cy="278" r="3"/>
    <circle cx="327" cy="320" r="3"/>
  </g>

  <!-- Bright highlight at leaf tip -->
  <circle cx="256" cy="105" r="6" fill="#bbf7d0" filter="url(#dotGlow)" opacity="0.9"/>
</svg>
`;

async function generateAllIcons() {
    const svgBuffer = Buffer.from(svgLogo);

    // Generate main logo
    await sharp(svgBuffer)
        .resize(512, 512)
        .png({ quality: 100 })
        .toFile(join(publicDir, 'logo.png'));
    console.log('Created logo.png (512x512)');

    // Header logo
    await sharp(svgBuffer)
        .resize(80, 80)
        .png({ quality: 100 })
        .toFile(join(publicDir, 'header-logo.png'));
    console.log('Created header-logo.png (80x80)');

    // Favicon
    await sharp(svgBuffer)
        .resize(32, 32)
        .png({ quality: 100 })
        .toFile(join(publicDir, 'favicon.png'));
    console.log('Created favicon.png');

    // Apple touch icon
    await sharp(svgBuffer)
        .resize(180, 180)
        .png({ quality: 100 })
        .toFile(join(publicDir, 'apple-touch-icon.png'));
    console.log('Created apple-touch-icon.png');

    // PWA icons
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    for (const size of sizes) {
        await sharp(svgBuffer)
            .resize(size, size)
            .png({ quality: 100 })
            .toFile(join(iconsDir, `icon-${size}x${size}.png`));
        console.log(`Created icon-${size}x${size}.png`);
    }

    // Maskable icon with padding
    const maskableSize = 192;
    const padding = Math.round(maskableSize * 0.1);
    const innerSize = maskableSize - (padding * 2);

    await sharp(svgBuffer)
        .resize(innerSize, innerSize)
        .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 10, g: 61, b: 42, alpha: 255 }
        })
        .png({ quality: 100 })
        .toFile(join(iconsDir, `icon-${maskableSize}x${maskableSize}-maskable.png`));
    console.log('Created maskable icon');

    console.log('\n✅ All icons generated successfully!');
}

generateAllIcons().catch(console.error);
