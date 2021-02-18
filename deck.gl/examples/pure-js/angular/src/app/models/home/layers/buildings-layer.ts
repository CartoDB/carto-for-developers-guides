import { CartoBQTilerLayer } from "@deck.gl/carto";
import { Injectable } from "@angular/core";
import { Layer } from "../../../layers/layer";
import { Subject } from "rxjs";

@Injectable()
export class BuildingsLayer extends Layer {

  id = 'BUILDINGS_LAYER';
  viewportLoaded = new Subject();

  async getLayer() {
    return new CartoBQTilerLayer({
      id: this.id,
      data: 'cartobq.maps.msft_buildings',
      binary: true,
      pointRadiusUnits: 'pixels',
      getFillColor: [240, 142, 240],
      getFileColor: [240, 142, 240],
      onViewportLoad: (d: any) => {
        this.viewportLoaded.next(d);
      }
    });
  }
}
