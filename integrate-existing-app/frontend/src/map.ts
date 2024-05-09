import maplibregl from 'maplibre-gl'
import { Deck } from '@deck.gl/core'
import {
  BASEMAP,
  vectorQuerySource,
  VectorTileLayer
} from '@deck.gl/carto'

let deckgl: Deck = null
let basemap: any = null

const INITIAL_VIEW_STATE = {
  latitude: 39.8097343,
  longitude: -98.5556199,
  zoom: 4,
  bearing: 0,
}

export function initMap() {
  // Create the Basemap
  basemap = new maplibregl.Map({
    container: 'map',
    style: BASEMAP.VOYAGER,
    center: [-74.5, 40],
    zoom: 9
  })
  // Create an empty deckgl instance
  deckgl = new Deck({
    canvas: 'deck-canvas',
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [],
    onViewStateChange: ({ viewState }) => {
      const { longitude, latitude, ...rest } = viewState;
      basemap.jumpTo({ center: [longitude, latitude], ...rest })
    }
  })
}

export function setLayer(group: string, accessToken: string) {
  const apiBaseUrl = import.meta.env.VITE_CARTO_API_BASE_URL;
  const connectionName = 'carto_dw'
  // Group all authentication properties
  const cartoConfig = {apiBaseUrl, accessToken, connectionName};

  // Create a new CARTO source for the specified group
  const retailStores = vectorQuerySource({
    ...cartoConfig,
    sqlQuery: `SELECT * FROM \`carto-demo-data\`.demo_tables.retail_stores WHERE city = @groupcity`,
    queryParameters: { groupcity: group }
  })

  // Create a new CARTO layer for the specified group
  const retailLayer = new VectorTileLayer({
    id: 'retails',
    data: retailStores,
    pointRadiusMinPixels: 4,
    getFillColor: [200, 0, 80],
  })

  deckgl.setProps({
    layers: [retailLayer],
    onViewStateChange: ({ viewState }) => {
      const { longitude, latitude, ...rest } = viewState;
      basemap.jumpTo({ center: [longitude, latitude], ...rest })
    },
  })
}
