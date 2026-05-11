const http = require('http');

async function run() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  const { data } = await supabase
    .from('bacias_niveis')
    .select('nome_bacia, geojson_bacia')
    .ilike('nome_bacia', '%Mogi%Guaçu%')
    .limit(1)
    .single();

  const reqPayload = JSON.stringify({
    geoJson: data.geojson_bacia,
    startDate: "2022-01-01",
    endDate: "2023-01-01"
  });

  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/timeseries',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(reqPayload)
    }
  }, (res) => {
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => console.log('STATUS:', res.statusCode, '\nDATA:', responseData.substring(0, 100)));
  });

  req.on('error', e => console.error(e));
  req.write(reqPayload);
  req.end();
}

run();
