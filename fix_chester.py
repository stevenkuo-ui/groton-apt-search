import re

with open('chester-place.html', 'r') as f:
    content = f.read()

# Remove May 3 card
content = re.sub(
    r'\n<div class="news-card">\n<h2>💰 Chester Place prices confirmed stable.*?May 3, 2026.*?</div>\n',
    '\n', content, flags=re.DOTALL)

# Remove "Group A stable" May 11 card
content = re.sub(
    r'\n<div class="news-card">\n<h2>✅ Group A prices CONFIRMED stable.*?May 11, 2026.*?</div>\n',
    '\n', content, flags=re.DOTALL)

# Insert May 14 card after <!-- NEWS -->
new_card = '''<div class="news-card">
<h2>✅ Chester Place prices CONFIRMED stable · May 14, 2026</h2>
<p class="news-date">May 14, 2026</p>
<p class="news-body">b7properties.com/chester-place confirmed (May 14): 1BR/1BA 608sqft still $1,925/mo. No change from May 13. $99/mo community fee unchanged. No active specials. Direct site accessible. Contact (401) 396-9777.</p>
</div>
'''

marker = '<!-- NEWS -->'
idx = content.find(marker)
if idx == -1:
    print("ERROR: marker not found")
else:
    insert_pos = idx + len(marker) + 1
    content = content[:insert_pos] + '\n' + new_card + content[insert_pos:]
    print("SUCCESS")

with open('chester-place.html', 'w') as f:
    f.write(content)