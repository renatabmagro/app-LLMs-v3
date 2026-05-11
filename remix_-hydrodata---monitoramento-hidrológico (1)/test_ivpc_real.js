import fetch from 'node-fetch';
import * as turf from '@turf/turf';

async function run() {
  const req = await fetch('http://127.0.0.1:3000/api/catalog/bacias');
  const bacias = await req.json();
  const parana = bacias.find(b => b.nome_bacia.toLowerCase().includes('paraná'));
  console.log("Found: ", parana.nome_bacia);
  
  const res = await fetch('http://127.0.0.1:3000/api/analise/ivpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ geoJson: parana.geometria_geojson, estacoes: [] })
  });
  console.log('Status:', res.status);
  console.log('Headers:', res.headers.raw());
  const text = await res.text();
  console.log('Body:', text.slice(0, 100));
}
run();
