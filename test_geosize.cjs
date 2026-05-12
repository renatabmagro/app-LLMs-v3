const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase
    .from('bacias_niveis')
    .select('nome_bacia, geojson_bacia')
    .ilike('nome_bacia', '%Mogi%Guaçu%')
    .limit(1)
    .single();
    
    console.log(data.nome_bacia);
    console.log(JSON.stringify(data.geojson_bacia).length);
    console.log(data.geojson_bacia.type);
}
run();
