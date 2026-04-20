import https from 'node:https';

function fetch(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {hostname: u.hostname, path: u.pathname, method: 'GET', headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Accept': 'text/html'}};
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({status: res.statusCode, body: data}));
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  // Check Reid Hughes pricing
  const rh = await fetch('https://reidhughes.com/Floor-Plans.aspx');
  const prices = rh.body.match(/\$\d{1,3}(,\d{3})*/g) || [];
  console.log('RH prices found:', [...new Set(prices)].join(', '));
  const lines = rh.body.split('\n');
  const priceLines = lines.filter(l => l.match(/\$/));
  console.log('Price lines:');
  priceLines.slice(0, 20).forEach(l => console.log('  ', l.trim().substring(0, 120)));
}

main().catch(console.error);
