import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

import { WebMercatorViewport } from '@deck.gl/core';

import bboxPolygon from '@turf/bbox-polygon';

import { Layer } from "../models/layer";
import { debounce } from "../../utils/debounce";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private deck: any = null;

  private layers: any[] = [];
  private layersIdx: any = {};

  private layerChange = new Subject();
  private layerChange$ = this.layerChange.asObservable();

  private _updateSetBounds = debounce(this.updateSetBounds.bind(this), 500);

  onViewStateChange = new BehaviorSubject<any>(null);

  constructor() {}

  async addLayer(layer: Layer) {
    this.layersIdx[layer.id] = this.layers.length;
    this.layers.push(layer.getLayer());

    if (this.deck) this.updateDeck();
  }

  updateLayer(id: string, props: any = {}) {
    const layerIdx = this.layersIdx[id];

    if (layerIdx === undefined) {
      throw new Error(`[MapService] Layer ${id} cannot be found.`);
    }

    const layer = this.layers[layerIdx];
    this.layers[layerIdx] = layer.clone(props);

    this.layerChange.next(this.layers[layerIdx]);

    if (this.deck) this.updateDeck();
  }

  getLayer(id: string) {
    const layerIdx = this.layersIdx[id];
    return this.layers[layerIdx];
  }

  removeLayer(id: string) {
    const layerIdx = this.layersIdx[id];

    if (Number.isFinite(layerIdx)) {
      this.layers.splice(layerIdx, 1);
      delete this.layersIdx[id];
    } else {
      throw new Error(`[MapService] Layer ${id} cannot be found.`);
    }

    if (this.deck) this.updateDeck();
  }

  onLayerChange(ids: string | string[]): Observable<any> {
    ids = Array.isArray(ids) ? ids : [ids];
    return this.layerChange$.pipe(
      filter((el: any) => ids.includes(el.id))
    )
  }

  setDeckInstance(deck: any) {
    this.deck = deck;
    this._onViewStateChange();
    this.updateDeck();
  }

  private updateDeck() {
    this.deck.setProps({layers: [...this.layers]});
  }

  public updateSetBounds(v: any) {
    this.onViewStateChange.next(getViewportBbox(v));
  }

  slowUpdateSetBounds(v: any) {
    this._updateSetBounds(v);
  }

  private _onViewStateChange() {
    this.deck.props.onViewStateChange = ({viewState}: any) => {
      this.slowUpdateSetBounds(viewState);
    };
  }
}

function getViewportBbox(viewState: any) {
  const bounds = new WebMercatorViewport(viewState).getBounds();
  return bboxPolygon(bounds);
}
