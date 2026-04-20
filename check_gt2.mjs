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
  // Check Groton Townhomes at www. variant (200 status)
  const gt = await fetch('https://www.grotontownhouses.com/available-rentals');
  console.log('GT status:', gt.status);
  const prices = gt.body.match(/\$[\d,]+(?:\/mo)?/g) || [];
  console.log('GT prices:', [...new Set(prices)].join(', '));
  const lines = gt.body.split('\n');
  const priceLines = lines.filter(l => l.includes('$') && l.trim().length < 200);
  console.log('Price lines:');
  priceLines.slice(0, 15).forEach(l => console.log('  ', l.trim().substring(0, 150)));
}

main().catch(console.error);
