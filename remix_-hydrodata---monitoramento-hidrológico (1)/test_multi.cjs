const http = require('http');

async function run() {
  const baciaPayload = {
    basinName: "Test Multi",
    level: 8,
    lat: -21, lng: -50,
    geoJsonBacia: { type: "MultiPolygon", coordinates: [[[[0,0],[1,0],[1,1],[0,1],[0,0]]]] }
  };

  const strPayload = JSON.stringify(baciaPayload);

  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/extract',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(strPayload)
    }
  }, (res) => {
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => console.log('STATUS:', res.statusCode, '\nDATA:', responseData.substring(0, 100)));
  });

  req.on('error', e => console.error(e));
  req.write(strPayload);
  req.end();
}

run();
