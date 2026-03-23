#!/usr/bin/env python3
"""Rebuild Price Trends section on all property pages."""
import json, re, os

SITE = "/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21"

with open(f"{SITE}/price_history.json") as f:
    ph = json.load(f)

FILENAME_TO_KEY = {
    '120-broad-st.html':              '120-broad-st',
    '2350-gold-star-5.html':          '2350-gold-star-hwy',
    '30-nichols-ln.html':             '30-nichols-ln',
    '302-boston-post-rd-14.html':     '302-boston-post-rd-14',
    '482-w-main.html':                '482-w-main',
    'blackstone-apartments.html':      'blackstone-apartments',
    'chester-place.html':             'chester-place',
    'courtview-square.html':          'courtview-square',
    'crocker-house.html':             'crocker-house',
    'eagle-pointe.html':              'eagle-pointe',
    'emerson-place.html':             'emerson-place',
    'groton-estates.html':            'groton-estates',
    'groton-towers.html':             'groton-towers',
    'groton-townhomes.html':          'groton-townhomes',
    'gull-harbor.html':               'gull-harbor',
    'harbor-heights.html':            'harbor-heights',
    'hedgewood.html':                 'hedgewood',
    'la-triumphe.html':               'la-triumphe',
    'meadow-ridge.html':              'meadow-ridge',
    'pleasant-valley.html':           'pleasant-valley',
    'reid-hughes.html':              'reid-hughes',
    'renew-groton.html':             'renew-groton',
    'renew-washington-park.html':    'renew-washington-park',
    'the-ambrose.html':              'the-ambrose',
    'the-ledges.html':               'the-ledges',
    'the-tides.html':                None,
    'triton-square.html':            'triton-square',
    'village-court.html':            None,
    'waterford-woods.html':          'waterford-woods',
}

ROOM_COLORS = {
    'Studio': {'line': '#7c3aed', 'fill': 'rgba(124,58,237,0.08)', 'label': 'Studio'},
    '1BR':    {'line': '#2563eb', 'fill': 'rgba(37,99,235,0.08)',  'label': '1BR'},
    '2BR':    {'line': '#0891b2', 'fill': 'rgba(8,145,178,0.08)',  'label': '2BR'},
    '3BR':    {'line': '#d97706', 'fill': 'rgba(217,119,6,0.08)',  'label': '3BR'},
}
ROOM_ORDER = ['Studio', '1BR', '2BR', '3BR']

NO_DATA_HTML = """<!-- PRICE TRENDS -->
<div class="card" id="price-trends">
<div class="trends-header">
<h2>📈 Price Trends</h2>
<span class="trends-meta">Last updated Mar 23, 2026</span>
</div>
<p style="color:var(--muted);font-size:14px">Price data coming soon for this property.</p>
</div>
<!-- /PRICE TRENDS -->"""


def build_new_section(prop_id, data):
    available = [r for r in ROOM_ORDER if r in data and data[r]]
    if not available:
        return NO_DATA_HTML, "", "NO DATA"

    datasets, rows = [], []
    for room in available:
        entries = data[room]
        prices  = [e['price'] for e in entries]
        c       = ROOM_COLORS[room]
        datasets.append(
            "      {\n"
            "        label: '%s',\n"
            "        data: %s,\n"
            "        borderColor: '%s',\n"
            "        backgroundColor: '%s',\n"
            "        fill: true,\n"
            "        tension: 0.3,\n"
            "        pointRadius: 4,\n"
            "        pointHoverRadius: 6,\n"
            "        spanGaps: true,\n"
            "      }" % (c['label'], prices, c['line'], c['fill']))

        feb  = prices[1] if len(prices) > 1 else None
        mar  = prices[-1]
        prev = prices[-2] if len(prices) > 1 else None
        feb_str = f"${feb:,}/mo" if feb is not None else "—"
        if prev is not None:
            if mar > prev:
                chg   = f'<span style="color:#dc2626;font-weight:700">&#8593; +${mar-prev:,}</span>'
                trend = '<span style="color:#dc2626;font-weight:700">&#8593; Increasing</span>'
            elif mar < prev:
                chg   = f'<span style="color:#16a34a;font-weight:700">&#8595; -${prev-mar:,}</span>'
                trend = '<span style="color:#16a34a;font-weight:700">&#8595; Decreasing</span>'
            else:
                chg   = '—'
                trend = '<span style="color:#2563eb">&#8594; Stable</span>'
        else:
            chg   = '—'
            trend = '<span style="color:var(--accent)">New unit type</span>'

        rows.append(
            "<tr>\n"
            "<td>%s</td>\n"
            "<td>%s</td>\n"
            f'<td class="pt-current">${mar:,}/mo <span style="color:{c["line"]};font-size:12px;margin-left:4px">●</span></td>\n'
            "<td>%s</td>\n"
            "<td>%s</td>\n"
            "</tr>" % (c['label'], feb_str, chg, trend))

    rows_html   = "\n".join(rows)
    datasets_js = ",\n".join(datasets)

    html = (
        "<!-- PRICE TRENDS -->\n"
        '<div class="card" id="price-trends">\n'
        '<div class="trends-header">\n'
        "<h2>&#128200; Price Trends</h2>\n"
        "<span class=\"trends-meta\">Last updated Mar 23, 2026 &middot; Comparing Mar 2026 vs Feb 2026</span>\n"
        "</div>\n\n"
        '<div class="chart-wrap" id="price-chart-wrap">\n'
        "<h3>Price History by Room Type</h3>\n"
        '<div style="height:260px;position:relative"><canvas id="price-trend-chart"></canvas></div>\n'
        "</div>\n\n"
        '<table class="pt-table">\n'
        "<thead>\n"
        "<tr>\n"
        "<th>Room Type</th>\n"
        "<th>Feb 2026</th>\n"
        "<th>Mar 2026 (Current)</th>\n"
        "<th>Change</th>\n"
        "<th>Trend</th>\n"
        "</tr>\n"
        "</thead>\n"
        "<tbody>\n"
        + rows_html + "\n"
        "</tbody>\n"
        "</table>\n"
        "</div>\n"
        "<!-- /PRICE TRENDS -->")

    chart_js = (
        "// ── Price Trends Chart (single multi-line) ──\n"
        "new Chart(document.getElementById('price-trend-chart'), {\n"
        "  type: 'line',\n"
        "  data: {\n"
        "    labels: ['Jan 2026', 'Feb 2026', 'Mar 2026'],\n"
        "    datasets: [\n"
        + datasets_js + "\n"
        "    ]\n"
        "  },\n"
        "  options: {\n"
        "    responsive: true,\n"
        "    maintainAspectRatio: false,\n"
        "    plugins: {\n"
        "      legend: {\n"
        "        display: true,\n"
        "        position: 'top',\n"
        "        labels: { usePointStyle: true, padding: 16, font: { size: 12 } }\n"
        "      },\n"
        "      tooltip: {\n"
        "        callbacks: {\n"
        "          label: ctx => ' ' + ctx.dataset.label + ': $' + ctx.raw.toLocaleString() + '/mo'\n"
        "        }\n"
        "      }\n"
        "    },\n"
        "    scales: {\n"
        "      y: {\n"
        "        beginAtZero: false,\n"
        "        ticks: { callback: v => '$' + v.toLocaleString() }\n"
        "      }\n"
        "    }\n"
        "  }\n"
        "});\n")

    return html, chart_js, "%d room types: %s" % (len(available), ", ".join(available))


# Process property files
prop_files = [f for f in os.listdir(SITE)
              if f.endswith('.html')
              and f != 'index.html'
              and not f.startswith('design-')]

results = []

for fname in sorted(prop_files):
    fpath = os.path.join(SITE, fname)
    with open(fpath) as f:
        content = f.read()

    key = FILENAME_TO_KEY.get(fname)
    if key and key in ph:
        new_html, chart_js, room_info = build_new_section(key, ph[key])
    else:
        new_html  = NO_DATA_HTML
        chart_js  = ""
        room_info = "NO DATA"

    # Replace the old price-trends section
    new_content = re.sub(
        r'<!-- PRICE TRENDS -->.*?<!-- /PRICE TRENDS -->',
        new_html, content, flags=re.DOTALL)

    # Remove old tab-switching JS (multiline)
    new_content = re.sub(
        r'//[^\n]*Price Trends tab switching[^\n]*\n.*?\}\);\n',
        '', new_content, flags=re.DOTALL)

    # Remove old Chart.js chart inits (multiline, matches to });
    for chart_id in ('chart-studio', 'chart-1br', 'chart-2br', 'chart-3br'):
        new_content = re.sub(
            r'new Chart\(document\.getElementById\(\'' + chart_id + r'\'\).*?\}\);',
            '', new_content, flags=re.DOTALL)

    # Remove old CHART_OPTS (multiline)
    new_content = re.sub(
        r"const CHART_OPTS = \{[\s\S]*?\}\n\};\n",
        '', new_content)

    # Remove trendColor function (multiline)
    new_content = re.sub(
        r"function trendColor\(data\) \{[\s\S]*?\}\n",
        '', new_content)

    # Remove old data/colour vars
    new_content = re.sub(
        r'const (studioData|s1brData|s2brData|s3brData|cStudio|c1br|c2br) .*?;\n',
        '', new_content)

    # Clean up orphaned blank lines left by removals
    new_content = re.sub(r'\n{4,}', '\n\n', new_content)

    # Insert new chart JS: replace the entire <script> block with new chart JS
    if chart_js:
        new_content = re.sub(
            r'(<script>\s*\n)(.*?)(</script>\s*</body>)',
            lambda m: m.group(1) + '\n' + chart_js + '\n' + m.group(3),
            new_content, flags=re.DOTALL)

    with open(fpath, 'w') as f:
        f.write(new_content)

    results.append((fname, room_info))

print("Processed:")
for fname, info in results:
    print("  %s: %s" % (fname, info))
