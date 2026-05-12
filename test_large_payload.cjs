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

// VERY LARGE PAYLOAD
const coords = [];
for (let i = 0; i < 500000; i++) coords.push([0, 0]);

req.write(JSON.stringify({ 
  basinName: 'Massive', level: 8, lat: -21, lng: -50,
  geoJsonBacia: { type: "Polygon", coordinates: [coords] }
}));
req.end();
