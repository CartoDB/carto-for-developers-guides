import { Injectable } from "@angular/core";

import { CartoBQTilerLayer } from "@deck.gl/carto";

import { Layer } from "../../../models/layer";

@Injectable()
export class BuildingsLayer extends Layer {

  id = 'BUILDINGS_LAYER';
  visible = false;

  async getLayer() {
    return new CartoBQTilerLayer({
      id: this.id,
      data: 'cartobq.maps.msft_buildings',
      visible: this.visible,
      pointRadiusUnits: 'pixels',
      getFillColor: [240, 142, 240],
    });
  }
}
