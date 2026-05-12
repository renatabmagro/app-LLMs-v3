async function run() {
  try {
    const resBacias = await fetch('http://localhost:3000/api/catalog/bacias');
    const bacias = await resBacias.json();
    const doce = bacias.find(b => b.nome_bacia.toLowerCase().includes('paraná'));
    if (!doce) {
      console.log("Doce not found");
      return;
    }
    
    console.log("Found: ", doce.nome_bacia);
    
    // Call IVPC API
    const resIvpc = await fetch('http://localhost:3000/api/analise/ivpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ geoJson: doce.geometria_geojson, estacoes: [] })
    });
    
    if (!resIvpc.ok) {
      console.error("IVPC Error:", await resIvpc.text());
      return;
    }
    
    const ivpcData = await resIvpc.json();
    console.log("Stats:", JSON.stringify(ivpcData.stats, null, 2));

  } catch(e) {
    console.error(e);
  }
}
run();
