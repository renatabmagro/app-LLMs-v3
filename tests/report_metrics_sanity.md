# IVPC: Testes de Sanidade de Métricas do Relatório

Este documento descreve testes essenciais de sanidade estatística para garantir consistência metodológica entre o universo dasimétrico urbano e os filtros estabelecidos na formulação do Índice de Vulnerabilidade Populacional e Cobertura (IVPC).

---

## Teste 1: Coerência Urbana
**Objetivo:** Validar que a área cega não ocupa 100% da métrica quando há estações e zonas urbanas monitoradas na bacia.
**Condição do Teste:** Bacia contendo ao menos uma estação hidrológica e áreas urbanas contíguas num raio < 10 km.
**Esperado:**
- As áreas em `$urbanBlindSpotArea` não devem abarcar toda a área de `$urbanTotalArea`.
- `% urbana blind spot (urbanBlindPercent)` < `100%`.

---

## Teste 2: Consistência das Áreas (Soma Integral)
**Objetivo:** Validar a preservação volumétrica do universo censitário ou dasimétrico na soma dos focos.
**Equação a validar:**
`urbanMonitoredArea` + `urbanBlindSpotArea` ≈ `urbanTotalArea`
**Critério de Sucesso:**
- Erro máximo/tolerância percentual de rasterização: `1%`
- Qualquer divergência maior indica possível falha nos limiares arbitrários ou resolução do `reduceRegion`.

---

## Teste 3: Consistência Visual
**Objetivo:** Cruzamento e coerência de verossimilhança fotográfica com métricas computadas.
**Procedimento:**
- Comparar os polígonos representativos do raster `builtUp` (Base Urbana total).
- Sobrepor a camada mascarada resultante de `blindSpotMask` (Área Cega).
- Conferir se os indicadores quantitativos retornados representam condizentemente as machas coloridas de exposição do mapa interativo.

---

## Teste 4: Validação Semântica Global vs IVPC
**Objetivo:** Impedir inferências superestimadas de risco que reportavam as máscaras restritivas de suscetibilidade (IVPC) como o universo de moradores da bacia inteira.
**Verificações:**
1. Variáveis descritivas globais do relatório (ex: área urbana afetada, ausência de monitoramento urbana) utilizarão apenas denominadores de escopo total irrestrito (a própria `urbanTotalArea`).
2. Variáveis intrinsecamente metodológicas de Risco deverão usar explicitamente o universo de perigo (`urbanEligibleArea`), sem mascarar os valores base, apresentando restritividade apenas na formulação das frações analíticas.
