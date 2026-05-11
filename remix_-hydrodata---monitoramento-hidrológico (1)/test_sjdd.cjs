const http = require('http');

async function run() {
  // First, fetch the basin info from supabase to get the exact data
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  const { data, error } = await supabase
    .from('bacias_niveis')
    .select('geojson_bacia, nome_bacia')
    .ilike('nome_bacia', '%São José dos Dourados%')
    .limit(1)
    .single();

  if (error) {
    console.error("Supabase Error:", error);
    return;
  }

  const baciaPayload = {
    basinName: data.nome_bacia,
    level: 8,
    geoJsonBacia: data.geojson_bacia
  };

  const strPayload = JSON.stringify(baciaPayload);
  console.log("Payload size:", strPayload.length, "bytes");

  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/extract',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(strPayload)
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('STATUS:', res.statusCode, '\nDATA:', data.substring(0, 100)));
  });

  req.on('error', e => console.error(e));
  req.write(strPayload);
  req.end();
}

run();
