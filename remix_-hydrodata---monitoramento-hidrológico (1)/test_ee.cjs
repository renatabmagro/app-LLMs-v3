const ee = require('@google/earthengine');
const jsonStr = "{\"type\":\"Polygon\",\"coordinates\":[[[-55.9970831,-28.072361299999955],[-56.03133969999993,-27.994390599999917],[-55.92765289999994,-27.90668340000002],[-55.9970831,-28.072361299999955]]]}"; // Fixed to be closed polygon
try {
    const obj = JSON.parse(jsonStr);
    const geom = ee.Geometry(obj);
    console.log("Success");
} catch(e) {
    console.log("Error:", e.message);
}
