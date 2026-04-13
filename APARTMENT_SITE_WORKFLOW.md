# Apartment Site Update Workflow

## Site Location
`/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21/`

## Index
`index.html` — lists all properties. **Property count: 28** (as of 03/22/2026).
Groton Towers and Villages at Shore Landing were deleted (DNS dead). Update `hero__stat-number`, `h1 em`, and `city__sub` after any property change.

## Live Time Display
Index hero stats bar shows a JavaScript-driven live clock:
```html
<div class="hero__stat-number" id="live-time"></div>
<div class="hero__stat-label">Updated time:</div>
<script>
document.getElementById("live-time").textContent =
  new Date().toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"}) + " " +
  new Date().toLocaleString("en-US",{hour:"numeric",minute:"2-digit",hour12:true}).toLowerCase();
</script>
```

---

## Properties — Confirmed Live Availability Sites

Use Playwright (headless Chrome, `networkidle` or `domcontentloaded + 5s wait`) to go **directly** to the availability/floor plans URL. No homepage nav needed.

| Property | Direct URL | Notes |
|---|---|---|
| Triton Square | `https://www.tritonsquare.com/availability-map/` | JS-rendered iframe map — pricing/availability not extractable via Playwright. Check Zillow/HotPads for current units. |
| Pleasant Valley | `https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans` | G5 platform, JS-heavy. Leasing widget shows unit counts. |
| Harbor Heights (Enclave) | `https://www.hmystic.com/enclave/floor-plans-enclave` | Webflow. Floor plan names/sqft confirmed; pricing JS-rendered. |
| Harbor Heights (Beacon) | `https://www.hmystic.com/beacon/floor-plans-beacon` | Same as above. |
| Waterford Woods | `https://www.waterfordwoods.com/availability` | Wix JS-heavy. Contact: Waterfordwoodsapt@gmail.com / 860-772-2253. |
| Groton Estates | `https://grotonestates.com/floor-plans/` | ⚠️ Serves Kelson Row (Rocky Hill CT) content — floor plans may not be Groton data. Verify pricing via Trulia/Apartments.com. |
| **The Ledges** | `https://www.theledgesapartments.com/floorplans` | 12 units available (ApartmentList). 1BR from $2,052/mo, 2BR from $2,797/mo. Spring special: 1 month free (apply by 3/31). Cloudflare on homepage but floor plans URL is accessible. |
| Chester Place | `https://www.b7properties.com/chester-place` | Live. $500 OFF move-in special (12-mo lease). No security deposit. $99/mo community fee. Pet-friendly. ~$1,845/mo. |
| Emerson Place | `https://www.b7properties.com/emerson` | Live. 1BR from $1,875, 2BR $2,295. Community fee $99/mo covers heat/hot water/gas/WiFi/trash/insurance. Pet fee $250 reg + $40/mo dog. |
| Gull Harbor | `https://gullharborct.com/floorplans` | Live (was 404 at old URL). 1BR/1BA up to 600 sqft, ~$1,695/mo. Pet-friendly. 83 Mansfield Rd, New London. |
| Eagle Pointe | `https://www.eaglepointeapts.com/floorplans` | Live. |
| Meadow Ridge | `https://www.meadowridgenorwich.com/floorplans` | JS-rendered. 1BR $1,130–$1,190/mo, 2BR $1,285–$1,395/mo. Managed by Geller Properties. |

## Properties — Managed by Baystate Investment Fund (live sites, JS-rendered)

| Property | Contact | Notes |
|---|---|---|
| Blackstone Apartments | Via Baystate: 206 Washington St, Norwich | 1BR $1,295–$1,595/mo. Available now. |
| Courtview Square | Via Baystate: 309 Crystal Ave, New London | 1BR $1,475/mo. 2 units available. courtviewct.com |

## Properties — Aggregator-Only (no official site, or site blocked)

For these, use **Tavily Search** primary, then verify with Playwright or aggregators.

| Property | Status | Action |
|---|---|---|
| Groton Towers | **Live at grotonapartmenthomes.com** (NOT groton-towers.com which is DNS dead) | JS-rendered portal. October 2025 fire (1 death, ~75 families displaced). New management: South Oxford. ~19 units on CorporateHousing. |
| Groton Townhomes | grotontownhouses.com live | **2 units available** (was 0). 1BR $2,050/mo, 2BR $2,195/mo. Phones updated: leasing (860) 445-7307, office (475) 303-7313. |
| The Ambrose | b7properties.com/ambrose live | 1BR $1,895, 2BR $2,195. $99 community fee. 1 unit on Zillow. 12 Kamaha St, Groton. |
| La Triumphe | latriumpheapartments.com — Cloudflare blocks | Floor plans via Apartments.com. 3BR/2BA 1,650sqft ~$2,470/mo. 300 Michelle Lane, Groton. Cats $35/mo. |
| Reid Hughes | reidhughes.com live (RealPage JS) | $100 increase effective Feb 13, 2026. Now $1,450–$1,875/mo. 8 units on Zillow. 201 Main St, Norwich. |
| Hedgewood | **New: miradorliving.com** (was no site) | Independent Living. 1BR $1,025/mo (2 units), 2BR $1,325/mo (2 units). Managed by Carabetta. |
| ReNew Groton | renewliving.com/groton **parked** | Alternative: Tavily/Apartments.com. 2 units available $1,799–$3,139/mo. 26 Bishop Ln, Groton (corrected address). |
| ReNew Washington Park | renewliving.com/washingtonpark **parked** | Alternative: Tavily/Apartments.com. 14 units available $1,489–$2,379/mo. |
| The Tides | tidesapts.com redirects to Richmond CA | CT property offline. 88 Tides Dr, Groton — call (860) 574-6108. |

## Defunct Properties — Remove or Keep as Stale?

| Property | Status | Action |
|---|---|---|
| Groton Towers | ~~groton-towers.com~~ DNS dead | Page deleted. grotonapartmenthomes.com is new site. |
| Villages at Shore Landing | DNS dead | Page deleted. |
| Chester Place | ~~chesterplaceapts.com~~ DNS dead | Page updated — now on b7properties.com/chester-place |
| Emerson Place | ~~emersonplacegroton.com~~ DNS dead | Page updated — now on b7properties.com/emerson |
| 2350 Gold Star Hwy | Active as "Colonial Efficiency", Mystic | Keep page, update name and pricing. 1BR $2,282+, 2BR $3,034+. 1 month free specials. |
| 30 Nichols Ln | Active individual listing, Waterford | Keep. 1BR $1,400/mo. Remodeled 2026. Owner: lawn/snow included. |
| 482 W Main St, Norwich | Active listing | Keep. $1,400/mo, 756 sqft, 1BR. |
| 120 Broad St, New London | ⚠️ **Conflicting data** | Keep with warning note. HotPads removed 3/21/26; Trulia still shows 6 units available. |
| 302 Boston Post Rd | ⚠️ SmartMLS suggests may be off-market | Keep with warning note. Verify before visiting. |
| Village Court | Confirmed defunct | Page deleted. No active property at Groton address. |
| Crocker House | Active, New London | Keep. 35 Union St. W&M Management. 81 units. |
| Courtview Square | Active, New London | Keep. 309 Crystal Ave. Baystate Investment Fund. |

---

## Update Checklist

### 1. Check for news-worthy updates first
Before scraping anything, check if any property has new newsworthy developments:
- New management or ownership changes
- Major incidents (fires, floods, closures)
- Pricing changes of $100+
- Availability changes (0 units → units available, or vice versa)
- Special offers (move-in specials, months free)
- Address corrections
- New listings added to the site
- Off-market / conflicting data flags
If found, add or update the **`<div class="news-card">`** section on the relevant property page.
**Maximum 5 news items per page.** When adding a new item, if the page already has 5 news cards, remove the oldest one (the last news-card, closest to the contact section) before adding the new item. News cards are ordered newest → oldest, with the newest closest to the hero section.

The card HTML format:
```html
<div class="news-card">
<h2>📰 [Headline]</h2>
<p class="news-date">[Month Year]</p>
<p class="news-body">[Description with date of occurrence and context.]</p>
</div>
```
And the CSS (if not already present):
```css
.news-card{background:#fef3c7;border:1px solid #f59e0b;border-radius:12px;padding:16px 20px;margin-bottom:18px}
.news-card h2{margin:0 0 4px;font-size:15px;color:#92400e;border-bottom:none;padding-bottom:0}
.news-date{font-size:12px;color:#92400e;font-weight:600;margin-bottom:6px}
.news-body{font-size:14px;color:#78350f;margin:0}
```
Insert the news card after the hero `</div>` and before the first `<div class="card">` (Contact section).

### 2. Price tracking (run before scraping)

Load the previous prices from `price_history.json` in the workspace. Compare the newly scraped prices against stored prices to determine what changed.

**Price history file** (`~/self-improving/apartment_prices.json`):
```json
{
  "groton-towers": {
    "Studio": { "price": 1425, "date": "2026-03-23" },
    "1BR/1BA Standard": { "price": 1675, "date": "2026-03-23" }
  }
}
```

After scraping completes and before writing HTML, compute the diff:
- Same room type, price **increased** → red ↑ arrow
- Same room type, price **decreased** → green ↓ arrow
- Room type **newly appeared** (not in last run) → "NEW" badge
- Room type **disappeared** (was in last run, gone now) → remove from page

Write the updated prices back to `price_history.json` after each run.

**Arrow CSS** (add to each page's `<style>` if not present):
```css
.price-up{color:#dc2626;font-size:13px;margin-left:4px}
.price-down{color:#16a34a;font-size:13px;margin-left:4px}
.price-new{font-size:11px;color:#fff;background:#2563eb;padding:2px 6px;border-radius:6px;margin-left:6px;vertical-align:middle}
```

**Arrow HTML output**:
- Price up: `$1,895/mo<span class="price-up">↑</span>`
- Price down: `$1,895/mo<span class="price-down">↓</span>`
- New room: `$1,895/mo<span class="price-new">NEW</span>`

After applying arrows/badges to all figure-cards, save the new prices to `price_history.json`.

### 3. Check live-availability properties (Playwright)
- Go directly to the availability URL (no homepage nav needed)
- Use `networkidle` or `domcontentloaded + 5s wait`
- Extract: floor plan names, sqft, pricing, unit counts, amenities, pet policy, parking, lease terms

### 4. Check aggregator-only/blocked properties (Tavily + aggregators)
- Tavily Search: `node .../search.mjs "property name apartments city state" -n 10 --depth advanced`
- Fallback: Apartments.com, Zillow, Trulia, HotPads, Apartment Finder, Rentable
- For JS-rendered sites that time out: extract what you can from aggregators and note the limitation

### 5. Update HTML pages
- **New unit type available**: add a `figure-card` inside `figure-grid`
  ```html
  <div class="figure-card">
    <div class="figure-title">Plan Name — X sqft</div>
    <div class="figure-note">$X,XXX/mo · N units available</div>
    <img width="N" height="H" style="width:Npx;max-width:100%;height:auto;flex-shrink:0;flex-grow:0;display:block;background:#f3f6fb" src="floor-plans/FILENAME.jpg">
  </div>
  ```
- **Unit count changed**: update only the `figure-note` text, not the structure
- **Unit now 0 available**: remove the entire `figure-card`
- **Entire property off-market**: delete `.html` file, remove `prop-card` from index, update city counts
- **Also update**: Pet Policy, Parking, Lease Terms, Commute & Neighborhood if data changed

### 6. Clean HTML garbage
- `if info['phone']` remnants → remove
- Malformed comments `<!-- HEADER \n<div>` (missing `-->`) → fix
- Orphaned `figure-note` divs → remove
- Stray `alt` attributes on non-img elements → remove
- Trailing `>` in `img src` attributes → fix
- Extra `</div>` wrappers → remove

### 7. Commit and push
- Review diff before committing
- Push to `main` after each run
- Update this workflow doc if new properties are added or removed

---

## Known Address Corrections
| File | Was | Should Be |
|---|---|---|
| renew-groton.html | 88 Tides Dr, New London | 26 Bishop Ln, Groton CT |
| village-court.html | Groton CT | No active property found |
| 120-broad-st.html | Groton | 120 Broad St, New London CT 06320 |
| 2350-gold-star-hwy.html | Listed as Groton | "Colonial Efficiency", Mystic CT |
| 30-nichols-ln.html | Listed as Groton | Waterford CT — individual units |
| courtview-square.html | Listed as Norwich | 309 Crystal Ave, New London CT |
| crocker-house.html | Listed as Norwich | 35 Union St, New London CT |
| reid-hughes.html | 70 Mechanics St, Norwich | 201 Main Street, Norwich CT 06360 |

---

## New Property Discovery (Twice-Weekly — Wed & Sun 10am PST)

Runs separately from the maintenance checks. Triggered by cron job `Wed/Sun New Apartment Search`.

**Scope:** Active rental apartments in Groton CT, Norwich CT, New London CT, Mystic CT, Waterford CT.

**Priority rule:** Only properties with **official websites** — not aggregator-only listings (Zillow/Apartments.com without an official site). Exception: if a significant property is aggregator-only, add with a note.

**Workflow:**
1. Read this workflow doc to know existing properties (avoid duplicates)
2. Tavily search: `"apartments groton ct official site"`, `"apartments norwich ct official site"`, etc.
3. Also search: `"new apartment complex groton ct"`, `"new apartments norwich ct"`, `"luxury apartments new london ct"`, `"apartment complex mystic ct"`, `"apartment complex waterford ct"`
4. For each potential new property:
   - Verify it's live and active (not off-market, not under construction)
   - Extract: name, address, phone, website URL, pricing, unit counts
   - Check if official website has floor plans → extract what you can
5. Add to `index.html` immediately (don't wait for next maintenance run)
6. Create property page from template
7. Commit and push to GitHub
8. Send Telegram summary to Steven with what was added

**IMPORTANT — ALWAYS notify Steven regardless of outcome:**
After every run, send a Telegram message to 8603067761 summarizing what happened. Even if nothing changed, say "Apartment site update complete — no changes detected this run." Do NOT suppress notifications.

---

## Key Search Queries
- `"property name apartments groton ct"` — Groton properties
- `"property name Norwich CT apartments"` — Norwich properties
- `"property name New London CT apartments"` — New London properties
- `"property name Mystic CT apartments"` — Mystic/Waterford properties
- Append `"phone number"` or `"for rent"` for better live results
- **Avoid**: Google search (triggers bot protection)

---

## Pages with All Four New Sections
As of 03/22/2026, these 8 pages have Pet Policy + Parking + Lease Terms + Commute sections:
`groton-estates`, `groton-towers`, `groton-townhomes`, `harbor-heights`, `pleasant-valley`, `the-ledges`, `triton-square`, `waterford-woods`

The remaining 20 pages are missing one or more — add placeholder "Contact property for details" when official data is unavailable.

## Properties with No Confirmed Phone
- 482 W Main St, Norwich — contact via Apartments.com only
- Eagle Pointe — partial address (8B Michael Road, New London)

---

## Known Issues (Fixed — Do Not Re-introduce)
- `if info['phone']: new_contact += ...` — Python garbage pattern, remove on sight
- Malformed HTML comments `<!-- TEXT \n<div>` — uncomment or remove properly
- Duplicate `figure-card` per plan type — consolidate
- Missing `figure-grid` wrapper — wrap consecutive figure-cards
- `src` URL corruption → verify img src ends with `filename.jpg`, not `filename.jpg style=`
- `flex-shrink:0; flex-grow:0` required on imgs inside flex containers
- Always set explicit `width` and `height` HTML attributes on img tags
