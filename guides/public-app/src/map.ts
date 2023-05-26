import maplibregl from 'maplibre-gl';
import { Deck } from '@deck.gl/core/typed';
import {
  BASEMAP,
  CartoLayer,
  setDefaultCredentials,
  MAP_TYPES
} from '@deck.gl/carto/typed';

const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN
setDefaultCredentials({
  // API Base URL (copy this from CARTO Workspace -> Developers)
  apiBaseUrl: 'https://gcp-us-east1.api.carto.com',
  accessToken
})

export function createMap() {
  const INITIAL_VIEW_STATE = {
    latitude: 39.8097343,
    longitude: -98.5556199,
    zoom: 4,
    bearing: 0,
    pitch: 30
  };

  const deck = new Deck({
    canvas: 'deck-canvas',
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [
      new CartoLayer({
        id: 'places',
        connection: 'carto_dw',
        type: MAP_TYPES.TABLE,
        data: 'carto-demo-data.demo_tables.populated_places',
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