import { createClient } from '@supabase/supabase-js';
import * as turf from '@turf/turf';

const supabaseUrl = 'https://pnedbwdgcwlicitmfymz.supabase.co';
const supabaseKey = 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const start = Date.now();
  console.log('Fetching 1000 rows...');
  const { data, error } = await supabase.from('municipios_dados').select('code_muni, geojson_urbanizacao').limit(100);
  
  if (data && data.length > 0) {
    const poly = turf.polygon([[[-50, -15], [-50, -14], [-49, -14], [-49, -15], [-50, -15]]]);
    let hits = 0;
    for (const row of data) {
      if (row.geojson_urbanizacao) {
        try {
          // just check if bbox overlaps first
          const bbox = turf.bbox(row.geojson_urbanizacao);
          const polyBbox = turf.bbox(poly);
          if (bbox[0] <= polyBbox[2] && bbox[2] >= polyBbox[0] &&
              bbox[1] <= polyBbox[3] && bbox[3] >= polyBbox[1]) {
             // intersects!
             hits++;
          }
        } catch(e) {}
      }
    }
    console.log('Hits:', hits);
  }
  
  console.log('Time:', Date.now() - start, 'ms');
}

test();
