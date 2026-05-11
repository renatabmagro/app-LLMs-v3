import fetch from 'node-fetch';

async function run() {
  const hugeBody = { geoJson: "a".repeat(60 * 1024 * 1024), estacoes: [] };
  console.log("Sending huge body...");
  const res = await fetch('http://127.0.0.1:3000/api/analise/ivpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hugeBody)
  });
  console.log('Status:', res.status);
  console.log('Headers:', res.headers.raw());
  const text = await res.text();
  console.log('Body:', text.slice(0, 100));
}
run();
