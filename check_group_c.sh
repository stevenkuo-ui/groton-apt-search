#!/bin/bash
# Group C Property Update Script
# Properties: ReNew Groton, ReNew Washington Park, Eagle Pointe, Blackstone Apartments, 
#             Courtview Square, Crocker House, 120 Broad St, 2350 Gold Star Hwy,
#             30 Nichols Ln, 302 Boston Post Rd, Village Court

echo "=== GROUP C APARTMENT UPDATE ==="
echo "Started at: $(date)"

WORKDIR="/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21"
PRICE_FILE="/Users/stevenkuo/self-improving/apartment_prices.json"
TAVILY_SCRIPT="/Users/stevenkuo/.openclaw/workspace/skills/tavily-search/scripts/search.mjs"

# Results tracking
PROPS_CHECKED=()
CHANGES_FOUND=()
NEWS_ITEMS=()
PRICE_CHANGES=()
UNITS_ADDED=()
UNITS_REMOVED=()

log() { echo "[$(date '+%H:%M:%S')] $1"; }

# ========== EAGLE POINTE ==========
log "Checking Eagle Pointe..."
RESULT=$(node $TAVILY_SCRIPT "Eagle Pointe apartments New London CT 2026 pricing availability" -n 8 --depth advanced 2>&1)
echo "$RESULT" | head -40
echo "--- EAGLE POINTE DONE ---"
echo ""

# ========== BLACKSTONE APARTMENTS ==========
log "Checking Blackstone Apartments..."
RESULT=$(node $TAVILY_SCRIPT "Blackstone Apartments Norwich CT 2026 pricing availability" -n 8 --depth advanced 2>&1)
echo "$RESULT" | head -40
echo "--- BLACKSTONE DONE ---"
echo ""

# ========== COURTVIEW SQUARE ==========
log "Checking Courtview Square..."
RESULT=$(node $TAVILY_SCRIPT "Courtview Square apartments New London CT 2026 pricing availability" -n 8 --depth advanced 2>&1)
echo "$RESULT" | head -40
echo "--- COURTVIEW DONE ---"
echo ""

# ========== CROCKER HOUSE ==========
log "Checking Crocker House..."
RESULT=$(node $TAVILY_SCRIPT "Crocker House apartments New London CT 2026 pricing availability" -n 8 --depth advanced 2>&1)
echo "$RESULT" | head -40
echo "--- CROCKER HOUSE DONE ---"
echo ""

# ========== 120 BROAD ST ==========
log "Checking 120 Broad St..."
RESULT=$(node $TAVILY_SCRIPT "120 Broad St New London CT apartments for rent 2026" -n 8 --depth advanced 2>&1)
echo "$RESULT" | head -40
echo "--- 120 BROAD ST DONE ---"
echo ""

# ========== 2350 GOLD STAR HWY ==========
log "Checking 2350 Gold Star Hwy..."
RESULT=$(node $TAVILY_SCRIPT "Colonial Efficiency 2350 Gold Star Hwy Mystic CT apartments 2026" -n 8 --depth advanced 2>&1)
echo "$RESULT" | head -40
echo "--- GOLD STAR HWY DONE ---"
echo ""

# ========== 30 NICHOLS LN ==========
log "Checking 30 Nichols Ln..."
RESULT=$(node $TAVILY_SCRIPT "30 Nichols Ln Waterford CT apartment for rent 2026" -n 8 --depth advanced 2>&1)
echo "$RESULT" | head -40
echo "--- 30 NICHOLS LN DONE ---"
echo ""

# ========== 302 BOSTON POST RD ==========
log "Checking 302 Boston Post Rd..."
RESULT=$(node $TAVILY_SCRIPT "302 Boston Post Rd East Lyme CT apartment for rent 2026" -n 8 --depth advanced 2>&1)
echo "$RESULT" | head -40
echo "--- BOSTON POST RD DONE ---"
echo ""

echo "=== ALL SCRAPING COMPLETE ==="
echo "Finished at: $(date)"