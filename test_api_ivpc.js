async function run() {
  const geoJson = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [-45.5, -23.5],
          [-45.0, -23.5],
          [-45.0, -23.0],
          [-45.5, -23.0],
          [-45.5, -23.5]
        ]
      ]
    }
  };

  const res = await fetch('http://localhost:3000/api/analise/ivpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ geoJson, estacoes: [] })
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}

run();
