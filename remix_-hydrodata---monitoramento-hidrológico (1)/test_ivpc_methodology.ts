import * as ee from '@google/earthengine';
import { readFileSync } from 'fs';

let isGeeAuthenticated = false;

async function authenticateGee() {
  return new Promise<void>((resolve, reject) => {
    try {
      const gKey = JSON.parse(readFileSync('./google-maps-service-account.json', 'utf8'));
      ee.data.authenticateViaPrivateKey(
        gKey,
        () => {
          ee.initialize(
            null,
            null,
            () => {
              isGeeAuthenticated = true;
              console.log("✅ GEE Authenticated Locally.");
              resolve();
            },
            (e: any) => reject(e)
          );
        },
        (e: any) => reject(e)
      );
    } catch(e) {
      console.log("No google-maps-service-account.json found. Tests will skip or fail if auth is required.");
      resolve();
    }
  });
}

// Helpers
function evaluateImg(img: any): Promise<any> {
    return new Promise((resolve, reject) => {
        img.evaluate((val: any, err: any) => {
            if (err) reject(err);
            else resolve(val);
        });
    });
}

async function runTests() {
  await authenticateGee();
  if (!isGeeAuthenticated) {
    console.error("❌ Cannot run GEE tests without credentials.");
    return;
  }

  console.log("\n=== ETAPA 1: Testes do Pilar A (Perigo físico) ===");
  // 1.1 Teste de declividade
  // Raster sintético A=2, B=4.9, C=5.0, D=8
  const slopeImg = ee.Image.constant(ee.Array([
    [2, 4.9],
    [5.0, 8]
  ]));
  const declividadeMask = slopeImg.lt(5);
  const res1_1 = await evaluateImg(declividadeMask);
  console.log("1.1 Declividade < 5%:", res1_1[0][0] === 1 && res1_1[0][1] === 1 && res1_1[1][0] === 0 && res1_1[1][1] === 0 ? "✅ PASSED" : "❌ FAILED", res1_1);

  // 1.2 Teste da inundação histórica
  const jrcImg = ee.Image.constant(ee.Array([
    [1, 1],
    [0, 0]
  ]));
  const jrcMask = jrcImg.gt(0);
  const res1_2 = await evaluateImg(jrcMask);
  console.log("1.2 Inundação JRC:", res1_2[0][0] === 1 && res1_1[0][1] === 1 ? "✅ PASSED" : "❌ FAILED");

  // 1.3 Teste de interseção lógica (Perigo = Slope AND JRC AND Risco)
  const slopeMaskImg = ee.Image.constant(ee.Array([
    [1, 1],
    [1, 0]
  ]));
  const jrcMaskImg = ee.Image.constant(ee.Array([
    [1, 1],
    [0, 1]
  ]));
  const riscoMaskImg = ee.Image.constant(ee.Array([
    [1, 0],
    [1, 1]
  ]));
  const perigoMask = slopeMaskImg.and(jrcMaskImg).and(riscoMaskImg);
  const res1_3 = await evaluateImg(perigoMask);
  // Esperado: A(1,1,1)=1; B(1,1,0)=0; C(1,0,1)=0; D(0,1,1)=0
  const passed1_3 = res1_3[0][0] === 1 && res1_3[0][1] === 0 && res1_3[1][0] === 0 && res1_3[1][1] === 0;
  console.log("1.3 Interseção Perigo (AND):", passed1_3 ? "✅ PASSED" : "❌ FAILED", res1_3);

  console.log("\n=== ETAPA 2: Testes da Máscara de Distância ===");
  // 2.1 Teste de cálculo de distância (Ponto cego > 10km)
  const distImg = ee.Image.constant(ee.Array([
    [5000, 10000],
    [15000, 20000]
  ]));
  const pontoCegoMask = distImg.gt(10000);
  const res2_1 = await evaluateImg(pontoCegoMask);
  // Esperado: 5=0, 10=0, 15=1, 20=1
  const passed2_1 = res2_1[0][0] === 0 && res2_1[0][1] === 0 && res2_1[1][0] === 1 && res2_1[1][1] === 1;
  console.log("2.1 Ponto Cego (>10km):", passed2_1 ? "✅ PASSED" : "❌ FAILED");

  // 2.3 Área de alerta final
  const perigoImg2 = ee.Image.constant(ee.Array([[1, 1], [0, 0]]));
  const cegoImg2 = ee.Image.constant(ee.Array([[1, 0], [1, 0]]));
  const alertaMask = perigoImg2.and(cegoImg2);
  const res2_3 = await evaluateImg(alertaMask);
  const passed2_3 = res2_3[0][0] === 1 && res2_3[0][1] === 0 && res2_3[1][0] === 0;
  console.log("2.3 Alerta Final (Perigo AND Cego):", passed2_3 ? "✅ PASSED" : "❌ FAILED");

  console.log("\n=== ETAPA 3: Testes da Dasimetria ===");
  // 3.1 & 3.2 built-up filter
  const esaImg = ee.Image.constant(ee.Array([[50, 10], [80, 50]]));
  const builtUp = esaImg.eq(50);
  const rawPop = ee.Image.constant(ee.Array([[100, 100], [100, 100]]));
  const popFiltered = rawPop.updateMask(builtUp);
  const res3_1 = await evaluateImg(popFiltered);
  const resBuiltUp = await evaluateImg(builtUp);
  const passed3_1 = resBuiltUp[0][0] === 1 && resBuiltUp[0][1] === 0 && resBuiltUp[1][0] === 0 && resBuiltUp[1][1]===1;
  console.log("3.1 Filtragem Built-Up ESA (apenas eq 50):", passed3_1 ? "✅ PASSED" : "❌ FAILED");

  console.log("\n=== ETAPA 4: Testes do cálculo do IVPC ===");
  // 4.1 Exposição
  const distExpImg = ee.Image.constant(ee.Array([[10000, 15000], [20000, 30000]]));
  const expScore = distExpImg.clamp(10000, 30000).subtract(10000).divide(20000);
  const res4_1 = await evaluateImg(expScore);
  const passed4_1 = res4_1[0][0] === 0 && res4_1[1][0] === 0.5 && res4_1[1][1] === 1.0;
  console.log("4.1 Exposição Score (10km=0, 20=0.5, 30=1):", passed4_1 ? "✅ PASSED" : "❌ FAILED");

  // 4.2 Sensibilidade
  const popImg = ee.Image.constant(ee.Array([[0, 10], [20, 30]]));
  const sensScore = popImg.clamp(0, 20).divide(20);
  const res4_2 = await evaluateImg(sensScore);
  const passed4_2 = res4_2[0][0] === 0 && res4_2[0][1] === 0.5 && res4_2[1][0] === 1.0 && res4_2[1][1] === 1.0;
  console.log("4.2 Sensibilidade Score (0=0, 10=0.5, >=20=1):", passed4_2 ? "✅ PASSED" : "❌ FAILED");

  // 4.3 IVPC Fórmula
  const expImg = ee.Image.constant(ee.Array([[0, 1], [0, 1]]));
  const sImg = ee.Image.constant(ee.Array([[0, 0], [1, 1]]));
  const ivpcImg = expImg.multiply(0.5).add(sImg.multiply(0.5));
  const res4_3 = await evaluateImg(ivpcImg);
  const passed4_3 = res4_3[0][0] === 0 && res4_3[0][1] === 0.5 && res4_3[1][0] === 0.5 && res4_3[1][1] === 1.0;
  console.log("4.3 Fórmula do Índice (0.5 Exp + 0.5 Sens):", passed4_3 ? "✅ PASSED" : "❌ FAILED");

  console.log("\n=== TEST SUITE COMPLETED ===");
  process.exit(0);
}

runTests();
