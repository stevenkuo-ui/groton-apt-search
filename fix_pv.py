import re

today = "May 14, 2026"

new_card = '''<div class="news-card">
<h2>✅ Pleasant Valley prices CONFIRMED stable · May 14, 2026</h2>
<p class="news-date">May 14, 2026</p>
<p class="news-body">Playwright direct scrape (May 14): Studio $1,870/mo (4 units), 1BR $2,085/mo (5 units), 2BR $2,535/mo (1 unit). No change from May 13. G5 platform accessible. Contact (959) 949-1105.</p>
</div>
'''

with open('pleasant-valley.html', 'r') as f:
    content = f.read()

# Remove "Group A stable" May 11 card if present
content = re.sub(r'\n<div class="news-card">\n<h2>✅ Group A prices CONFIRMED stable.*?May 11, 2026.*?</div>\n', '\n', content, flags=re.DOTALL)

# Remove "May 3" old card (6th oldest)
content = re.sub(r'\n<div class="news-card">\n<h2>📍 Pleasant Valley prices unchanged.*?May 3, 2026.*?</div>\n', '\n', content, flags=re.DOTALL)

# Insert new card after <!-- NEWS -->
marker = '<!-- NEWS -->'
idx = content.find(marker)
if idx == -1:
    print("ERROR: marker not found")
else:
    insert_pos = idx + len(marker) + 1
    content = content[:insert_pos] + '\n' + new_card + content[insert_pos:]
    print("SUCCESS")

with open('pleasant-valley.html', 'w') as f:
    f.write(content)