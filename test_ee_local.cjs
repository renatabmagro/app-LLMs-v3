const ee = require('@google/earthengine');
const privateKey = require('./gee-key.json');

ee.data.authenticateViaPrivateKey(privateKey, () => {
  ee.initialize(null, null, async () => {
    try {
      const geoJsonBacia = {
        "type": "Polygon",
        "coordinates": [[[-47.9, -15.8], [-47.9, -15.9], [-47.8, -15.9], [-47.8, -15.8], [-47.9, -15.8]]]
      };
      
      let bacia_geom;
      if (geoJsonBacia) {
        if (geoJsonBacia.type === 'FeatureCollection' && geoJsonBacia.features.length > 0) {
          bacia_geom = ee.Geometry(geoJsonBacia.features[0].geometry || geoJsonBacia.features[0]);
        } else if (geoJsonBacia.geometry) {
          bacia_geom = ee.Geometry(geoJsonBacia.geometry);
        } else {
          bacia_geom = ee.Geometry(geoJsonBacia);
        }
      }
      
      console.log("bacia_geom is ee.Geometry:", bacia_geom instanceof ee.Geometry);
      
      const area_bacia_ee = bacia_geom.area().divide(1e6);
      area_bacia_ee.evaluate((area, err) => {
        if (err) console.error("Error evaluating area:", err);
        else console.log("Area km2:", area);
      });
      
    } catch (e) {
      console.error(e);
    }
  }, (e) => console.error('EE Init Error:', e));
}, (e) => console.error('EE Auth Error:', e));
