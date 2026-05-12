async function run() {
  const resBacias = await fetch('http://localhost:3000/api/catalog/bacias');
  const bacias = await resBacias.json();
  const doce = bacias.find(b => b.nome_bacia.toLowerCase().includes('paraná'));
  console.log("Type of doce.geometria_geojson:", typeof doce.geometria_geojson);
  let parsed = doce.geometria_geojson;
  let iters = 0;
  while(typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
      iters++;
    } catch(e) {
      console.log("Parse error after", iters, "iters: ", e.message);
      break;
    }
  }
  console.log("Final type:", typeof parsed);
  if (typeof parsed === 'object') {
     console.log("Keys:", Object.keys(parsed));
  }
}
run();
