import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('bacias_niveis')
    .select('id, nome_bacia, nivel, codigo_bacia')
    .ilike('nome_bacia', `%para%`)
    .limit(10);
  
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
