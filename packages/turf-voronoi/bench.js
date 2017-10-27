import Benchmark from 'benchmark';
import path from 'path';
import fs from 'fs';
import load from 'load-json-file';
import voronoi from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 * ninepoints x 18,507 ops/sec ±1.68% (86 runs sampled)
 * simple x 122,562 ops/sec ±2.66% (83 runs sampled)
 */
const suite = new Benchmark.Suite('turf-voronoi');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => voronoi(geojson, geojson.features[0].properties.bbox));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
