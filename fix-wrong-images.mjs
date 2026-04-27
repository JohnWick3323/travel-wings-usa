import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const SAVE_DIR = './public/assets/images/extracted';

const criticalFixes = [
  { url: 'https://images.unsplash.com/photo-1565706482631-f187a493f350?q=80&w=800', name: 'tour-hajj.jpg' }, // Proper Kaaba image
  { url: 'https://images.unsplash.com/photo-1580674239581-3f45c7d62ec3?q=80&w=800', name: 'tour-baghdad.jpg' }, // Iraq vibe
  { url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f11?q=80&w=800', name: 'tour-malaysia.jpg' }, // Twin Towers
  { url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800', name: 'umrah-gallery-1.jpg' } // Spiritual
];

async function fix() {
  for (const item of criticalFixes) {
    try {
      console.log(`Fixing image: ${item.name}...`);
      const res = await fetch(item.url);
      if (!res.ok) throw new Error('Failed');
      await pipeline(res.body, fs.createWriteStream(path.join(SAVE_DIR, item.name)));
      console.log(`✅ Fixed: ${item.name}`);
    } catch (e) {
      console.error(`❌ Still failing for ${item.name}`);
    }
  }
}
fix();
