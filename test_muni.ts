import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('municipios_dados').select('code_muni, name_muni').limit(5);
  console.log('Error:', error);
  console.log('Data:', data);
  
  const { count } = await supabase.from('municipios_dados').select('*', { count: 'exact', head: true });
  console.log('Total municipalities:', count);
}

test();
