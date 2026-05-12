import fetch from 'node-fetch';
import * as turf from '@turf/turf';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ override: true });

async function run() {
  const start = Date.now();
  
  console.log("Fetching bacia Paraná...");
  const resBacias = await fetch('http://localhost:3000/api/catalog/bacias');
  const bacias = await resBacias.json();
  const doce = bacias.find(b => b.nome_bacia.toLowerCase().includes('paraná'));
  let parsedGeoJson = JSON.parse(doce.geometria_geojson);
  let basinPoly = turf.polygon(parsedGeoJson.coordinates);
  let basinBbox = turf.bbox(basinPoly);
  console.log(`Bacia loaded, bbox: ${basinBbox}. Time: ${Date.now() - start}ms`);
  
  console.log("Fetching 1 piece of municipalities...");
  const supabase = createClient(process.env.SUPABASE_URL || 'https://pnedbwdgcwlicitmfymz.supabase.co', process.env.SUPABASE_ANON_KEY || 'sb_publishable_LsKJ_gxuDVpQbh-i5WndqQ_PPyh7cJm');
  
  let sTime = Date.now();
  const { data: munData } = await supabase.from('municipios_dados').select('name_muni, geojson_urbanizacao, geojson_risco').limit(50);
  console.log(`Fetched 50 municipalities in ${Date.now() - sTime}ms. Data size approx: ${JSON.stringify(munData).length} bytes`);
  
  sTime = Date.now();
  let urbFeatures = [];
  for (const row of munData) {
    if (row.geojson_urbanizacao && row.geojson_urbanizacao.features) {
      try {
        const urbBbox = turf.bbox(row.geojson_urbanizacao);
        if (urbBbox[0] <= basinBbox[2] && urbBbox[2] >= basinBbox[0] &&
            urbBbox[1] <= basinBbox[3] && urbBbox[3] >= basinBbox[1]) {
          for (const feat of row.geojson_urbanizacao.features) {
            try {
              const clipped = turf.intersect(turf.featureCollection([basinPoly, feat]));
              if (clipped) urbFeatures.push(clipped);
            } catch(e) {}
          }
        }
      } catch(e) {}
    }
  }
  console.log(`Intersected 50 municipalities in ${Date.now() - sTime}ms.`);
}
run();
