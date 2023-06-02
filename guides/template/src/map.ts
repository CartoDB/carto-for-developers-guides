import maplibregl from 'maplibre-gl';
import { Deck } from '@deck.gl/core/typed';
import { BASEMAP } from '@deck.gl/carto/typed';

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
    layers: []
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
