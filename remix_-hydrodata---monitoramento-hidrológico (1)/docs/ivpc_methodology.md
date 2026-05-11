# Metodologia do Índice de Vulnerabilidade Populacional e Cobertura (IVPC)

## 1. Definição Formal do IVPC

O IVPC representa um índice espacial multicritério de vulnerabilidade populacional relativa em áreas sujeitas à inundação e com baixa cobertura de monitoramento hidrológico.

## 2. O que o IVPC NÃO representa

O IVPC NÃO representa:
- probabilidade de inundação;
- previsão hidrológica;
- risco absoluto;
- vulnerabilidade social completa.

## 3. Definição dos Componentes

### 3.1 Perigo Físico

Representa áreas fisicamente suscetíveis à inundação.

**Especificação técnica:** Considera métricas topográficas e históricas como declividade, recorrência histórica (JRC) e bases cartográficas de áreas de risco.

**REGRA OBRIGATÓRIA:**
O perigo físico NÃO entra diretamente na fórmula do IVPC.
Ele atua exclusivamente como filtro espacial de elegibilidade.

### 3.2 Blind Spot Hidrológico

Representa áreas com deficiência de cobertura hidrológica.

**Especificação técnica:** Áreas com distância contínua igual ou superior a 10 km das estações, representando ausência operacional de monitoramento hidrológico em tempo real.

**REGRA OBRIGATÓRIA:**
O blind spot define elegibilidade espacial para o cálculo do IVPC, mas não representa sozinho a intensidade da exposição.

### 3.3 Exposição

Representa a intensidade relativa da deficiência de monitoramento hidrológico.

**REGRA OBRIGATÓRIA:**
Exposição NÃO é distância bruta.
Exposição é um score normalizado derivado da distância às estações.

### 3.4 Sensibilidade

Representa a intensidade populacional espacialmente vulnerável.

**REGRA OBRIGATÓRIA:**
A sensibilidade atual representa sensibilidade populacional espacial, e NÃO vulnerabilidade socioeconômica completa.

## 4. Estrutura da Engine

### Bloco 1 - Elegibilidade Espacial
O universo espacial elegível (máscara do IVPC) é determinado pela intersecção do perigo físico com o blind spot hidrológico.

### Bloco 2 - Exposição
A exposição é computada via normalização contínua da distância dentro do universo elegível para representar a intensidade operacional relativa do déficit de monitoramento.

### Bloco 3 - Sensibilidade
Score da população redistribuída espacialmente no universo da mancha urbana, permanecendo normalizada independente de limites de classes engessados.

### Bloco 4 - Score Final IVPC
O IVPC utiliza na sua formulação a exposição e a sensibilidade, apenas dentro do universo elegível, para asseguração do gradiente de criticidade populacional perante a deficiência tecnológica.
