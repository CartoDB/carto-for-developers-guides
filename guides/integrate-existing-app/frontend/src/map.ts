import maplibregl from 'maplibre-gl'
import { Deck } from '@deck.gl/core/typed'
import {
    BASEMAP,
    CartoLayer,
    setDefaultCredentials,
    MAP_TYPES
} from '@deck.gl/carto/typed'

let deckgl: Deck | null = null
let basemap: any = null

const INITIAL_VIEW_STATE = {
    latitude: 39.8097343,
    longitude: -98.5556199,
    zoom: 4,
    bearing: 0,
}

function initBasemap() {
    return new maplibregl.Map({
        container: 'map',
        style: BASEMAP.VOYAGER,
        center: [-74.5, 40],
        zoom: 9
    })
}

function setLayer(layer: CartoLayer[]) {
    deckgl.setProps({
        layers: layer,
        onViewStateChange: ({ viewState }) => {
            const { longitude, latitude, ...rest } = viewState;
            basemap.jumpTo({ center: [longitude, latitude], ...rest })
        },
    })
}

export function initMap() {
    if (deckgl === null) {
        basemap = initBasemap();
        deckgl = new Deck({
            canvas: 'deck-canvas',
            initialViewState: INITIAL_VIEW_STATE,
            controller: true,
            layers: []
        })
    }
    
   setLayer([]);
}

export function createMap(city: string, accessToken: string) {
    const apiBaseUrl = import.meta.env.VITE_CARTO_API_BASE_URL;
    setDefaultCredentials({ apiBaseUrl, accessToken });
    
    const retailLayer = new CartoLayer({
        id: 'retails',
        connection: 'carto_dw',
        type: MAP_TYPES.QUERY,
        data: `SELECT * FROM \`carto-demo-data\`.demo_tables.retail_stores WHERE city = '${city}'`,
        pointRadiusMinPixels: 4,
        getFillColor: [200, 0, 80],
    })

    setLayer([retailLayer])
}
