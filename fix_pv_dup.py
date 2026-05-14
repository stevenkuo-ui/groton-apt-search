import re

with open('pleasant-valley.html', 'rb') as f:
    data = f.read()

# Find all occurrences of the May 14 card heading (UTF-8 encoded)
# "✅ Pleasant Valley prices CONFIRMED stable · May 14, 2026"
# In UTF-8: ✅ = F0 9F 91 9D, · = C2 B7
heading_bytes = '✅ Pleasant Valley prices CONFIRMED stable · May 14, 2026'.encode('utf-8')

# Find all positions of this heading
positions = []
start = 0
while True:
    pos = data.find(heading_bytes, start)
    if pos == -1:
        break
    positions.append(pos)
    start = pos + 1

print(f"Found {len(positions)} occurrences of May 14 heading")
for i, p in enumerate(positions):
    print(f"  #{i}: byte {p}")

if len(positions) >= 2:
    # Remove the second occurrence (duplicate)
    # Find the full card block starting at positions[1]
    # Look for the end of that card block: </div>\n followed by another <div class="news-card">
    second_start = positions[1]
    
    # Find the end of the second card: </div>\n
    end_marker = b'</div>\n'
    search_from = second_start
    end_pos = data.find(end_marker, search_from)
    
    if end_pos != -1:
        end_pos += len(end_marker)  # include the closing tag
        print(f"Removing bytes {second_start} to {end_pos}")
        
        # Remove the duplicate card
        data = data[:second_start] + data[end_pos:]
        print("Removed duplicate card")
    else:
        print("Could not find end of duplicate card")

with open('pleasant-valley.html', 'wb') as f:
    f.write(data)

# Verify
content = data.decode('utf-8')
count = content.count('May 14, 2026')
print(f"May 14 occurrences now: {count}")
news_cards = len(re.findall(r'class="news-card"', content))
print(f"News cards: {news_cards}")