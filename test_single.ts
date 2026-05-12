import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('bacias_niveis')
    .select('id, geom, geojson_bacia, nome_bacia')
    .ilike('nome_bacia', `%para%`)
    .limit(1);
    
  if (data && data.length > 0) {
    const basin = data[0];
    const { data: d2, error: e2 } = await supabase
      .from('bacias_niveis')
      .select('geojson_bacia, geom, nome_bacia')
      .eq('id', basin.id)
      .single();
    console.log("single res:", e2);
    console.log("single data length of geojson string:", JSON.stringify(d2?.geojson_bacia || d2?.geom).length);
  }
}

test();
