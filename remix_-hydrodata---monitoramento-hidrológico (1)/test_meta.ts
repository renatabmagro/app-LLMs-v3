import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const start = Date.now();
  const { data, error } = await supabase.from('municipios_dados').select('code_muni, name_muni, abbrev_state, area_urbanizada_km2, area_risco_km2, populacao_2022').limit(10);
  console.log('Error:', error);
  console.log('Got', data?.length, 'rows');
  const str = JSON.stringify(data);
  console.log('Sample format:', str);
}

test();
