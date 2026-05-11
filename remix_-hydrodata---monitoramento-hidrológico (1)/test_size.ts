import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const start = Date.now();
  const { data, error } = await supabase.from('municipios_dados').select('code_muni, name_muni, geojson_urbanizacao, geojson_risco');
  console.log('Error:', error);
  console.log('Got', data?.length, 'rows');
  const str = JSON.stringify(data);
  console.log('Size:', (str.length / 1024 / 1024).toFixed(2), 'MB');
  console.log('Time:', Date.now() - start, 'ms');
}

test();
