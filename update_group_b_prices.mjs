import { readFileSync, writeFileSync } from 'fs';

const pricesPath = '/Users/stevenkuo/self-improving/apartment_prices.json';
const prices = JSON.parse(readFileSync(pricesPath, 'utf8'));
const today = '2026-04-12';

// Groton Towers updates
prices['groton-towers'] = {
  "Studio (New Haven)": { "price": 1600, "date": today, "range": "$1,600-$1,775", "available": 5, "prev": 1600, "note": "Live Playwright (April 12): Stable at $1,600-$1,775/mo (5 avail)." },
  "1BR (Fairfield)": { "price": 1845, "date": today, "range": "$1,845-$1,890", "available": 2, "prev": 1825, "note": "Live Playwright (April 12): Low increased $20 from $1,825 to $1,845. Availability dropped from 4 to 2 units." },
  "1BR (Stonington)": { "price": null, "date": today, "note": "Call for details per Playwright (April 12, 2026)." },
  "1BR (Mystic)": { "price": null, "date": today, "note": "Call for details per Playwright (April 12, 2026)." },
  "2BR (Providence)": { "price": 2262, "date": today, "range": "$2,262-$2,322", "available": 3, "prev": 2262, "note": "Live Playwright (April 12): Stable at $2,262-$2,322/mo (3 avail)." },
  "2BR (Boston)": { "price": 2058, "date": today, "range": "$2,058-$2,059", "available": 2, "prev": 2059, "note": "Live Playwright (April 12): High decreased $40 from $2,099 to $2,059/mo. Now flat $2,058-$2,059 range." },
  "site_status": "ONLINE - confirmed accessible via Playwright (April 12)"
};

// The Ambrose — direct site confirmed $1,945 (aggregator $2,195 was stale)
prices['the-ambrose'] = {
  "1BR/1BA 724sqft": { "price": 1945, "date": today, "prev": 1945, "note": "Direct site (Playwright, April 12) confirms 1BR at $1,945/mo — site was accessible, aggregator's $2,195 from Apr 10 was incorrect/stale. Direct site shows $1,945/mo, not $2,195.", "prev_note": "Apr 10: aggregator showed $2,195 but direct site was down; Apr 12 confirmed $1,945 direct." },
  "2BR/1BA 830sqft": { "price": 2245, "date": today, "note": "Stable at $2,245/mo per direct site (April 12, 2026)." },
  "site_status": "ONLINE - direct site confirmed accessible via Playwright (April 12)"
};

// Groton Townhomes — stable
prices['groton-townhomes'] = {
  "1BR/1BA 750sqft": { "price": 1875, "date": today, "prev": 1875, "available": 2, "available_date": "06/01/2026", "note": "Stable at $1,875/mo per direct site (April 12, 2026). 2 units available." },
  "2BR/1BA 821sqft": { "price": 2050, "date": today, "prev": 2050, "available": 2, "available_date": "06/15/2026", "note": "Stable at $2,050/mo per direct site (April 12, 2026). 2 units available." },
  "availability_note": "2 units available per direct site (April 12, 2026)",
  "last_updated": today,
  "site_status": "ONLINE - direct site confirmed accessible via Playwright (April 12)"
};

// Reid Hughes — unchanged (still "Please Call")
prices['reid-hughes'] = {
  "1BR": { "price": null, "date": today, "note": "Pricing still unpublished on direct site (RealPage JS). Playwright confirms reidhughes.com still shows Please Call for all units (April 12, 2026). Aggregator sites still show starting $1,475/mo.", "status": "call_for_pricing_direct_aggregators_published" },
  "2BR": { "price": null, "date": today, "note": "Pricing still unpublished on direct site (RealPage JS). Same as 1BR.", "status": "call_for_pricing_direct_aggregators_published" },
  "last_updated": today,
  "site_status": "direct site accessible but no pricing published — RealPage JS still showing Please Call (April 12)"
};

// Meadow Ridge — stable
prices['meadow-ridge'] = {
  "1BR/1BA 900sqft": { "price": 1130, "date": today, "range": "$1,130-$1,190", "available": true, "note": "Stable at $1,130-$1,190/mo per Playwright (April 12, 2026)." },
  "2BR/2BA 1100sqft": { "price": 1285, "date": today, "range": "$1,285-$1,395", "available": true, "note": "Stable at $1,285-$1,395/mo per Playwright (April 12, 2026)." },
  "last_updated": today,
  "site_status": "ONLINE - meadowridgenorwich.com/floorplans confirmed accessible via Playwright (April 12)",
  "note": "Site floor plans page is accessible again — RentCafe platform confirmed working (April 12)."
};

// Hedgewood — no change from Apr 4 data (site unchanged)
if (!prices['hedgewood']) prices['hedgewood'] = {};
prices['hedgewood']['last_updated'] = today;
prices['hedgewood']['site_status'] = "Aggregator-only — miradorliving.com confirmed as senior living advisor, not the property itself. Prices stable at 1BR $1,025/mo, 2BR $1,325/mo per Zillow (April 4, 2026). No new direct site available.";

writeFileSync(pricesPath, JSON.stringify(prices, null, 2));
console.log('Prices updated successfully');
