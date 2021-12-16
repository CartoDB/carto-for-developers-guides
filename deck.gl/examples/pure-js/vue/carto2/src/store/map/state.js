/**
 *  State module file
**/
import { BASEMAP } from '@deck.gl/carto'

export const initialViewState = () => ({
  longitude: -97.2,
  latitude: 44.33,
  zoom: 3,
})

export const state = {
  credentials: {
    username: 'public',
    apiKey: 'default_public'
  },
  basemap: BASEMAP.VOYAGER,
  mapLoaded: false,
  viewState: initialViewState(),
  viewportFeatures: []
}
