#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Icon sizes to generate
const sizes = [192, 512];
const iconsDir = path.join(__dirname, '../public/icons');

console.log('🎨 Converting SVG icons to PNG...\n');

// Read SVG files
const svgFiles = {
  ['icon-192x192.svg']: 192,
  ['icon-512x512.svg']: 512,
};

async function convertSVGtoPNG() {
  try {
    // Check if sharp is installed
    let sharp;
    try {
      sharp = require('sharp');
    } catch (err) {
      console.log('📦 Installing sharp package...');
      const { execSync } = require('child_process');
      execSync('npm install sharp', { stdio: 'inherit' });
      sharp = require('sharp');
    }

    for (const [filename, size] of Object.entries(svgFiles)) {
      const svgPath = path.join(iconsDir, filename);
      const pngFilename = filename.replace('.svg', '.png');
      const pngPath = path.join(iconsDir, pngFilename);

      if (!fs.existsSync(svgPath)) {
        console.log(`⚠️  ${filename} not found, skipping...`);
        continue;
      }

      console.log(`Converting ${filename} (${size}x${size}) to PNG...`);
      
      await sharp(svgPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 26, g: 26, b: 46, alpha: 1 } // #1a1a2e
        })
        .png()
        .toFile(pngPath);

      console.log(`✅ Created ${pngFilename}\n`);
    }

    console.log('✨ All icons converted successfully!');
    console.log('\n📋 PNG files created:');
    console.log('  - icon-192x192.png');
    console.log('  - icon-512x512.png');
    console.log('\n✏️  Update your manifest.json to include these PNG files.');

  } catch (error) {
    console.error('❌ Error converting SVGs:', error.message);
    process.exit(1);
  }
}

convertSVGtoPNG();
