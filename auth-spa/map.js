
import maplibregl from 'maplibre-gl';
import { Deck } from '@deck.gl/core';
import { CartoLayer, MAP_TYPES, setDefaultCredentials } from '@deck.gl/carto';

export function createMap(accessToken) {
  const INITIAL_VIEW_STATE = {
    latitude: 39.8097343,
    longitude: -98.5556199,
    zoom: 4,
    bearing: 0,
    pitch: 30
  };

  setDefaultCredentials({
    apiBaseUrl: 'https://gcp-us-east1.api.carto.com',
    accessToken
  })

  const deck = new Deck({
    canvas: 'deck-canvas',
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [ 
      new CartoLayer({
        connection: 'carto_dw',
        type: MAP_TYPES.TABLE,
        data: 'cartobq.public_account.populated_places',
        pointRadiusMinPixels: 2,
        getFillColor: [200, 0, 80]
      })
    ]
  })

  // Add basemap
  const MAP_STYLE ='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  const map = new maplibregl.Map({container: 'map', style: MAP_STYLE, interactive: false});
  deck.setProps({
    onViewStateChange: ({viewState}) => {
      const {longitude, latitude, ...rest} = viewState;
      map.jumpTo({center: [longitude, latitude], ...rest});
    }
  });
}

