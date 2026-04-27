import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const SAVE_DIR = './public/assets/images/extracted';
// Correct URL for the Kaaba image (ID: 6Aa4EeZTdqw)
const KAABA_URL = 'https://images.unsplash.com/photo-1542668595-fa9394e5b686?q=80&w=1200';

async function downloadCorrectHajjImage() {
  try {
    console.log("Downloading the correct Kaaba image...");
    const res = await fetch(KAABA_URL);
    if (!res.ok) throw new Error('Download failed');
    
    // We update both filenames just in case they are used in different places
    const targetFiles = ['tour-hajj.jpg', 'hero-slider-2.jpg'];
    
    const buffer = await res.arrayBuffer();
    
    for (const file of targetFiles) {
      fs.writeFileSync(path.join(SAVE_DIR, file), Buffer.from(buffer));
      console.log(`✅ Updated: ${file}`);
    }
  } catch (e) {
    console.error("Error downloading:", e.message);
  }
}

downloadCorrectHajjImage();
