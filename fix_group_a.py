import os
os.chdir('/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21/')

import re

files = {
    'pleasant-valley.html': {
        'new_card': '''<div class="news-card">
<h2>✅ Pleasant Valley prices CONFIRMED stable · May 14, 2026</h2>
<p class="news-date">May 14, 2026</p>
<p class="news-body">Playwright direct scrape (May 14): Studio $1,870/mo (4 units), 1BR $2,085/mo (5 units), 2BR $2,535/mo (1 unit). No change from May 13. G5 platform accessible. Contact (959) 949-1105.</p>
</div>
''',
        'remove_dates': ['May 3, 2026', 'May 11, 2026'],
    },
    'chester-place.html': {
        'new_card': '''<div class="news-card">
<h2>✅ Chester Place prices CONFIRMED stable · May 14, 2026</h2>
<p class="news-date">May 14, 2026</p>
<p class="news-body">b7properties.com/chester-place confirmed (May 14): 1BR/1BA 608sqft still $1,925/mo. No change from May 13. $99/mo community fee unchanged. No active specials. Direct site accessible. Contact (401) 396-9777.</p>
</div>
''',
        'remove_dates': ['May 3, 2026', 'May 11, 2026'],
    },
    'emerson-place.html': {
        'new_card': '''<div class="news-card">
<h2>✅ Emerson Place prices CONFIRMED stable · May 14, 2026</h2>
<p class="news-date">May 14, 2026</p>
<p class="news-body">Playwright direct scrape (May 14): 1BR $1,975/mo, 1BR Corner $1,995/mo, 2BR $2,445/mo. No change from May 13. Direct site accessible. $99/mo community fee covers heat/hot water/gas/WiFi/trash. Contact (401) 396-9777.</p>
</div>
''',
        'remove_dates': ['May 3, 2026', 'May 11, 2026'],
    },
    'groton-estates.html': {
        'new_card': '''<div class="news-card">
<h2>✅ Groton Estates prices CONFIRMED stable · May 14, 2026</h2>
<p class="news-date">May 14, 2026</p>
<p class="news-body">Playwright direct scrape (May 14): 2BR $1,775–$2,065/mo (12 units). $750 off first-month rent special still active. 1BR/3BR still Call for pricing. Direct site accessible. Contact (860) 406-5935.</p>
</div>
''',
        'remove_dates': ['May 3, 2026', 'May 11, 2026'],
    },
}

for filename, cfg in files.items():
    print(f"Processing {filename}...")
    with open(filename, 'r') as f:
        content = f.read()

    # Remove cards by date
    for date in cfg['remove_dates']:
        # Match the card containing this date
        pattern = r'\n<div class="news-card">\n.*?' + re.escape(date) + r'.*?</div>\n'
        new_content = re.sub(pattern, '\n', content, flags=re.DOTALL)
        if new_content != content:
            print(f"  Removed card with {date}")
            content = new_content
        else:
            print(f"  Could not find card with {date}")

    # Insert new card after <!-- NEWS -->
    marker = '<!-- NEWS -->'
    idx = content.find(marker)
    if idx == -1:
        print(f"  ERROR: marker not found in {filename}")
        continue

    insert_pos = idx + len(marker) + 1
    content = content[:insert_pos] + '\n' + cfg['new_card'] + content[insert_pos:]

    with open(filename, 'w') as f:
        f.write(content)
    print(f"  Added May 14 news card")
    print(f"  SUCCESS")