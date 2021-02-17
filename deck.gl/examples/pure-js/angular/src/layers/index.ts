import { CartoSQLLayer, CartoBQTilerLayer, colorCategories, colorContinuous } from '@deck.gl/carto';
import { GeoJsonLayer } from '@deck.gl/layers';

export function sqlLayer(props: {}) {
  return new CartoSQLLayer({
    id: 'sql-airports',
    data: 'SELECT cartodb_id, the_geom_webmercator, scalerank FROM ne_10m_railroads_public',
    binary: true,
    pickable: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getLineColor: colorContinuous({
      attr: 'scalerank',
      domain: [1, 2, 3, 4, 5, 10],
      colors: 'BluYl'
    }),
    getLineWidth: (f: any) => f.properties.scalerank,
    autoHighlight: true,
    highlightColor: [0, 255, 0],
    ...props
  });
}

export function bigQueryLayer(props: {}) {
  return new CartoBQTilerLayer({
    id: 'bigquery-taxis',
    data: 'cartobq.maps.msft_buildings',
    binary: true,
    pointRadiusUnits: 'pixels',
    getFillColor: [240, 142, 240],
    getFileColor: [240, 142, 240],
    ...props
  });
}

const GEOJSON_ENDPOINT = 'https://public.carto.com/api/v2/sql?q=SELECT * FROM retail_stores&format=geojson';
let geojsonData: { features: [] } | null = null;

export async function geoJsonLayer(props: {}) {
  if (!geojsonData) {
    try {
      const response = await fetch(GEOJSON_ENDPOINT);
      geojsonData = await response.json();
    } catch(err) {
      throw new Error(`Something went wrong: ${err}`);
    }
  }

  return new GeoJsonLayer({
    id: 'geojson-stores',
    data: geojsonData?.features,
    binary: true,
    pointRadiusUnits: 'pixels',
    lineWidthUnits: 'pixels',
    pickable: true,
    getFillColor: colorCategories({
      attr: 'storetype',
      domain: ['Supermarket', 'Discount Store', 'Hypermarket', 'Drugstore', 'Department Store'],
      colors: 'Pastel'
    }),
    getLineColor: [0, 0, 0, 100],
    getRadius: 3,
    autoHighlight: true,
    highlightColor: [0, 255, 0],
    ...props
  });
}

