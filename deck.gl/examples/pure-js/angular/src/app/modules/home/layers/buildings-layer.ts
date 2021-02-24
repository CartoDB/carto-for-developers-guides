import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { CartoBQTilerLayer } from "@deck.gl/carto";

import { Layer } from "../../../models/layer";

@Injectable()
export class BuildingsLayer extends Layer {

  id = 'BUILDINGS_LAYER';
  visible = false;
  viewportLoaded = new Subject();

  async getLayer() {
    return new CartoBQTilerLayer({
      id: this.id,
      data: 'cartobq.maps.msft_buildings',
      binary: true,
      visible: this.visible,
      pointRadiusUnits: 'pixels',
      getFillColor: [240, 142, 240],
      getFileColor: [240, 142, 240],
      onViewportLoad: (d: any) => {
        this.viewportLoaded.next(d);
      }
    });
  }
}
