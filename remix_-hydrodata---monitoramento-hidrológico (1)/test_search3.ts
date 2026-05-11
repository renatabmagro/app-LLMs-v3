import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.rpc('unaccent', { text: 'Paraíba' });
  console.log("unaccent error:", error);
  console.log("unaccent data:", data);
}

test();
