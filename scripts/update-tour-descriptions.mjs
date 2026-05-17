/**
 * Update tour descriptions (content field) in WordPress
 * node scripts/update-tour-descriptions.mjs
 */

const WP_URL = 'https://backend.travelwingsusa.com/wp-json/wp/v2';
const WP_USER = 'hamidshah';
const WP_APP_PASSWORD = 'oEZG HRm3 yuiS IWFj 0mVn W0hG';
const AUTH = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');

const descriptions = [
  {
    id: 7, // umrah-package-2025 (existing)
    content: 'Experience the spiritual journey of a lifetime with our comprehensive Umrah package departing from the USA. Our expert team handles everything from visa processing to 5-star hotels steps from Masjid Al-Haram. Whether you are performing Umrah for the first time or returning for another blessed journey, Travel Wings USA ensures a seamless, spiritually enriching experience. Our packages include guided Umrah rituals by experienced Islamic scholars, Ziyarat tours in both Makkah and Madinah, and dedicated support throughout your pilgrimage.',
    excerpt: 'Complete Umrah package from USA with visa, 5-star hotels near Masjid Al-Haram, guided rituals, and Ziyarat tours in Makkah & Madinah.',
  },
  {
    id: 16, // umrah-package-2025-economy
    content: 'Affordable Umrah package from the USA designed for pilgrims seeking a complete spiritual experience without compromising on essentials. Travel Wings USA handles your Umrah visa, round-trip flights, and comfortable 4-star hotel accommodation near Masjid Al-Haram. Our experienced Islamic scholar guides you through every step of the Umrah rituals — from donning the Ihram to completing Tawaf and Sa\'i. Ziyarat tours in both Makkah and Madinah are included, covering the most significant historical and religious sites. Available as group or private packages.',
    excerpt: 'Affordable Umrah package from USA with visa, flights, 4-star hotels near Haram, guided rituals, and Ziyarat tours. Group and private options available.',
  },
  {
    id: 17, // umrah-package-2025-premium
    content: 'Elevate your Umrah journey with our luxury 5-star package, designed for pilgrims who seek the finest spiritual experience. Stay in premium hotels with direct Haram views, just steps from Masjid Al-Haram. Your dedicated private Umrah guide — an experienced Islamic scholar — accompanies you through every ritual, ensuring a deeply meaningful pilgrimage. VIP Ziyarat tours with private transportation cover all significant sites in Makkah and Madinah. Rawdah visit arrangements, 24/7 group coordinator, and business class flight upgrades are available. Limited to 20 pilgrims per group for an intimate, personalized experience.',
    excerpt: 'Luxury 5-star Umrah package with Haram-view hotels, private scholar guide, VIP Ziyarat tours, Rawdah arrangement, and business class upgrade option.',
  },
  {
    id: 18, // hajj-package-2025-standard
    content: 'Fulfill the fifth pillar of Islam with Travel Wings USA\'s professionally managed Hajj package. We take care of all logistics — from Hajj visa processing and flights to Mina tent accommodation and guided rituals — so you can focus entirely on your spiritual journey. Our experienced Hajj scholar guides your group through all five days of Hajj, from the Day of Arafah to the Rami of Jamarat and Tawaf Al-Ifadah. A medical professional accompanies each group throughout the pilgrimage. Limited spaces ensure a quality, personalized Hajj experience. Contact us early as Hajj spots fill up months in advance.',
    excerpt: 'Complete Hajj package from USA covering all 5 days of Hajj rituals, Mina tent, experienced scholar guide, medical support, and full logistics.',
  },
  {
    id: 19, // baghdad-city-package
    content: 'Discover the ancient city of Baghdad with Travel Wings USA\'s curated 4-day tour. Walk the historic Al-Mutanabbi Street, once the heart of Arab intellectual life, and explore the National Museum of Iraq housing thousands of years of Mesopotamian history. Cruise the legendary Tigris River, visit the Abbasid Palace, and experience authentic Iraqi cuisine at local restaurants. Our experienced local guides ensure a safe, enriching cultural experience. Travel Wings USA continuously monitors conditions and only operates tours when safety is confirmed, using trusted local partners with years of experience.',
    excerpt: 'Discover ancient Baghdad — Al-Mutanabbi Street, National Museum of Iraq, Tigris River cruise, and authentic Iraqi cuisine with experienced local guides.',
  },
  {
    id: 20, // uae-dubai-package
    content: 'Dubai is a city like no other — where ancient traditions meet futuristic ambition. Travel Wings USA\'s 4-day Dubai package takes you to the top of the world\'s tallest building, the Burj Khalifa, for breathtaking views of the city skyline. Experience the magic of the Dubai Fountain show, explore the historic Dubai Creek and Gold Souk, and venture into the Arabian desert for an unforgettable safari with a traditional BBQ dinner under the stars. Dubai is one of the world\'s most halal-friendly destinations, with abundant halal dining options throughout the city. Perfect for families, couples, and solo travelers.',
    excerpt: 'Discover Dubai — Burj Khalifa, desert safari, Palm Jumeirah, Gold Souk, and dhow cruise. Halal-friendly with 5-star accommodation.',
  },
  {
    id: 21, // turkey-package
    content: 'Turkey is a land where East meets West, where ancient history and modern culture blend seamlessly. Travel Wings USA\'s 6-day Turkey package takes you through Istanbul\'s magnificent Hagia Sophia, the Blue Mosque, and the Grand Bazaar before flying to the otherworldly landscapes of Cappadocia. Wake up at sunrise for a magical hot air balloon ride over the fairy chimneys and volcanic valleys. Explore underground cities carved thousands of years ago, hike through the Rose Valley, and stay in a traditional cave hotel. Turkey is a Muslim-majority country with excellent halal food options throughout.',
    excerpt: 'Explore Istanbul\'s Hagia Sophia, Grand Bazaar, and Bosphorus, then fly to Cappadocia for hot air balloon rides and underground cities.',
  },
  {
    id: 22, // paris-getaway-package
    content: 'Paris — the City of Light — is one of the world\'s most romantic and culturally rich destinations. Travel Wings USA\'s 5-day Paris package takes you to the iconic Eiffel Tower, the world\'s greatest art museum at the Louvre, and on a scenic Seine River cruise past Notre-Dame Cathedral. A full day trip to the Palace of Versailles reveals the grandeur of French royal history. Explore the bohemian streets of Montmartre, visit the stunning Sacre-Coeur Basilica, and experience authentic French cuisine. Paris is easily accessible for US travelers with no visa required for stays under 90 days.',
    excerpt: 'Experience Paris — Eiffel Tower, Louvre Museum, Seine River cruise, Palace of Versailles day trip, and Montmartre. No visa required for US citizens.',
  },
  {
    id: 23, // london-package-7-nights
    content: 'London is a city of extraordinary history, culture, and diversity. Travel Wings USA\'s 8-day London package covers all the iconic landmarks — Buckingham Palace, the Tower of London with its Crown Jewels, Westminster Abbey, and Big Ben. A Thames River cruise offers stunning views of the city from the water. A full day trip takes you to the ancient wonder of Stonehenge and the Roman city of Bath. London has a large Muslim community with abundant halal restaurants, particularly in areas like Edgware Road and Whitechapel. US citizens require an ETA (Electronic Travel Authorization) which we assist with.',
    excerpt: 'Explore London — Buckingham Palace, Tower of London, British Museum, Thames cruise, and a day trip to Stonehenge and Bath.',
  },
  {
    id: 24, // malaysia-tour
    content: 'Malaysia is one of the world\'s most halal-friendly destinations, making it a perfect choice for Muslim travelers. Travel Wings USA\'s 5-day Malaysia package begins in Kuala Lumpur, where you\'ll visit the iconic Petronas Twin Towers, the colorful Batu Caves Hindu temple, and the KL Bird Park. Then fly to the paradise island of Langkawi for pristine beaches, island hopping tours, and a fascinating mangrove jungle boat tour. Malaysian cuisine is world-renowned, and halal food is available everywhere. US citizens can visit Malaysia visa-free for up to 90 days.',
    excerpt: 'Discover Malaysia — Petronas Twin Towers, Batu Caves, and Langkawi\'s beaches. One of the world\'s most halal-friendly destinations.',
  },
  {
    id: 25, // switzerland-tour
    content: 'Switzerland is a land of breathtaking natural beauty — snow-capped Alps, crystal-clear lakes, and charming mountain villages. Travel Wings USA\'s 6-day Switzerland package takes you through three of the country\'s most beautiful cities: Zurich, Lucerne, and Interlaken. The highlight is the Jungfraujoch excursion — the "Top of Europe" at 3,454 meters — where you\'ll stand on the Aletsch Glacier and enjoy panoramic Alpine views. A Swiss Travel Pass is included, giving you unlimited access to trains, boats, and buses throughout the country. Visit a Swiss chocolate factory and cheese dairy for a true taste of Switzerland.',
    excerpt: 'Swiss Alps adventure — Jungfraujoch Top of Europe, Lake Lucerne cruise, Interlaken, Grindelwald, and Swiss chocolate factory. Swiss Travel Pass included.',
  },
  {
    id: 26, // singapore-city-escape
    content: 'Singapore is a spectacular city-state where futuristic architecture, lush gardens, and diverse cultures come together. Travel Wings USA\'s 4-day Singapore package takes you to the stunning Gardens by the Bay with its iconic Supertree Grove light show, the observation deck of Marina Bay Sands for panoramic city views, and the adventure-packed Sentosa Island with Universal Studios. Singapore\'s hawker food culture is world-famous, and halal-certified food stalls are found throughout the city. US citizens do not require a visa for Singapore for stays up to 90 days.',
    excerpt: 'Explore Singapore — Gardens by the Bay, Marina Bay Sands, Sentosa Island, Universal Studios, and world-famous hawker food. No visa required.',
  },
];

async function updateTour(item) {
  const res = await fetch(`${WP_URL}/tours/${item.id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${AUTH}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: item.content,
      excerpt: item.excerpt,
    }),
  });

  const data = await res.json();
  if (res.ok) {
    console.log(`✅ Updated: ID ${item.id} — ${data.slug}`);
  } else {
    console.error(`❌ Failed: ID ${item.id}`, data.message || data);
  }
}

async function main() {
  console.log('🚀 Updating tour descriptions...\n');
  for (const item of descriptions) {
    await updateTour(item);
    await new Promise(r => setTimeout(r, 300));
  }
  console.log('\n✅ All descriptions updated!');
}

main().catch(console.error);
