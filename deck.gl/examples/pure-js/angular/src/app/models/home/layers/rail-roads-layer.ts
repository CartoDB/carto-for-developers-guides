import { CartoSQLLayer, colorContinuous } from "@deck.gl/carto";
import { Injectable } from "@angular/core";
import { Layer } from "../../../layers/layer";
import { Subject } from "rxjs";

@Injectable()
export class RailRoadsLayer extends Layer {

  id = 'RAILROADS_LAYER';
  viewportLoaded = new Subject();

  async getLayer() {
    return new CartoSQLLayer({
      id: this.id,
      data: 'SELECT cartodb_id, the_geom_webmercator, scalerank FROM ne_10m_railroads_public',
      binary: true,
      pickable: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getLineColor: colorContinuous({
        attr: 'scalerank',
        domain: [1, 2, 3, 4, 5, 10],
        colors: 'BluYl'
      }),
      getLineWidth: (f: any) => f.properties.scalerank,
      autoHighlight: true,
      highlightColor: [0, 255, 0],
      onViewportLoad: (d: any) => {
        this.viewportLoaded.next(d);
      }
    });
  }
}
