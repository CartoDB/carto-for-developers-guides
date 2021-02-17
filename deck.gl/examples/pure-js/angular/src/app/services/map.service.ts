import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private deck: any = null;

  private layers: any[] = [];
  private layersIdx: any = {};

  constructor() { }

  addLayer(layer: any) {
    this.layers.push(layer.getLayer());
    this.layersIdx[layer.id] = this.layers.length;

    if (this.deck) {
      this.updateDeck()
    }
  }

  updateLayer(id: string, props: any = {}) {
    const layerIdx = this.layersIdx[id];
    const layer = this.layers[layerIdx];
    this.layers[layerIdx] = layer.clone(props);

    this.updateDeck()
  }

  setDeck (deck: any) {
    this.deck = deck;
    this.updateDeck()
  }

  private updateDeck () {
    this.deck.setProps({ layers: [...this.layers]});
  }
}
