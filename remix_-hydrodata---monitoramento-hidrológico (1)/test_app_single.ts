import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('bacias_niveis')
    .select('id, nome_bacia, nivel, codigo_bacia')
    .eq('nivel', 'Nivel 5')
    .limit(10);
  
  if (data && data.length > 0) {
    const sug = data[0];
    const { data: d2, error: e2 } = await supabase
      .from('bacias_niveis')
      .select('geojson_bacia, nome_bacia')
      .eq('id', sug.id)
      .single();
    if (e2 || !d2) {
      console.log("Error querying by ID:", e2);
    } else {
      console.log("Success! geojson_bacia type:", d2.geojson_bacia?.type);
    }
  }
}

test();
