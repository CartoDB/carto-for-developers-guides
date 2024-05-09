import maplibregl from 'maplibre-gl';
import { Deck } from '@deck.gl/core';
import { BASEMAP, vectorTableSource, VectorTileLayer } from '@deck.gl/carto';

interface createMapProps {
  apiBaseUrl: string,
  accessToken: string
}
export function createMap({apiBaseUrl, accessToken}:createMapProps) {
  const connectionName = "carto_dw";
  const cartoConfig = {apiBaseUrl, accessToken, connectionName};


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
  const map = new maplibregl.Map({container: 'map', style: BASEMAP.POSITRON, interactive: false});
  deck.setProps({
    onViewStateChange: ({viewState}) => {
      const {longitude, latitude, ...rest} = viewState;
      map.jumpTo({center: [longitude, latitude], ...rest});
    }
  });
}
