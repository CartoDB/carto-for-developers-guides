import DeckMap from './DeckMap'
import { FlyToInterpolator } from '@deck.gl/core'

function getViewState (map) {
  const { latitude, longitude, zoom, pitch, bearing } = map.getViewports()[0]
  return { latitude, longitude, zoom, pitch, bearing }
}

export function getZoom (map) {
  const viewState = getViewState(map)
  return viewState.zoom
}

export function getCenter (map) {
  const viewState = getViewState(map)
  return [viewState.longitude, viewState.latitude]
}

export function zoomIn (map, params = {}) {
  const { duration = 200, speed } = params
  const viewState = getViewState(map)
  map.setProps({
    viewState: {
      ...viewState,
      zoom: viewState.zoom + 1,
      transitionDuration: duration || undefined,
      transitionInterpolator: duration ? new FlyToInterpolator({ speed }) : undefined
    }
  })
}

export function zoomOut (map, params = {}) {
  const { duration = 200, speed } = params
  const viewState = getViewState(map)
  map.setProps({
    viewState: {
      ...viewState,
      zoom: viewState.zoom - 1,
      transitionDuration: duration || undefined,
      transitionInterpolator: duration ? new FlyToInterpolator({ speed }) : undefined
    }
  })
}

export function fitBounds (map, bbox, params = {}) {
  // bbox must be of the shape [[lng1, lat1], [lng2, lat2]]
  // TODO: enforce this shape and throw an error with a invalid one
  const { maxZoom, duration = 200, speed } = params
  const viewport = map.getViewports()[0]
  const { latitude, longitude, zoom } = viewport.fitBounds(bbox)
  const viewState = {
    longitude,
    latitude,
    zoom: maxZoom ? Math.min(maxZoom, zoom) : zoom,
    bearing: viewport.bearing,
    pitch: viewport.pitch,
    transitionDuration: duration || undefined,
    transitionInterpolator: duration ? new FlyToInterpolator({ speed }) : undefined
  }
  map.setProps({ viewState })
}

export function flyTo (map, position, params = {}) {
  const { duration = 200, speed } = params
  const viewState = getViewState(map)
  map.setProps({
    viewState: {
      ...viewState,
      ...position,
      transitionDuration: duration || undefined,
      transitionInterpolator: duration ? new FlyToInterpolator({ speed }) : undefined
    }
  })
}

export function removeMap (map) {
  map.finalize()
}

export function resize () {
  // This is a noop.
  // DeckGL is set to resize automatically when the size of its canvas changes
  // and this update propagates to the mapbox using the code in DeckMap.js
}

export function createMap ({ container, style, initialPosition, onLoad }) {
  const { longitude, latitude, zoom, pitch = 0, bearing = 0 } = initialPosition
  const map = new DeckMap({
    container: `#${container}`,
    mapStyle: style,
    viewState: { longitude, latitude, zoom, pitch, bearing },
    onLoad,
    onViewStateChange: ({ viewState }) => {
      map.setProps({ viewState })
    }
  })

  return map
}

export function createMapConfig () {
  return {}
}

export function getZoomFactor (map) {
  const viewport = map.getViewports()[0]
  return viewport.metersPerPixel
}
