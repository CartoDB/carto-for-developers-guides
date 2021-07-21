import { Injectable } from "@angular/core";

import { CartoLayer, MAP_TYPES } from "@deck.gl/carto";

import { Layer } from "../../../models/layer";

@Injectable()
export class BuildingsLayer extends Layer {

  id = 'BUILDINGS_LAYER';
  visible = false;

  async getLayer() {
    return new CartoLayer({
      id: this.id,
      type: MAP_TYPES.TILESET,
      data: 'cartobq.maps.msft_buildings',
      visible: this.visible,
      pointRadiusUnits: 'pixels',
      getFillColor: [240, 142, 240],
    });
  }
}
