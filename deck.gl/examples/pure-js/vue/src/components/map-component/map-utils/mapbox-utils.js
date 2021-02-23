import mapbox from 'mapbox-gl'

export function zoomIn (map, params) {
  map.zoomIn(params)
}

export function zoomOut (map, params) {
  map.zoomOut(params)
}

export function removeMap (map) {
  map.remove()
}

export function fitBounds (map, position) {
  map.fitBounds(position)
}

export function flyTo (map, position) {
  map.flyTo(position)
}

export function resize (map) {
  const inc = 20
  let i = 0
  const si = window.setInterval(() => {
    i += inc
    map.resize()
    if (i >= 250) {
      window.clearInterval(si)
    }
  }, inc)
}

export function createMap ({ container, style, initialPosition, onLoad }) {
  const { longitude, latitude, zoom, pitch = 0, bearing = 0 } = initialPosition
  const map = new mapbox.Map({
    container,
    style,
    center: [longitude, latitude],
    zoom,
    pitch,
    bearing
  })

  map.on('load', () => onLoad(map))

  return map
}

export function createMapConfig () {
  const popup = new mapbox.Popup({
    closeOnClick: false,
    closeButton: false,
    offset: 8
  })

  return { popup }
}
