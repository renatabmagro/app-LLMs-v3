# IVPC: Testes Conceituais e Semânticos

Este documento define testes conceituais para verificar o comportamento esperado da engine IVPC, os quais garantem aderência às normas metodológicas formais estipuladas.

---

## Teste 1
**Cenário:** Área urbanizada, porém distante da estação (cai no blind spot), mas que não possui população detectada no censo ou manchas demográficas consistentes.
* **Área:** distante; sem população.
* **Resultado Esperado:** 
  - exposição alta
  - sensibilidade baixa
  - **IVPC moderado**

---

## Teste 2
**Cenário:** Área urbanizada com altíssima densidade populacional, localizada próxima a uma estação fluviométrica, possuindo boa cobertura operacional.
* **Área:** urbana; bem monitorada.
* **Resultado Esperado:** 
  - exposição baixa
  - sensibilidade alta
  - **IVPC moderado**

---

## Teste 3
**Cenário:** Área urbanizada, densamente povoada, em mancha de suscetibilidade a inundações, localizando-se além da cobertura dos sensores telemétricos da rede em operação.
* **Área:** urbana; distante; suscetível.
* **Resultado Esperado:** 
  - **IVPC alto**

---

## Teste 4
**Cenário:** Área com alta população e distante do monitoramento, mas localizada em elevação topográfica ou local livre de recorrências e registros de inundação (fora do perigo físico).
* **Área:** fora da máscara física (sem elegibilidade espacial).
* **Resultado Esperado:** 
  - **IVPC inexistente** (zerado/ausente pois não cumpre a elegibilidade na máscara base).
