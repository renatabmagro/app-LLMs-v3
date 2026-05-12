import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { count } = await supabase.from('municipios_dados').select('*', { count: 'exact', head: true }).not('geojson_urbanizacao', 'is', null);
  console.log('Total municipalities with urban geojson:', count);
  const { count: count2 } = await supabase.from('municipios_dados').select('*', { count: 'exact', head: true }).not('geojson_risco', 'is', null);
  console.log('Total municipalities with risk geojson:', count2);
}

test();
