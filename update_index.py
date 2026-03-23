#!/usr/bin/env python3
"""Update index.html city charts to multi-line format."""
import json, re

SITE = "/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21"
with open(f"{SITE}/price_history.json") as f:
    ph = json.load(f)

# Compute average price by city, room type, month
from collections import defaultdict
city_data = defaultdict(lambda: defaultdict(lambda: [[], [], []]))
for prop_id, data in ph.items():
    city = data.get("city", "Unknown")
    for room in ["Studio", "1BR", "2BR", "3BR"]:
        if room in data and data[room]:
            for i, entry in enumerate(data[room]):
                if i < 3:
                    city_data[city][room][i].append(entry["price"])

def avg(lst):
    return sum(lst) / len(lst) if lst else None

def round_val(v):
    if v is None: return None
    return round(v)

cities = [
    ("Groton",      "groton",    12, "$1,890"),
    ("Norwich",     "norwich",    6, "$1,375"),
    ("New London",  "nl",         5, "$1,520"),
    ("Mystic",      "mystic",     3, "$2,380"),
    ("Waterford",   "waterford",  2, "$1,640"),
]
room_order = ["Studio", "1BR", "2BR", "3BR"]
room_colors = {
    "Studio": ("#7c3aed", "rgba(124,58,237,0.08)"),
    "1BR":    ("#2563eb", "rgba(37,99,235,0.08)"),
    "2BR":    ("#0891b2", "rgba(8,145,178,0.08)"),
    "3BR":    ("#d97706", "rgba(217,119,6,0.08)"),
}

# Build city chart data
city_chart_data = {}
for city_name, city_key, prop_count, _ in cities:
    datasets = []
    has_any = False
    for room in room_order:
        months = city_data[city_name][room]
        avgs = [avg(m) for m in months]
        if any(a is not None for a in avgs):
            has_any = True
            line_c, fill_c = room_colors[room]
            # Round to nearest $5
            avgs_rounded = [round_val(a) if a else None for a in avgs]
            datasets.append({
                "label": room,
                "data": avgs_rounded,
                "borderColor": line_c,
                "backgroundColor": fill_c,
            })
    if has_any:
        city_chart_data[city_key] = datasets

# Read index.html
with open(f"{SITE}/index.html") as f:
    html = f.read()

# 1. Remove rt-tabs div
html = re.sub(r'\n<div class="rt-tabs">.*?</div>\n', '\n', html, flags=re.DOTALL)

# 2. Update ct-sub text for each city to remove 1BR-specific text
for city_name, city_key, prop_count, avg_1br in cities:
    old_sub = f'<div class="ct-sub">{prop_count} properties · Avg 1BR: {avg_1br}</div>'
    new_sub = f'<div class="ct-sub">{prop_count} properties · All room types tracked</div>'
    html = html.replace(old_sub, new_sub)

# 3. Update intro text
html = re.sub(
    r'Average 1BR rent across',
    'Average rent across',
    html
)
html = re.sub(
    r'tracked monthly since January 2026\.</p>',
    'tracked monthly since January 2026 (Studio, 1BR, 2BR, 3BR where available).</p>',
    html
)

# 4. Update the script section - replace idxChart function and data
new_script = """
// ── Index city trend charts (multi-line) ──
const CITY_CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: { usePointStyle: true, padding: 14, font: { size: 11 } }
    },
    tooltip: {
      callbacks: {
        label: ctx => ' ' + ctx.dataset.label + ': $' + ctx.raw.toLocaleString() + '/mo'
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: { callback: v => '$' + v.toLocaleString() }
    }
  }
};

// City datasets
const CITY_CHARTS = """

# Build the CITY_CHARTS JavaScript object
city_charts_js = "{\n"
for city_name, city_key, prop_count, _ in cities:
    if city_key not in city_chart_data:
        continue
    datasets = city_chart_data[city_key]
    city_charts_js += f"  '{city_key}': [\n"
    for ds in datasets:
        city_charts_js += f"    {{ label: '{ds['label']}', data: {ds['data']}, borderColor: '{ds['borderColor']}', backgroundColor: '{ds['backgroundColor']}', fill: true, tension: 0.3, pointRadius: 3, pointHoverRadius: 5, spanGaps: true }},\n"
    city_charts_js += "  ],\n"
city_charts_js += "};\n"

# Generate init code for each city
init_js = "\n"
for city_name, city_key, prop_count, _ in cities:
    if city_key not in city_chart_data:
        continue
    init_js += f"""// {city_name}
new Chart(document.getElementById('idx-chart-{city_key}'), {{
  type: 'line',
  data: {{
    labels: ['Jan 2026', 'Feb 2026', 'Mar 2026'],
    datasets: CITY_CHARTS['{city_key}']
  }},
  options: CITY_CHART_OPTS
}});
"""

# Replace the old script section
# Find the old script section starting from "// ── Index city trend charts ──"
old_chart_pattern = r'// ── Index city trend charts ──.*?</script>'
new_full_script = "// ── Index city trend charts (multi-line) ──\n" + city_charts_js + init_js + "\n</script>"

html = re.sub(old_chart_pattern, new_full_script, html, flags=re.DOTALL)

with open(f"{SITE}/index.html", "w") as f:
    f.write(html)

print("index.html updated successfully")

# Print summary
for city_name, city_key, prop_count, _ in cities:
    if city_key in city_chart_data:
        rooms = [ds['label'] for ds in city_chart_data[city_key]]
        print(f"  {city_name}: {', '.join(rooms)}")
    else:
        print(f"  {city_name}: NO DATA")
