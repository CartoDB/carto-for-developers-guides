import GoogleMap from './GoogleMap'
import { GoogleMapsOverlay } from '@deck.gl/google-maps'

export default {
  layers: {},
  gmapsInstance: null,
  deckOverlay: null,
  async init (gmapsProps) {
    const mapInstance = new GoogleMap(gmapsProps)
    await mapInstance.initialize()
    this.gmapsInstance = mapInstance._map
    this.deckOverlay = new GoogleMapsOverlay()
    this.deckOverlay.setMap(this.gmapsInstance)
},
  destroy () {
    this.gmapsInstance.finalize()
    delete this.gmapsInstance
  },
  hasLayer (id) {
    return !!this.layers[id]
  },
  getLayers() {
    return this.layers;
  },
  isVisible (id) {
    return this.layers[id] && this.layers[id].props.visible !== false
  },
  updateGmapsInstance () {
    if (!this.gmapsInstance) {
      return
    }
    const layers = [...Object.values(this.layers)];
    if (this.gmapsInstance) {
      this.deckOverlay.setProps({ layers })
    }
  },
  addLayer (layer) {
    if (!layer.id) {
      throw new Error(`[layerManager.addLayer] layer id must defined. Received "${layer.id}" instead`)
    }
    this.layers[layer.id] = layer
    this.updateGmapsInstance()
  },
  updateLayer (id, props) {
    if (!this.layers[id]) {
      return
    }
    const layer = this.layers[id]
    this.layers[id] = layer.clone(props)
    this.updateGmapsInstance()
  },
  removeLayer (id) {
    if (this.hasLayer(id)) {
      delete this.layers[id]
      this.updateGmapsInstance()
    }
  },
  hideLayer (id) {
    if (this.hasLayer(id)) {
      this.updateLayer(id, { visible: false })
    }
  },
  showLayer (id) {
    if (this.hasLayer(id)) {
      this.updateLayer(id, { visible: true })
    }
  }
}
