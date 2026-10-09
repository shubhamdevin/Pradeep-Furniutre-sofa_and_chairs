const https = require('https');

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: e.message, status: res.statusCode });
        }
      });
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function run() {
  const m1 = await fetchJson('https://api.sketchfab.com/v3/models/1d09094be7fc4e809841992d8801f217');
  console.log('Sofa 3 thumbnail:', m1.thumbnails?.images?.[0]?.url);
  
  const m2 = await fetchJson('https://api.sketchfab.com/v3/models/4b053c1851784878a0add9973b89d823');
  console.log('Wingback thumbnail:', m2.thumbnails?.images?.[0]?.url);
}

run();
