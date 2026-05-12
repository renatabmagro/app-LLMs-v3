const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/extract',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, '\nDATA:', data.substring(0, 100)));
});
req.write(JSON.stringify({ basinName: 'São José dos Dourados', level: 8, lat: -21, lng: -50}));
req.end();
