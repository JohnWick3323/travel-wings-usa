TRAVEL WINGS HEADLESS — INSTALLATION GUIDE
==========================================

REQUIREMENTS
------------
- WordPress 6.0+
- ACF (Advanced Custom Fields) FREE plugin — install from WP plugin directory

INSTALLATION STEPS
------------------
1. WordPress install karo Hostinger pe (subdomain: cms.travelwingsusa.com)

2. WP Admin → Plugins → Add New → "Advanced Custom Fields" search karo → Install & Activate

3. Ye folder (travel-wings-headless) upload karo:
   wp-content/plugins/travel-wings-headless/

4. WP Admin → Plugins → "Travel Wings Headless" → Activate

5. Done. Ye sab automatically ho jata hai:
   ✓ Tours custom post type registered
   ✓ ACF fields attached (destination, region, category, duration, rating,
     hero_image, gallery, highlights, itinerary, inclusions, exclusions, faqs, tags)
   ✓ REST API enabled: https://cms.travelwingsusa.com/wp-json/wp/v2/tours
   ✓ Blog REST API: https://cms.travelwingsusa.com/wp-json/wp/v2/posts
   ✓ CORS configured for Astro frontend

REST API ENDPOINTS
------------------
All Tours:
  GET /wp-json/wp/v2/tours?_embed&per_page=100

Single Tour by slug:
  GET /wp-json/wp/v2/tours?slug=umrah-package-2025&_embed

All Blog Posts:
  GET /wp-json/wp/v2/posts?_embed&per_page=100

Single Post by slug:
  GET /wp-json/wp/v2/posts?slug=how-to-prepare-for-umrah-2025&_embed

RESPONSE STRUCTURE (Tours)
--------------------------
{
  "id": 1,
  "slug": "umrah-package-2025",
  "title": { "rendered": "Umrah Package 2025" },
  "excerpt": { "rendered": "..." },
  "acf": {
    "destination": "Makkah & Madinah",
    "region": "Saudi Arabia",
    "category": "umrah",
    "duration": "10 Days 9 Nights",
    "duration_days": 10,
    "rating": 5,
    "group_size": "Up to 40 pilgrims",
    "hero_image": { "url": "...", "alt": "..." },
    "gallery": [ { "url": "...", "alt": "..." }, ... ],
    "highlights": [ { "item": "Visa processing assistance" }, ... ],
    "itinerary": [
      { "day": 1, "title": "Departure from USA", "activities": ["Check-in at airport", ...] },
      ...
    ],
    "inclusions": [ { "item": "Round-trip international flights" }, ... ],
    "exclusions": [ { "item": "Personal expenses" }, ... ],
    "faqs": [ { "question": "...", "answer": "..." }, ... ],
    "tags": ["spiritual", "religious", "saudi-arabia"]
  }
}

CORS ORIGINS (update in plugin if domain changes)
-------------------------------------------------
- https://travelwingsusa.com
- https://www.travelwingsusa.com
- http://localhost:4321 (Astro dev)
