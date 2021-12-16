import { Injectable } from "@angular/core";

import { CartoLayer, MAP_TYPES, colorContinuous } from "@deck.gl/carto";

import { Layer } from "../../../models/layer";

@Injectable()
export class RailRoadsLayer extends Layer {

  id = 'RAILROADS_LAYER';
  visible = true;

  async getLayer() {
    return new CartoLayer({
      id: this.id,
      connection: 'bqconn',
      type: MAP_TYPES.QUERY,
      data: 'SELECT geom, scalerank FROM cartobq.public_account.ne_10m_railroads_public',
      visible: this.visible,
      pickable: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getLineColor: colorContinuous({
        attr: 'scalerank',
        domain: [4, 5, 6, 7, 8, 9, 10],
        colors: 'BluYl'
      }),
      getLineWidth: (f: any) => f.properties.scalerank,
      autoHighlight: true,
      highlightColor: [0, 255, 0],
    });
  }

}
