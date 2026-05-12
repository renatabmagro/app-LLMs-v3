import fetch from 'node-fetch';

async function run() {
  const res = await fetch('http://127.0.0.1:3000/api/analise/ivpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  console.log('Status:', res.status);
  console.log('Headers:', res.headers.raw());
  const text = await res.text();
  console.log('Body:', text.slice(0, 100));
}
run();
