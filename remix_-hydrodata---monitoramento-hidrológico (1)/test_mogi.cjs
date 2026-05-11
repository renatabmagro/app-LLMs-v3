const http = require('http');

async function run() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  const { data, error } = await supabase
    .from('bacias_niveis')
    .select('geojson_bacia, nome_bacia')
    .ilike('nome_bacia', '%Mogi%Guaçu%')
    .limit(1)
    .single();

  if (error) {
    // Try Mojiguaçu
    const res2 = await supabase
      .from('bacias_niveis')
      .select('geojson_bacia, nome_bacia')
      .ilike('nome_bacia', '%Mojiguaçu%')
      .limit(1)
      .single();
    if (res2.error) {
       console.error("Not found");
       return;
    }
    await sendReq(res2.data);
  } else {
    await sendReq(data);
  }
}

async function sendReq(data) {
  const baciaPayload = {
    basinName: data.nome_bacia,
    level: 8,
    geoJsonBacia: data.geojson_bacia
  };

  const strPayload = JSON.stringify(baciaPayload);
  console.log("Payload size:", strPayload.length, "bytes", data.nome_bacia);

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
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => console.log('STATUS:', res.statusCode, '\nDATA:', responseData.substring(0, 100)));
  });

  req.on('error', e => console.error(e));
  req.write(strPayload);
  req.end();
}

run();
