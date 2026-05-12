const turf = require('@turf/turf');
const poly1 = turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
const poly2 = turf.polygon([[[131, 0], [131, -50], [144, -50], [144, 0], [131, 0]]]);
console.log("poly1 poly2", turf.intersect(turf.featureCollection([poly1, poly2])));
console.log("poly1, poly2", turf.intersect(poly1, poly2));
