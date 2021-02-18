import { Injectable } from '@angular/core';
import { Layer } from "../layers/layer";
import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private deck: any = null;

  private layers: any[] = [];
  private layersIdx: any = {};

  private layerChange = new Subject();
  private layerChange$ = this.layerChange.asObservable();

  constructor() {
  }

  addLayer(layer: Layer) {
    this.layersIdx[layer.id] = this.layers.length;
    this.layers.push(layer.getLayer());

    if (this.deck) this.updateDeck()
  }

  updateLayer(id: string, props: any = {}) {
    const layerIdx = this.layersIdx[id];

    if (layerIdx === undefined) {
      throw new Error(`[MapService] Layer ${id} cannot be found.`)
    }

    const layer = this.layers[layerIdx];
    this.layers[layerIdx] = layer.clone(props);

    // Emit change
    this.layerChange.next(this.layers[layerIdx])

    if (this.deck) this.updateDeck()
  }

  getLayer(id: string) {
    const layerIdx = this.layersIdx[id];
    return this.layers[layerIdx];
  }

  removeLayer(id: string) {
    const layerIdx = this.layersIdx[id];

    if (Number.isFinite(layerIdx)) {
      this.layers.splice(layerIdx, 1)
      delete this.layersIdx[id]
    } else {
      throw new Error(`[MapService] Layer ${id} cannot be found.`)
    }

    if (this.deck) this.updateDeck()
  }

  onLayerChange(ids: string | string[]): Observable<any> {
    ids = Array.isArray(ids) ? ids : [ids];
    return this.layerChange$.pipe(
      filter((el: any) => ids.includes(el.id))
    )
  }

  // Deck stuff

  setDeckInstance(deck: any) {
    this.deck = deck;
    this.updateDeck()
  }

  private updateDeck() {
    this.deck.setProps({layers: [...this.layers]});
  }
}
