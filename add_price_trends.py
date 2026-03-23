#!/usr/bin/env python3
import os, json, re

SITE = "/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21"
os.chdir(SITE)

with open("price_history.json") as f:
    price_data = json.load(f)

# Property file → price_history key (some differ)
FILE_TO_KEY = {
    "120-broad-st.html":          "120-broad-st",
    "2350-gold-star-5.html":      "2350-gold-star-hwy",
    "30-nichols-ln.html":         "30-nichols-ln",
    "302-boston-post-rd-14.html": "302-boston-post-rd-14",
    "482-w-main.html":            "482-w-main",
    "blackstone-apartments.html": "blackstone-apartments",
    "chester-place.html":          "chester-place",
    "courtview-square.html":      "courtview-square",
    "crocker-house.html":         "crocker-house",
    "eagle-pointe.html":          "eagle-pointe",
    "emerson-place.html":         "emerson-place",
    "groton-estates.html":        "groton-estates",
    "groton-towers.html":         "groton-towers",
    "groton-townhomes.html":      "groton-townhomes",
    "gull-harbor.html":           "gull-harbor",
    "harbor-heights.html":        "harbor-heights",
    "hedgewood.html":             "hedgewood",
    "la-triumphe.html":           "la-triumphe",
    "meadow-ridge.html":          "meadow-ridge",
    "pleasant-valley.html":       "pleasant-valley",
    "reid-hughes.html":           "reid-hughes",
    "renew-groton.html":          "renew-groton",
    "renew-washington-park.html": "renew-washington-park",
    "the-ambrose.html":           "the-ambrose",
    "the-ledges.html":            "the-ledges",
    "the-tides.html":             None,
    "triton-square.html":         "triton-square",
    "village-court.html":         None,
    "waterford-woods.html":       "waterford-woods",
}

CHART_CDN = '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>'
CHART_CDN_LINE = '  <!-- Chart.js already loaded -->'

PRICE_TRENDS_CSS = """.card{background:var(--card,#fff);border:1px solid var(--line,#d8dee8);border-radius:18px;box-shadow:0 10px 28px rgba(15,23,42,.06);padding:24px;margin-bottom:18px}
.pt-table{width:100%;border-collapse:separate;border-spacing:0;font-size:14px}
.pt-table th{text-align:left;padding:10px 128px;background:#f4f7fb;font-size:12px;font-weight:700;color:#667085;border-bottom:2px solid #d8dee8}
.pt-table td{padding:10px 128px;border-bottom:1px solid #f0f4fa;background:#fff}
.pt-table tr:last-child td{border-bottom:none}
.pt-up{color:#dc2626;font-size:12px}.pt-down{color:#16a34a;font-size:12px}
.pt-new{font-size:11px;color:#fff;background:#2563eb;padding:1px 6px;border-radius:5px;margin-left:5px;vertical-align:middle}
.chart-wrap{background:#fafcff;border:1px solid #d8dee8;border-radius:14px;padding:20px;margin-bottom:16px}
.room-tabs{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}
.room-tabs button{background:#eef2ff;border:1.5px solid #c7d7ff;border-radius:8px;padding:7px 16px;font-size:13px;font-weight:600;color:#31429c;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
.room-tabs button.active{background:#2563eb;color:#fff;border-color:#2563eb}
.room-tabs button:hover:not(.active){border-color:#2563eb;color:#2563eb}
.trends-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:8px}
.trends-header h2{margin:0;font-size:20px;border:none;padding:0}
.trends-meta{font-size:12px;color:#667085}"""

def compute_trend(data):
    """data = list of (price, date) pairs sorted by date ascending"""
    if not data or len(data) < 2:
        return None, None
    first = data[0]["price"]
    last = data[-1]["price"]
    diff = last - first
    if diff > 0:
        return "up", diff
    elif diff < 0:
        return "down", abs(diff)
    else:
        return "stable", 0

def month_label(date_str):
    """e.g. 2026-01-23 -> Jan 2026"""
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    y, m, _ = date_str.split("-")
    return f"{months[int(m)-1]} {y}"

def build_price_trends_section(prop_key, prop_data):
    """Build the full price trends HTML section for a property."""
    city = prop_data.get("city", "Groton")
    room_types = ["Studio", "1BR", "2BR", "3BR"]
    room_keys  = ["Studio", "1BR", "2BR", "3BR"]

    tabs_html = ""
    chart_wraps_html = ""
    table_rows = []

    for room_label, room_key in zip(room_types, room_keys):
        data = prop_data.get(room_key)
        tab_id  = room_key.lower().replace(" ", "")
        tab_class = "active" if room_key == "Studio" else ""

        tabs_html += f'<button class="{tab_class}" data-tab="{tab_id}">{room_label}</button>\n        '

        display = "block" if room_key == "Studio" else "none"

        if data:
            trend, diff = compute_trend(data)
            # chart meta
            if trend == "up":
                meta_style = 'color:#dc2626;font-weight:700'
                meta_arrow = f"↑ +${diff}"
                trend_label = "Increasing"
                trend_style = 'color:#dc2626;font-weight:700'
                line_color = "#dc2626"
            elif trend == "down":
                meta_style = 'color:#16a34a;font-weight:700'
                meta_arrow = f"↓ -${diff}"
                trend_label = "Decreasing"
                trend_style = 'color:#16a34a;font-weight:700'
                line_color = "#16a34a"
            else:
                meta_style = 'color:#2563eb'
                meta_arrow = "Stable"
                trend_label = "Stable"
                trend_style = 'color:#2563eb'
                line_color = "#2563eb"

            prev_price = data[-2]["price"] if len(data) >= 2 else None
            curr_price = data[-1]["price"]
            prev_table_price = f'${data[-2]["price"]:,}/mo' if len(data) >= 2 else "—"

            meta_html = f'${prev_price:,} → Mar <strong>${curr_price:,}/mo</strong> · <span style="{meta_style}">{meta_arrow} · {trend_label}</span>'

            chart_data = [d["price"] for d in data]
            chart_labels = [month_label(d["date"]) for d in data]

            # Trend for table row
            if trend == "up":
                change_html = f'<span style="color:#dc2626;font-weight:700">↑ +${diff}</span>'
                trend_html  = f'<span style="color:#dc2626;font-weight:700">↑ Increasing</span>'
            elif trend == "down":
                change_html = f'<span style="color:#16a34a;font-weight:700">↓ -${diff}</span>'
                trend_html  = f'<span style="color:#16a34a;font-weight:700">↓ Decreasing</span>'
            else:
                change_html = "—"
                trend_html  = f'<span style="color:#2563eb">Stable</span>'

            prev_table_price = f'${data[-2]["price"]:,}/mo' if len(data) >= 2 else "—"
            curr_table_price = f'${curr_price:,}/mo'

            chart_wraps_html += f'''
<div class="chart-wrap" id="chart-{tab_id}-wrap" style="display:{display}">
<h3>{room_label} — tracked units</h3>
<div class="chart-meta">{meta_html}</div>
<div style="height:200px;position:relative"><canvas id="chart-{tab_id}"></canvas></div>
</div>
'''
            table_rows.append(f"""<tr>
<td>{room_label}</td>
<td>{prev_table_price}</td>
<td class="pt-current">{curr_table_price}</td>
<td>{change_html}</td>
<td>{trend_html}</td>
</tr>""")
        else:
            # No data for this room type
            chart_wraps_html += f'''
<div class="chart-wrap" id="chart-{tab_id}-wrap" style="display:{display}">
<h3>{room_label} — tracked units</h3>
<div class="chart-meta">No {room_label} units tracked at this property</div>
<div style="height:200px;position:relative"><canvas id="chart-{tab_id}"></canvas></div>
</div>
'''
            table_rows.append(f"""<tr>
<td>{room_label}</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>No data</td>
</tr>""")

    table_html = "\n".join(table_rows)

    section_html = f"""
<!-- PRICE TRENDS -->
<div class="card" id="price-trends">
<div class="trends-header">
<h2>📈 Price Trends</h2>
<span class="trends-meta">Last updated Mar 23, 2026 · Comparing Mar 2026 vs Feb 2026</span>
</div>
<div class="room-tabs">
{tabs_html}
</div>

{chart_wraps_html}

<table class="pt-table">
<thead>
<tr>
<th>Room Type</th>
<th>Feb 2026</th>
<th>Mar 2026 (Current)</th>
<th>Change</th>
<th>Trend</th>
</tr>
</thead>
<tbody>
{table_html}
</tbody>
</table>
</div>
<!-- /PRICE TRENDS -->
"""
    return section_html


def build_placeholder_section():
    return """
<!-- PRICE TRENDS -->
<div class="card" id="price-trends">
<div class="trends-header">
<h2>📈 Price Trends</h2>
<span class="trends-meta">Price data coming soon</span>
</div>
<p style="color:#667085;font-size:14px">Price trend data for this property is being gathered. Check back soon!</p>
</div>
<!-- /PRICE TRENDS -->
"""


def build_chart_js(prop_key, prop_data):
    """Build the chart initialization JS."""
    room_keys = ["Studio", "1BR", "2BR", "3BR"]
    tab_ids   = ["studio", "1br", "2br", "3br"]

    lines = []

    for room_key, tab_id in zip(room_keys, tab_ids):
        data = prop_data.get(room_key)
        if not data:
            lines.append(f"// No data for {room_key}")
            continue

        chart_data = [d["price"] for d in data]
        labels = [month_label(d["date"]) for d in data]

        first = chart_data[0]
        last  = chart_data[-1]
        if last > first:
            color = "'#dc2626'"
            fill  = "'rgba(220,38,38,0.08)'"
        elif last < first:
            color = "'#16a34a'"
            fill  = "'rgba(22,163,74,0.08)'"
        else:
            color = "'#2563eb'"
            fill  = "'rgba(37,99,235,0.08)'"

        labels_str = "[" + ", ".join(f"'{l}'" for l in labels) + "]"
        data_str   = "[" + ", ".join(str(x) for x in chart_data) + "]"

        lines.append(f"""new Chart(document.getElementById('chart-{tab_id}'), {{
  type: 'line',
  data: {{
    labels: {labels_str},
    datasets: [{{
      label: '{room_key}',
      data: {data_str},
      borderColor: {color},
      backgroundColor: {fill},
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6
    }}]
  }},
  options: CHART_OPTS
}});""")

    return "\n\n".join(lines)


PROCESSED = [
    "120-broad-st.html","2350-gold-star-5.html","30-nichols-ln.html",
    "302-boston-post-rd-14.html","482-w-main.html","blackstone-apartments.html",
    "chester-place.html","courtview-square.html","crocker-house.html",
    "eagle-pointe.html","emerson-place.html","groton-estates.html",
    "groton-towers.html","groton-townhomes.html","gull-harbor.html",
    "harbor-heights.html","hedgewood.html","la-triumphe.html",
    "meadow-ridge.html","pleasant-valley.html","reid-hughes.html",
    "renew-groton.html","renew-washington-park.html","the-ambrose.html",
    "the-ledges.html","the-tides.html","triton-square.html",
    "village-court.html","waterford-woods.html",
]

for fname in PROCESSED:
    if fname == "the-ledges.html":
        print(f"SKIP {fname}: already has price trends")
        continue

    key = FILE_TO_KEY.get(fname)
    has_data = key is not None and key in price_data

    with open(fname) as f:
        html = f.read()

    # Skip if already has price-trends
    if 'id="price-trends"' in html and not FORCE:
        print(f"SKIP {fname}: already has #price-trends")
        continue

    # 1. Add Chart.js CDN if not present
    if "chart.js@4.4.0" not in html:
        # Add after <meta charset...> or at start of <head>
        html = html.replace(
            "<head>",
            "<head>\n" + CHART_CDN,
            1
        )

    # 2. Append price trends CSS to existing <style> block
    css_marker = "</style>"
    css_to_add = "\n/* Price Trends section */\n" + PRICE_TRENDS_CSS + "\n"
    if ".pt-table" not in html:
        html = html.replace(css_marker, css_to_add + css_marker, 1)

    # 3. Find insertion point: after </div> that closes .hero
    # Strategy: find last </div> before <!-- CONTACT or before <div class="card"> that starts after hero
    # Most files have the pattern: </div> (hero close) + \n<div class="card">
    # Let's find the first </div> that is followed by whitespace then <div class="card"
    # or by <div class="news-card" or by <!-- CONTACT

    # We'll use a simple heuristic: find the first </div> that appears after the hero content
    # and before any other card section. We'll look for the specific pattern.

    # Find insertion point: after the hero div closing
    # The hero div closes with </div> and then usually there's a blank line before next content
    hero_close_pattern = re.compile(r'(</div>\n)(\s*)(<!-- |</div>\s*<div class="card">|\Z)', re.MULTILINE)
    m = hero_close_pattern.search(html)
    if m:
        insert_pt = m.start(2)  # insert at start of whitespace before next content
        # Actually insert after the </div>\n\n
        insert_pt = m.start(1) + len(m.group(1))  # after </div>
    else:
        # fallback: find </div> near the end of first 1500 chars
        first_2k = html[:2000]
        last_div_idx = first_2k.rfind('</div>')
        insert_pt = last_div_idx + len('</div>')

    section_html = build_price_trends_section(key, price_data[key]) if has_data else build_placeholder_section()

    html = html[:insert_pt] + "\n" + section_html + "\n" + html[insert_pt:]

    # 4. Add chart JS before </body>
    chart_js = build_chart_js(key, price_data[key]) if has_data else ""

    tab_switch_js = """// ── Price Trends tab switching ──
document.querySelectorAll('.room-tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.room-tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    ['studio','1br','2br','3br'].forEach(t => {
      const wrap = document.getElementById('chart-' + t + '-wrap');
      if (wrap) wrap.style.display = t === tab ? 'block' : 'none';
    });
  });
});
"""

    chart_opts_js = """
const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ctx => ' $' + ctx.raw.toLocaleString() + '/mo'
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
"""

    full_js = "\n" + chart_opts_js + "\n" + tab_switch_js + "\n" + chart_js + "\n"

    if has_data:
        html = html.replace("</body>", full_js + "</body>", 1)

    with open(fname, "w") as f:
        f.write(html)

    status = "✅" if has_data else "⏳"
    print(f"{status} {fname} ({'has data' if has_data else 'placeholder'})")

print("\nAll property pages updated.")
