import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('bacias_niveis').select('id, geom, geojson_bacia').limit(1);
  console.log("error:", error);
  console.log("geom is string:", typeof data[0].geom === 'string', data[0].geom.type);
  console.log("geojson_bacia is string:", typeof data[0].geojson_bacia === 'string', data[0].geojson_bacia?.type);
}

test();
