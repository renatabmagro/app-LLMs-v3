-- Ativar extensão PostGIS para dados espaciais
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tabela bacias
CREATE TABLE bacias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  geometria JSONB,
  geom GEOMETRY(Polygon, 4326), -- Coluna espacial extra (opcional para uso futuro)
  area_km2 NUMERIC,
  data_extracao TIMESTAMPTZ DEFAULT now()
);

-- Tabela rasters
CREATE TABLE rasters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bacia_id UUID REFERENCES bacias(id) ON DELETE CASCADE,
  tipo_dado TEXT,
  fonte TEXT,
  caminho_url TEXT,
  resolucao NUMERIC
);

-- Tabela analise_ivpc (Resultados do script ETL offline)
CREATE TABLE analise_ivpc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bacia_id UUID UNIQUE REFERENCES bacias(id) ON DELETE CASCADE,
    area_total_km2 NUMERIC,
    area_urbana_risco_km2 NUMERIC,
    area_ponto_cego_km2 NUMERIC,
    porcentagem_risco NUMERIC,
    distancia_max_km NUMERIC,
    asset_id TEXT,
    pop_total_ponto_cego INTEGER,
    pop_idosos_criancas_risco INTEGER,
    indice_infraestrutura NUMERIC,
    ivpc_socioambiental NUMERIC,
    url_asset_mapa_social TEXT,
    data_calculo TIMESTAMPTZ DEFAULT now()
);
