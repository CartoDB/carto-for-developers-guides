/**
 *  State module file
**/

export const initialViewState = () => ({
  longitude: -97.2,
  latitude: 44.33,
  zoom: 3,
})

export const state = {
  mapLoaded: false,
  viewState: initialViewState(),
  viewportFeatures: []
}
