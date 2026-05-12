export function gerarRelatorioIVPC(metricas: any) {
    const { 
        nomeBacia,
        areaTotalKm2, 
        areaUrbanaRiscoKm2, 
        areaPontoCegoKm2, 
        porcentagemRisco, 
        urbanTotalArea = 0,
        urbanMonitoredArea = 0,
        urbanBlindSpotArea = 0,
        urbanEligibleArea = 0,
        distanciaMaxKm,
        popTotalPontoCego,
        popIdososCriancasRisco,
        domSemSaneamento,
        ivpcSocioambiental = 0,
        modoMetodologico = "padrao",
        qtdEstacoes = null,
        mapUrls
    } = metricas;

    const dataAnalise = new Date().toLocaleDateString('pt-BR');
    
    // Tratamento de tipos/nulos
    const percRisco = typeof porcentagemRisco === 'number' ? porcentagemRisco : 0;
    const distMax = typeof distanciaMaxKm === 'number' ? distanciaMaxKm : 0;
    const popTotal = popTotalPontoCego || 0;
    
    const uTotal = typeof urbanTotalArea === 'number' ? urbanTotalArea : 0;
    const uMonitored = typeof urbanMonitoredArea === 'number' ? urbanMonitoredArea : 0;
    const uBlind = typeof urbanBlindSpotArea === 'number' ? urbanBlindSpotArea : 0;
    const uEligible = typeof urbanEligibleArea === 'number' ? urbanEligibleArea : (typeof areaUrbanaRiscoKm2 === 'number' ? areaUrbanaRiscoKm2 : 0);
    
    const ivpcVal = ivpcSocioambiental || 0;
    const percUrbanoVulneravel = uTotal > 0 ? (uEligible / uTotal) * 100 : 0;
    const percUrbanoMonitorado = uTotal > 0 ? (uMonitored / uTotal) * 100 : 0;
    const percUrbanoBlindSpot = uTotal > 0 ? (uBlind / uTotal) * 100 : 0;

    let classeIVPC = "Muito baixo";
    if (ivpcVal >= 0.8) classeIVPC = "Muito alto";
    else if (ivpcVal >= 0.6) classeIVPC = "Alto";
    else if (ivpcVal >= 0.4) classeIVPC = "Moderado";
    else if (ivpcVal >= 0.2) classeIVPC = "Baixo";

    const semIbgeWarning = modoMetodologico === "sem_ibge" 
        ? "> **Atenção:** A análise foi executada sem camadas oficiais IBGE de áreas de risco. Os resultados possuem menor rigor institucional comparativo.\n\n"
        : "";

    let interpretacaoEspacial = "";
    if (ivpcVal > 0.6 && percUrbanoBlindSpot < 20) {
        interpretacaoEspacial = "Embora a área vulnerável no ponto cego seja relativamente pequena, o IVPC elevado indica concentração populacional altamente sensível nestas regiões com deficiência operacional de monitoramento.";
    } else if (ivpcVal > 0.6 && percUrbanoBlindSpot >= 20) {
        interpretacaoEspacial = "A bacia apresenta extensas áreas urbanas vulneráveis e alto IVPC, evidenciando uma coincidência espacial acentuada entre a suscetibilidade física, o distanciamento da rede de alertas e a alta densidade demográfica.";
    } else if (ivpcVal <= 0.3 && percUrbanoBlindSpot >= 30) {
        interpretacaoEspacial = "Existe uma parcela considerável da área urbana com deficiência operacional, no entanto, o baixo valor do IVPC sugere que a sensibilidade populacional nestas áreas periféricas é menor.";
    } else {
        interpretacaoEspacial = "O IVPC calculado reflete a combinação espacial entre as áreas de suscetibilidade física e o grau de deficiência operacional provocado pelo afastamento das estações de monitoramento.";
    }

    let hotspotsTexto = "";
    if (distMax > 30 && popTotal > 1000) {
        hotspotsTexto = "Os maiores valores do IVPC concentram-se em áreas urbanizadas com baixa cobertura hidrológica, distantes a mais de 30 km do monitoramento, onde coexistem alta densidade urbana e histórica suscetibilidade física.";
    } else if (popTotal > 5000) {
        hotspotsTexto = "Identificam-se hotspots espaciais nas zonas de maior adensamento populacional (áreas dasimétricas), que demandam alta prioridade, dada a elevada sensibilidade e a deficiência operacional local.";
    } else {
        hotspotsTexto = "A distribuição espacial do IVPC indica pontos de vulnerabilidade espalhados, condicionados quase que exclusivamente à propagação do déficit de monitoramento.";
    }

    let recomendacoes = "";
    if (distMax > 20) {
        recomendacoes += "- **Cobertura Hidrológica:** Recomenda-se ampliação da cobertura hidrológica nas regiões periféricas da bacia com isolamento de sensores.\n";
    }
    if (popTotal > 1000) {
        recomendacoes += "- **Alerta e Prevenção:** Áreas urbanas densamente ocupadas mapeadas pela dasimetria devem receber prioridade em sistemas locais de alerta hidrológico e planejamento contingencial.\n";
    }
    if (ivpcVal > 0.6) {
        recomendacoes += "- **Mitigação Climática:** Os hotspots espaciais identificados devem ser priorizados em estratégias municipais de adaptação climática e ordenamento territorial para conter vetores de urbanização em zonas de suscetibilidade física.\n";
    }
    if (recomendacoes === "") {
        recomendacoes = "- **Manutenção de Rede:** Recomenda-se a manutenção contínua das estações já existentes e o monitoramento preventivo para assegurar a atual cobertura.\n";
    }

    return `## Diagnóstico Espacial Multicritério de Vulnerabilidade Relativa

### 1. IDENTIFICAÇÃO DA ANÁLISE
- **Bacia Analisada:** ${nomeBacia}
- **Data da Análise:** ${dataAnalise}
- **Área Total:** ${(areaTotalKm2 || 0).toFixed(2)} km²
- **Resolução Espacial Base:** 30 metros
- **Sistema de Referência (CRS):** EPSG:4326
- **Datasets Utilizados:** ESA WorldCover, SRTM, JRC, ANA/CEMADEN, INMET, IBGE

*O IVPC representa um índice espacial multicritério de vulnerabilidade populacional relativa em áreas sujeitas à inundação e com baixa cobertura de monitoramento hidrológico.*

### 2. QUALIDADE E COBERTURA DOS DADOS
${semIbgeWarning}- **Mapeamento Oficial de Assentamentos Previdenciários (IBGE):** ${modoMetodologico === "padrao" ? "Sim" : "Não"}
- **Estações de Monitoramento Consideradas:** ${qtdEstacoes !== null ? qtdEstacoes : "Dados extraídos via API ANA/CEMADEN"}

### 3. COBERTURA HIDROLÓGICA URBANA

| Métrica | Unidade |
| --- | --- |
| Área urbana total | ${uTotal.toFixed(2)} km² |
| Área urbana monitorada | ${uMonitored.toFixed(2)} km² |
| Área urbana blind spot | ${uBlind.toFixed(2)} km² |
| % urbana monitorada | ${percUrbanoMonitorado.toFixed(2)}% |
| % urbana blind spot | ${percUrbanoBlindSpot.toFixed(2)}% |

### 4. COMPONENTES METODOLÓGICOS DO IVPC

**4.1 Suscetibilidade Física**
Representa áreas fisicamente suscetíveis à inundação, determinada por declividade contígua, recorrência histórica (JRC) e bases cartográficas. **O perigo físico NÃO entra diretamente na fórmula matemática do IVPC. Ele atua exclusivamente como filtro espacial de elegibilidade.**

**4.2 Blind Spot Hidrológico**
Representa áreas com deficiência de cobertura hidrológica (distância > 10 km). **O blind spot define a elegibilidade espacial para o cálculo do IVPC, mas não representa sozinho a intensidade da deficiência operacional.**

**4.3 Deficiência Operacional (Exposição Interna)**
Score contínuo normalizado que representa a intensidade relativa da deficiência de monitoramento hidrológico dentro do próprio blind spot. Não é mera distância, é pontuação operacional graduada.

**4.4 Sensibilidade Populacional**
Representa a intensidade populacional espacialmente vulnerável pelo método dasimétrico. **A sensibilidade atual representa sensibilidade populacional espacial, e NÃO vulnerabilidade socioeconômica completa.**

---

### 5. INTERPRETAÇÃO E CLASSIFICAÇÃO GERAL

**Classe de Vulnerabilidade:** \`${classeIVPC}\`

${interpretacaoEspacial}

### 6. MÉTRICAS ANALÍTICAS OBTIDAS (IVPC)

| Métrica | Valor Derivado da Árvore GEE |
|:---|:---|
| **IVPC Médio da Bacia** | ${ivpcVal.toFixed(4)} |
| **Categoria de Vulnerabilidade Associada** | ${classeIVPC} |
| **População Relativa Vulnerável** | ${popTotal.toLocaleString('pt-BR')} hab |
| **Área Urbana Elegível (Vulnerável)** | ${uEligible.toFixed(2)} km² |
| **Proporção Urbana Vulnerável** | ${percUrbanoVulneravel.toFixed(2)}% |
| **Max. Distanciamento Telemétrico** | ${distMax.toFixed(1)} km |

### 7. HOTSPOTS ESPACIAIS E DISTRIBUIÇÃO
${hotspotsTexto}

### 8. LIMITAÇÕES E CONFIABILIDADE CIENTÍFICA
**O IVPC representa vulnerabilidade relativa dentro das condições espaciais analisadas.**

- **O que NÃO representa:** O IVPC NÃO representa probabilidade de inundação, projeção, previsão hidrológica, nem vulnerabilidade social completa e nem risco absoluto.
- **Rigor Censitário Local:** ${modoMetodologico === "sem_ibge" ? "A falta de camadas do IBGE restringe a verificação institucional comparativa explícita de risco clássico." : "As bases oficiais reforçam a validade institucional, porém obedecem janelas decenais de atualização censitária."}
- **Censo de Sensores Hidrológicos:** A inoperância temporária de sensores eleva abruptamente a incerteza locacional, podendo distorcer a deficiência operacional momentaneamente.
- **Modos Analíticos (Em Des.):** Atualmente a normalização reflete "Modo: Local" (contraste interno na bacia), pendente o desenvolvimento da normalização global e comparativa.

### 9. RECOMENDAÇÕES ESTRATÉGICAS
${recomendacoes}
`;
}
