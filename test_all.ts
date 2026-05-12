import { createClient } from '@supabase/supabase-js';
import * as turf from '@turf/turf';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const start = Date.now();
  console.log('Fetching all...');
  
  const promises = [];
  for (let i = 0; i < 6; i++) {
    promises.push(supabase.from('municipios_dados').select('code_muni, name_muni, abbrev_state, geojson_urbanizacao, geojson_risco').range(i * 1000, i * 1000 + 999));
  }
  
  const results = await Promise.all(promises);
  const data = results.flatMap(r => r.data || []);
  
  console.log('Got rows:', data.length);
  
  let hits = 0;
  const poly = turf.polygon([[[-50, -15], [-50, -14], [-49, -14], [-49, -15], [-50, -15]]]);
  const polyBbox = turf.bbox(poly);

  for (const row of data) {
    if (row.geojson_urbanizacao) {
      try {
        const bbox = turf.bbox(row.geojson_urbanizacao);
        if (bbox[0] <= polyBbox[2] && bbox[2] >= polyBbox[0] &&
            bbox[1] <= polyBbox[3] && bbox[3] >= polyBbox[1]) {
           hits++;
        }
      } catch(e) {}
    }
  }
  
  console.log('Hits bounds:', hits);
  console.log('Time:', Date.now() - start, 'ms');
}

test();
