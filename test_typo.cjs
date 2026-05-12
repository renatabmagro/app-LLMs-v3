const http = require('http');

async function run() {
  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/extrac', // TYPO
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, (res) => {
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => console.log('STATUS:', res.statusCode, '\nDATA:', responseData.substring(0, 100)));
  });

  req.write(JSON.stringify({ basinName: 'Test' }));
  req.end();
}

run();
