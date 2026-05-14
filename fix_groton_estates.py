import re

# Fix groton-estates - remove May 3 and May 11 Group A, add May 14
with open('groton-estates.html', 'r') as f:
    content = f.read()

# Remove May 3 card
content = re.sub(
    r'\n<div class="news-card">\n<h2>📢 Groton Estates confirmed at 12 units.*?May 3, 2026.*?</div>\n',
    '\n', content, flags=re.DOTALL)

# Remove May 11 Group A card
content = re.sub(
    r'\n<div class="news-card">\n<h2>✅ Group A prices CONFIRMED stable.*?May 11, 2026.*?</div>\n',
    '\n', content, flags=re.DOTALL)

# Find where to insert May 14 card - before the first remaining news card
# Look for first news-card after <!-- NEWS -->
marker = '<!-- NEWS -->'
idx = content.find(marker)
if idx == -1:
    print("ERROR: marker not found")
else:
    # Find the first <div class="news-card"> after marker
    first_card_pos = content.find('<div class="news-card">', idx + len(marker))
    if first_card_pos == -1:
        print("ERROR: first news card not found")
    else:
        new_card = '''<div class="news-card">
<h2>✅ Groton Estates prices CONFIRMED stable · May 14, 2026</h2>
<p class="news-date">May 14, 2026</p>
<p class="news-body">Playwright direct scrape (May 14): 2BR $1,775–$2,065/mo (12 units). $750 off first-month rent special still active. 1BR/3BR still Call for pricing. Direct site accessible. Contact (860) 406-5935.</p>
</div>
'''
        content = content[:first_card_pos] + new_card + content[first_card_pos:]
        print("SUCCESS - added May 14 card to groton-estates")

with open('groton-estates.html', 'w') as f:
    f.write(content)

news_cards = len(re.findall(r'class="news-card"', content))
print(f"News cards: {news_cards}")