const shapefile = require('shapefile');
const fs = require('fs').promises;
const path = require('path');

async function convertShapefileToGeoJSON() {
  try {
    const source = path.join(__dirname, '../public/nepal-shp/hermes_NPL_new_wgs_1.shp');
    const output = path.join(__dirname, '../public/nepal-provinces-detailed.json');
    
    const geojson = {
      type: 'FeatureCollection',
      features: []
    };

    await new Promise((resolve, reject) => {
      shapefile.open(source)
        .then(source => source.read()
          .then(function log(result) {
            if (result.done) {
              resolve();
              return;
            }
            geojson.features.push(result.value);
            return source.read().then(log);
          }))
        .catch(error => reject(error));
    });

    // Add project counts to each province (you can modify these numbers)
    geojson.features = geojson.features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        projects: Math.floor(Math.random() * 5) + 2 // Random number between 2 and 6 for demo
      }
    }));

    await fs.writeFile(output, JSON.stringify(geojson, null, 2));
    console.log('Conversion complete! GeoJSON file saved as nepal-provinces-detailed.json');
  } catch (error) {
    console.error('Error converting shapefile:', error);
  }
}

convertShapefileToGeoJSON(); 