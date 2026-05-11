async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/catalog/bacias');
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log("Text length:", text.length);
    const data = JSON.parse(text);
    console.log("Successfully parsed JSON. Items:", data.length);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
run();
