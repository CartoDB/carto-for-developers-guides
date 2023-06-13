import maplibregl from 'maplibre-gl'
import { Deck } from '@deck.gl/core/typed'
import {
    BASEMAP,
    CartoLayer,
    setDefaultCredentials,
    MAP_TYPES,
    colorBins
} from '@deck.gl/carto/typed'

let deckgl: Deck = null
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

export function createMap(city: string, token: string, isAdmin: boolean) {
    setDefaultCredentials({
        apiBaseUrl: 'PUT_YOUR_API_BASE_URL_HERE',
        accessToken: token
    })
    const layers = []
    const retailLayer = new CartoLayer({
        id: 'retails',
        connection: 'carto_dw',
        type: MAP_TYPES.QUERY,
        data: `SELECT * FROM \`carto-demo-data\`.demo_tables.retail_stores WHERE city = '${city}'`,
        pointRadiusMinPixels: 4,
        getFillColor: [200, 0, 80],
    })
    layers.push(retailLayer)

    if (isAdmin) {
        const sociodemoLayer = new CartoLayer({
            id: 'sociodemo',
            connection: 'carto_dw',
            type: MAP_TYPES.TILESET,
            data: `carto-demo-data.demo_tilesets.sociodemographics_usa_blockgroup`,
            getFillColor: colorBins({
                attr: "total_pop",
                domain: [10, 1e2, 1e3, 1e4, 1e5, 1e6],
                colors: "Temps"
              }),
            pointRadiusMinPixels: 2,
            stroked: false
        })
        layers.unshift(sociodemoLayer)
    }

    setLayer(layers)
}