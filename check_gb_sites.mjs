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
  // Groton Townhomes available rentals
  const gt = await fetch('https://grotontownhouses.com/available-rentals');
  console.log('GT Grotontownhouses status:', gt.status);
  const prices = gt.body.match(/\$\d{1,3}(,\d{3})*\/mo/g) || [];
  console.log('GT prices:', [...new Set(prices)].join(', '));

  // Check Ambrose direct site for prices
  const amb = await fetch('https://www.b7properties.com/ambrose');
  const has1995 = amb.body.includes('1,995') || amb.body.includes('1995');
  const has2345 = amb.body.includes('2,345') || amb.body.includes('2345');
  console.log('Ambrose Has 1,995:', has1995, 'Has 2,345:', has2345);
  
  // Check Reid Hughes for Please Call text
  const rh = await fetch('https://reidhughes.com/Floor-Plans.aspx');
  const pleaseCall = rh.body.toLowerCase().includes('please call');
  console.log('RH Please Call:', pleaseCall, 'status:', rh.status);
  
  // Check Groton Towers floorplans
  const gtTower = await fetch('https://grotonapartmenthomes.com/floorplans/');
  console.log('GT Towers floorplans status:', gtTower.status);
}

main().catch(console.error);
