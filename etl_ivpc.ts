import { config } from "dotenv";
config({ override: true });
import { createClient } from '@supabase/supabase-js';
import ee from '@google/earthengine';

// Verificação de ambiente
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error("Faltam variáveis do Supabase no .env");
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Autenticação GEE
const authenticateGEE = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let credentials: any;
    if (process.env.GEE_SERVICE_ACCOUNT_JSON) {
        credentials = JSON.parse(process.env.GEE_SERVICE_ACCOUNT_JSON);
    } else if (process.env.GEE_PRIVATE_KEY && process.env.GEE_CLIENT_EMAIL) {
        credentials = {
            private_key: String(process.env.GEE_PRIVATE_KEY).replace(/\\n/g, '\n'),
            client_email: process.env.GEE_CLIENT_EMAIL,
            project_id: process.env.GEE_PROJECT_ID || ""
        };
    } else {
        return reject("Sem credenciais do GEE");
    }

    ee.data.authenticateViaPrivateKey(
      credentials,
      () => {
        ee.initialize(
          null,
          null,
          () => {
            console.log("✅ GEE Autenticado");
            // Se as credenciais possuírem project_id definido, retornamos.
            resolve(credentials.project_id || "");
          },
          (e: any) => reject(e)
        );
      },
      (err: any) => reject(err)
    );
  });
};

async function runETL() {
  try {
    const projectId = await authenticateGEE();
    
    // 1. Busca bacias no Supabase
    const { data: bacias, error } = await supabase.from('bacias').select('*');
    if (error) throw error;
    
    console.log(`Encontradas ${bacias?.length || 0} bacias para processar.`);

    for (const bacia of bacias || []) {
      console.log(`\nProcessando bacia: ${bacia.nome} (${bacia.id})`);
      
      const geoJson = bacia.geometria;
      if (!geoJson) {
        console.warn(`Bacia ${bacia.id} não possui geometria JSONB registrada.`);
        continue;
      }

      // 2. Extrai geometria e constrói métricas no GEE
      let geometry;
      if (geoJson.features && geoJson.features.length > 0) {
        geometry = ee.Feature(geoJson.features[0]).geometry();
      } else {
        geometry = ee.Geometry(geoJson);
      }

      const BASE_PROJ = ee.Projection('EPSG:4326').atScale(30);

      const worldCover = ee.ImageCollection("ESA/WorldCover/v200").first().select("Map");
      const urbanMask = worldCover.eq(50).selfMask().clip(geometry).reproject(BASE_PROJ);

      const mdt = ee.Image("USGS/SRTMGL1_003").clip(geometry).reproject(BASE_PROJ);
      const slope = ee.Terrain.slope(mdt).reproject(BASE_PROJ);
      const waterOcc = ee.Image("JRC/GSW1_4/GlobalSurfaceWater").select('occurrence').clip(geometry).reproject(BASE_PROJ);
      const floodRiskMask = slope.lt(5).and(waterOcc.gt(0)).reproject(BASE_PROJ);

      const vulMask = urbanMask.and(floodRiskMask).reproject(BASE_PROJ);

      // Distância das estações 
      // OBS: Você pode fazer fetch das estações para a API /api/estacoes ou listar de um banco.
      // Deste script simplificado, consideraremos toda a bacia como ponto cego (exemplo acadêmico) 
      // a menos que você injete as estações fluviométricas da ANA/CEMADEN.
      const distanceImg = ee.Image.constant(50000).clip(geometry).reproject(BASE_PROJ);
      const distanceMask = distanceImg.gt(10000).reproject(BASE_PROJ); 

      // 5. Cruzamento Final (O Indicador IVPC)
      const ivpcMask = vulMask.and(distanceMask).reproject(BASE_PROJ);
      const visualLayer = distanceImg.updateMask(ivpcMask);

      // Métricas Reducer GEE
      const statsScale = 30;
      const pixelAreaKm2 = ee.Image.pixelArea().divide(1e6);
      
      const areaTotal = geometry.area().divide(1e6);
      const areaUrbaF = vulMask.multiply(pixelAreaKm2).reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: geometry,
        scale: statsScale,
        maxPixels: 1e10
      });
      const areaBlindF = ivpcMask.multiply(pixelAreaKm2).reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: geometry,
        scale: statsScale,
        maxPixels: 1e10
      });
      const maxDistF = distanceImg.updateMask(ivpcMask).reduceRegion({
        reducer: ee.Reducer.max(),
        geometry: geometry,
        scale: statsScale,
        maxPixels: 1e10
      });

      // Avaliação Assíncrona
      const combinedStats = ee.Dictionary({
        aT: areaTotal,
        aUF: areaUrbaF.values().get(0),
        aBF: areaBlindF.values().get(0),
        mDF: maxDistF.values().get(0)
      });
      const statsResult = await new Promise<any>((resolve, reject) => combinedStats.evaluate((d: any, e: any) => e ? reject(e) : resolve(d)));

      const areaTotalNum = statsResult.aT || 0;
      const areaUrbNum = statsResult.aUF || 0;
      const areaBlindNum = statsResult.aBF || 0;
      const maxDistNum = statsResult.mDF || 0;
      // Trata number types (podem vir null se a máscara não achar nada)
      const pct = (areaUrbNum as number) > 0 ? ((areaBlindNum as number) / (areaUrbNum as number)) * 100 : 0;

      const assetId = projectId ? `projects/${projectId}/assets/ivpc_bacias/${String(bacia.id).replace(/-/g,'_')}` : `users/SEU-USUARIO/ivpc_bacias/${String(bacia.id).replace(/-/g,'_')}`;

      // 3. Insere/Atualiza no Banco (Supabase)
      const { data: upsertData, error: upsertError } = await supabase.from('analise_ivpc').upsert({
         bacia_id: bacia.id,
         area_total_km2: areaTotalNum,
         area_urbana_risco_km2: areaUrbNum,
         area_ponto_cego_km2: areaBlindNum,
         porcentagem_risco: pct,
         distancia_max_km: (maxDistNum as number)/1000,
         asset_id: assetId
      }, { onConflict: 'bacia_id' });
      
      if (upsertError) {
          console.error("Erro no upsert Supabase:", upsertError.message);
      } else {
          console.log(`✅ Dados salvos no Supabase para a bacia ${bacia.id}`);
      }

      // 4. Inicia Export (Task GEE) to Asset (Para mapa carregar na hora)
      console.log(`Submetendo Export Task para salvar mapa como Asset: ${assetId}`);
      try {
        const boundsData = await new Promise<any>((resolve, reject) => geometry.bounds().evaluate((d: any, e: any) => e ? reject(e) : resolve(d)));
        const coords = boundsData.coordinates;

        // O pacote ee JS suporta Export através de chamadas ee.batch 
        ee.batch.Export.image.toAsset({
          image: visualLayer.toFloat(), // Converter para FLOAT para evitar erro de casting nas bandas
          description: 'exportar_ivpc_' + String(bacia.id).replace(/-/g,'_'),
          assetId: assetId,
          region: coords,
          scale: 30, // escala boa para mapas base
          maxPixels: 1e13
        });
        
        console.log(`✅ Task de expotação submetida com sucesso! (Acompanhe em https://code.earthengine.google.com/tasks)`);
      } catch (exportErr: any) {
        console.warn(`Atenção: Houve erro para submeter a tarefa GEE (${exportErr.message}). O diretório publico Assets pode não existir ou o EE NodeJS Batch pode requerer adaptação.`);
      }
    }
    
    console.log("\\n🎉 ETL Concluído!");
    process.exit(0);

  } catch (globalErr) {
    console.error("Erro Fatal no ETL:", globalErr);
    process.exit(1);
  }
}

runETL();
