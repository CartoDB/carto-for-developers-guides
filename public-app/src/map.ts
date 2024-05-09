import maplibregl from 'maplibre-gl';
import { Deck } from '@deck.gl/core';
import {
  BASEMAP,
  vectorTableSource,
  VectorTileLayer,
} from '@deck.gl/carto';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN;
const connectionName = 'carto_dw';
const cartoConfig = {apiBaseUrl, accessToken, connectionName};

export function createMap() {
  const INITIAL_VIEW_STATE = {
    latitude: 39.8097343,
    longitude: -98.5556199,
    zoom: 4,
    bearing: 0,
    pitch: 30
  };

  const demoTableSource = vectorTableSource({
    ...cartoConfig,
    tableName: 'carto-demo-data.demo_tables.populated_places'
  });

  const deck = new Deck({
    canvas: 'deck-canvas',
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [
      new VectorTileLayer({
        id: 'places',
        data: demoTableSource,
        pointRadiusMinPixels: 3,
        getFillColor: [200, 0, 80],
      })
    ]
  })

  // Add basemap
  const map = new maplibregl.Map({container: 'map', style: BASEMAP.VOYAGER, interactive: false});
  deck.setProps({
    onViewStateChange: ({viewState}) => {
      const {longitude, latitude, ...rest} = viewState;
      map.jumpTo({center: [longitude, latitude], ...rest});
    }
  });
}
