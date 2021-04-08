import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { GeoJsonLayer } from '@deck.gl/layers';
import { colorCategories } from "@deck.gl/carto";

import { Layer } from "../../../models/layer";

@Injectable()
export class StoresLayer extends Layer {

  id = 'STORES_LAYER';
  visible = true;
  dataLoaded = new Subject();

  getLayer() {
    return new GeoJsonLayer({
      id: this.id,
      data: 'https://public.carto.com/api/v2/sql?q=SELECT * FROM retail_stores&format=geojson',
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
      getRadius: 3,
      autoHighlight: true,
      highlightColor: [0, 255, 0],
      onDataLoad: (data: any) => this.dataLoaded.next(data.features)
    });
  }
}

