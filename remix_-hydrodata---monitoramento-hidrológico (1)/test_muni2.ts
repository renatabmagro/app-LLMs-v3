import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('municipios_dados').select('geojson_urbanizacao').not('geojson_urbanizacao', 'is', null).limit(1);
  console.log('Error:', error);
  console.log('Sample format:', JSON.stringify(data?.[0]?.geojson_urbanizacao).substring(0, 300));
}

test();
