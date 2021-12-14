import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { GeoJsonLayer } from '@deck.gl/layers';
import { MAP_TYPES, FORMATS, getData, colorCategories } from "@deck.gl/carto";

import { Layer } from "../../../models/layer";

@Injectable()
export class StoresLayer extends Layer {

  id = 'STORES_LAYER';
  visible = true;
  dataLoaded = new Subject();
  geojsonData: any = null;

  async getLayer() {
    if (!this.geojsonData) {
      this.geojsonData = await getData({
        type: MAP_TYPES.TABLE,
        source: `cartobq.public_account.retail_stores`,
        connection: 'bqconn',
        format: FORMATS.GEOJSON
      });
    }

    const features = this.geojsonData.features;

    this.dataLoaded.next(features);

    return new GeoJsonLayer({
      id: this.id,
      data: features,
      visible: this.visible,
      pickable: true,
      getFillColor: colorCategories({
        attr: 'storetype',
        domain: ['Supermarket', 'Discount Store', 'Hypermarket', 'Drugstore', 
                 'Department Store', 'Speciality Store', 'Convenience Store'],
        colors: 'Pastel'
      }),
      getLineColor: [0, 0, 0, 100],
      pointRadiusUnits: 'pixels',
      lineWidthUnits: 'pixels',
      getPointRadius: 3,
      autoHighlight: true,
      highlightColor: [0, 255, 0]
    });
  }
}

