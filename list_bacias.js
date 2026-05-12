async function run() {
  try {
    const resBacias = await fetch('http://localhost:3000/api/catalog/bacias');
    const bacias = await resBacias.json();
    console.log("Bacias available:", bacias.map(b => b.nome_bacia));
  } catch(e) {
    console.error(e);
  }
}
run();
