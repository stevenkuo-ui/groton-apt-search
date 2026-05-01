// La Triumphe - search for current pricing via Bing
const { execSync } = require('child_process');
try {
  const result = execSync('curl -s "https://www.bing.com/search?q=La+Triumphe+apartments+Groton+CT+3BR+rent+2026" -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" | head -c 10000', { timeout: 15000 });
  console.log('BING_SEARCH_RESULT:', result.toString().slice(0, 5000));
} catch(e) {
  console.log('ERROR:', e.message.slice(0, 300));
}
