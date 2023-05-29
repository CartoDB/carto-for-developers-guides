import maplibregl from 'maplibre-gl';
import { Deck } from '@deck.gl/core/typed';
import { BASEMAP, CartoLayer, MAP_TYPES } from '@deck.gl/carto/typed';

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
      // new CartoLayer({
      //   id: 'places',
      //   connection: 'carto_dw',
      //   type: MAP_TYPES.TABLE,
      //   data: 'carto-demo-data.demo_tables.populated_places',
      //   pointRadiusMinPixels: 3,
      //   getFillColor: [200, 0, 80],
      // })
       new CartoLayer({
        connection: 'carto_dw',
        type: MAP_TYPES.TILESET,
        data: 'cartobq.public_account.osm_buildings_tileset',
        //#b0f2bc,#89e8ac,#67dba5,#4cc8a3,#38b2a3,#2c98a0,#257d98
        getFillColor: [18,147,154],
        getLineColor: [241,92,23],
        getLineWidth: 2,
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
