import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const SAVE_DIR = './public/assets/images/extracted';

const mapping = [
  { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=85', name: 'hero-slider-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=85', name: 'hero-slider-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1920&q=85', name: 'hero-slider-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80', name: 'blog-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', name: 'contact-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80', name: 'destinations-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', name: 'tour-dubai.jpg' },
  { url: 'https://images.unsplash.com/photo-1548783300-88f4a5f94fa2?w=800&q=80', name: 'tour-baghdad.jpg' },
  { url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80', name: 'tour-singapore.jpg' },
  { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', name: 'tour-london.jpg' },
  { url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=800&q=80', name: 'tour-malaysia.jpg' },
  { url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', name: 'tour-istanbul.jpg' },
  { url: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800&q=80', name: 'tour-hajj.jpg' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', name: 'umrah-gallery-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=800&q=80', name: 'umrah-gallery-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1577086664693-894d8405334a?w=800&q=80', name: 'baghdad-gallery-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8a?w=800&q=80', name: 'baghdad-gallery-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800&q=80', name: 'singapore-gallery-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1561909650-6a7e7bb35b62?w=800&q=80', name: 'singapore-gallery-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', name: 'paris-gallery-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&q=80', name: 'paris-gallery-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', name: 'london-gallery-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&q=80', name: 'london-gallery-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1602413560783-1c27cbbb7cdd?w=800&q=80', name: 'malaysia-gallery-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1541295613-a8a9e83e6ad0?w=800&q=80', name: 'malaysia-gallery-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80', name: 'istanbul-gallery-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=800&q=80', name: 'istanbul-gallery-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80', name: 'dubai-gallery-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80', name: 'dubai-gallery-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&q=80', name: 'switzerland-gallery-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', name: 'avatar-ahmed.jpg' },
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', name: 'avatar-fatima.jpg' },
  { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', name: 'avatar-khalid.jpg' },
  { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', name: 'avatar-sara.jpg' },
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', name: 'avatar-ibrahim.jpg' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', name: 'avatar-aisha.jpg' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', name: 'switzerland-main.jpg' }
];

async function downloadImage(url, filename) {
  try {
    console.log(`Downloading ${filename}...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

    const filePath = path.join(SAVE_DIR, filename);
    const fileStream = fs.createWriteStream(filePath);
    await pipeline(response.body, fileStream);
    console.log(`Successfully saved to ${filePath}`);
  } catch (error) {
    console.error(`Error downloading ${filename}:`, error.message);
  }
}

async function run() {
  if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true });
  for (const item of mapping) {
    await downloadImage(item.url, item.name);
    await new Promise(r => setTimeout(r, 100)); // Be gentle
  }
  console.log('All downloads completed!');
}

run();
