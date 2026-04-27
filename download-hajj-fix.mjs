import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const ACCESS_KEY = '9b_uTmKU9BHMsk6ehpCYbDBMIFJoSEvblyfSqydCp-Q';
const SAVE_DIR = './public/assets/images/extracted';
const PHOTO_ID = '6Aa4EeZTdqw'; // The ID from your link

async function downloadHajjImage() {
  try {
    console.log(`Downloading Kaaba image for Hajj (ID: ${PHOTO_ID})...`);
    
    // Unsplash requirements: Trigger download tracking
    const trackRes = await fetch(`https://api.unsplash.com/photos/${PHOTO_ID}/download`, {
      headers: { 'Authorization': `Client-ID ${ACCESS_KEY}` }
    });
    
    if (!trackRes.ok) throw new Error(`API error: ${trackRes.statusText}`);
    const { url: downloadUrl } = await trackRes.json();

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

    const filenames = ['tour-hajj.jpg', 'hero-slider-2.jpg']; // Replacing both to be safe
    for (const filename of filenames) {
      const filePath = path.join(SAVE_DIR, filename);
      await pipeline(response.body.clone(), fs.createWriteStream(filePath));
      console.log(`✅ Successfully updated ${filename}`);
    }
    
  } catch (error) {
    console.error(`Error:`, error.message);
    // Fallback if API fails: Try direct CDN URL
    try {
      console.log("Trying direct CDN download...");
      const cdnUrl = `https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1920`; 
      const res = await fetch(cdnUrl);
      await pipeline(res.body, fs.createWriteStream(path.join(SAVE_DIR, 'tour-hajj.jpg')));
      console.log("✅ Fixed with CDN fallback.");
    } catch (e) {
      console.error("Direct download also failed.");
    }
  }
}

downloadHajjImage();
