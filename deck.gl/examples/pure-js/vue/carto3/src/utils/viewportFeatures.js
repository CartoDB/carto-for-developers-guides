import { WebMercatorViewport } from '@deck.gl/core'
import bboxPolygon from '@turf/bbox-polygon'
import intersects from '@turf/boolean-intersects'

export const viewportFeaturesFunctions = {
  compute(viewState, features) {
    const viewport = getViewport(viewState)
    return features.filter((f) => intersects(f, viewport))
  }
}

function getViewport(viewState) {
  const bounds = new WebMercatorViewport(viewState).getBounds()
  return bboxPolygon(bounds)
}
