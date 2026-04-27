import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const SAVE_DIR = './public/assets/images/extracted';

const fixMapping = [
  { url: 'https://images.unsplash.com/photo-1598535177141-86f3630f9a2e?w=800&q=80', name: 'tour-baghdad.jpg' },
  { url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=800&q=80', name: 'tour-malaysia.jpg' }, // Trying again with alternate
  { url: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8a?w=800&q=80', name: 'baghdad-gallery-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1561909650-6a7e7bb35b62?w=800&q=80', name: 'singapore-gallery-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&q=80', name: 'malaysia-gallery-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1541295613-a8a9e83e6ad0?w=800&q=80', name: 'malaysia-gallery-2.jpg' }
];

// If download still fails, I will use a very safe fallback image that is already downloaded
const fallbackUrl = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';

async function download(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Not found');
    await pipeline(res.body, fs.createWriteStream(path.join(SAVE_DIR, filename)));
    console.log(`Fixed: ${filename}`);
  } catch {
    console.log(`Using fallback for: ${filename}`);
    const res = await fetch(fallbackUrl);
    await pipeline(res.body, fs.createWriteStream(path.join(SAVE_DIR, filename)));
  }
}

async function run() {
  for (const item of fixMapping) await download(item.url, item.name);
}
run();
