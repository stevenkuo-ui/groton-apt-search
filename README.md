# Groton CT Apartment Search

A curated guide to apartments and rental communities in and around Groton, Connecticut — near the Naval Submarine Base, Electric Boat, and other major employers.

## Pages

- [120 Broad St](./120-broad-st.html) — Groton, CT
- [2350 Gold Star 5](./2350-gold-star-5.html) — Groton, CT
- [30 Nichols Ln](./30-nichols-ln.html) — Groton, CT
- [302 Boston Post Rd](./302-boston-post-rd-14.html) — Groton, CT
- [482 W Main](./482-w-main.html) — Groton, CT
- [Blackstone Apartments](./blackstone-apartments.html) — Groton, CT
- [Chester Place](./chester-place.html) — Groton, CT
- [Courtview Square](./courtview-square.html) — Groton, CT
- [Crocker House](./crocker-house.html) — Groton, CT
- [Eagle Pointe](./eagle-pointe.html) — Groton, CT
- [Emerson Place](./emerson-place.html) — Groton, CT
- [Groton Estates](./groton-estates.html) — Groton, CT
- [Groton Towers](./groton-towers.html) — Groton, CT
- [Groton Townhomes](./groton-townhomes.html) — Groton, CT
- [Gull Harbor](./gull-harbor.html) — Groton, CT
- [Harbor Heights Mystic](./harbor-heights.html) — Mystic, CT
- [Hedgewood](./hedgewood.html) — Groton, CT
- [La Triumphe](./la-triumphe.html) — Groton, CT
- [Meadow Ridge](./meadow-ridge.html) — Groton, CT
- [Pleasant Valley Apartments](./pleasant-valley.html) — Groton, CT
- [Reid Hughes](./reid-hughes.html) — Groton, CT
- [Renew Groton](./renew-groton.html) — Groton, CT
- [Renew Washington Park](./renew-washington-park.html) — Groton, CT
- [The Ambrose](./the-ambrose.html) — Groton, CT
- [The Ledges](./the-ledges.html) — Groton, CT
- [The Tides](./the-tides.html) — Groton, CT
- [Triton Square](./triton-square.html) — Groton, CT
- [Village Court](./village-court.html) — Groton, CT
- [Villages at Shore Landing](./villages-at-shore-landing.html) — Groton, CT
- [Waterford Woods](./waterford-woods.html) — Waterford, CT

## Overview

Each property page includes:
- Contact info and office hours
- Current pricing and availability
- Floor plan images
- Pet policy
- Parking details
- Lease terms
- Commute & neighborhood info
- Property features and amenities
- Source links

## Tech

Plain HTML + CSS — no build step required. All pages are fully static and work from the filesystem or any static host.

## Price Trends Data

**`price_history.json`** is the source of truth for all price trend data displayed on property pages and the City Price Trends tab on `index.html`. It contains monthly price snapshots (Jan–Mar 2026) for every property, keyed by slug.

Each entry has:
- `city` — city name (Groton, Norwich, New London, Mystic, Waterford)
- Room-type keys (`1BR`, `2BR`, `Studio`, `3BR` where available) — each an array of `{price, date}` objects

To add or update price history for a property, edit the relevant entry in `price_history.json`. The property page `Price Trends` section and the index `City Price Trends` tab both read from this file (JSON fetch integration can be wired up as needed).

## Contributing

Found a listing error or know of a property missing from the list? Feel free to open an issue or submit a pull request.
