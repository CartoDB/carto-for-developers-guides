import DeckMap from './DeckMap'

export default {
  layers: {},
  deckInstance: null,
  init (deckProps) {
    this.deckInstance = new DeckMap(deckProps)
  },
  destroy () {
    this.deckInstance.finalize()
    delete this.deckInstance
  },
  hasLayer (id) {
    return !!this.layers[id]
  },
  getLayers() {
    return this.layers;
  },
  isVisible (id) {
    // visible = undefined is treated by deckgl as visible = true
    return this.layers[id] && this.layers[id].props.visible !== false
  },
  updateDeckInstance () {
    if (!this.deckInstance) {
      return
    }
    const layers = [...Object.values(this.layers)];
    if (this.deckInstance) {
      this.deckInstance.setProps({ layers })
    }
  },
  addLayer (layer) {
    if (!layer.id) {
      throw new Error(`[layerManager.addLayer] layer id must defined. Received "${layer.id}" instead`)
    }
    this.layers[layer.id] = layer
    this.updateDeckInstance()
  },
  updateLayer (id, props) {
    if (!this.layers[id]) {
      return
    }
    const layer = this.layers[id]
    this.layers[id] = layer.clone(props)
    this.updateDeckInstance()
  },
  removeLayer (id) {
    if (this.hasLayer(id)) {
      delete this.layers[id]
      this.updateDeckInstance()
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
