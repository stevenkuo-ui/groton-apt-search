import https from 'node:https';

function fetch(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {hostname: u.hostname, path: u.pathname, method: 'GET', headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en'
    }};
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({status: res.statusCode, headers: res.headers, body: data}));
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  // Check Groton Townhomes with full redirect following
  const gt = await fetch('https://www.grotontownhouses.com/available-rentals');
  console.log('GT status:', gt.status);
  
  // Look for 1875 and 2050 and 2195 price strings
  const has1875 = gt.body.includes('1,875');
  const has2050 = gt.body.includes('2,050');
  const has2195 = gt.body.includes('2,195');
  const has205000 = gt.body.includes('2050');
  const has219500 = gt.body.includes('2195');
  console.log('Has 1,875:', has1875);
  console.log('Has 2,050:', has2050);
  console.log('Has 2,195:', has2195);
  console.log('Has 2050 (raw):', has205000);
  console.log('Has 2195 (raw):', has219500);
  
  // Look for any price amount between 1800-2300
  const priceRange = gt.body.match(/1,(?:8\d{2}|9\d{2}|0\d{2})|2,(?:0\d{2}|1\d{2})/g) || [];
  console.log('Possible current prices:', [...new Set(priceRange)].join(', '));
  
  // Check Ambrose for both 1995 and 2345
  const amb = await fetch('https://www.b7properties.com/ambrose');
  console.log('\nAmbrose 1,995:', amb.body.includes('1,995'));
  console.log('Ambrose 2,345:', amb.body.includes('2,345'));
  console.log('Ambrose 2,195:', amb.body.includes('2,195'));
  
  // Check Groton Towers floorplans
  const gtTower = await fetch('https://grotonapartmenthomes.com/floorplans/');
  console.log('\nGT Towers floorplans status:', gtTower.status, 'location:', gtTower.headers.location || 'none');
}

main().catch(console.error);
