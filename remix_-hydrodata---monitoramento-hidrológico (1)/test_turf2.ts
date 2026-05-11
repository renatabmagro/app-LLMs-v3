import * as turf from '@turf/turf';

function test() {
  const p1 = turf.polygon([[[-50, -15], [-50, -14], [-49, -14], [-49, -15], [-50, -15]]]);
  const p2 = turf.polygon([[[-49.5, -15.5], [-49.5, -14.5], [-48.5, -14.5], [-48.5, -15.5], [-49.5, -15.5]]]);
  
  try {
    const c = turf.intersect(turf.featureCollection([p1, p2]));
    console.log('Intersection 1:', c !== null);
  } catch (e) {
    console.log('Failed 1', e.message);
  }
}

test();
