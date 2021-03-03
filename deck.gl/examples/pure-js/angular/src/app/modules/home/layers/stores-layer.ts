import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { GeoJsonLayer } from '@deck.gl/layers';
import { colorCategories } from "@deck.gl/carto";

import { Layer } from "../../../models/layer";

const GEOJSON_ENDPOINT = 'https://public.carto.com/api/v2/sql?q=SELECT * FROM retail_stores&format=geojson';

@Injectable()
export class StoresLayer extends Layer {

  id = 'STORES_LAYER';
  visible = true;
  dataLoaded = new Subject();
  geojsonData: any = null;

  async fetchData(url: string) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch(err) {
      throw new Error(`Something went wrong: ${err}`);
    }
  }

  async getLayer() {
    if (!this.geojsonData) {
      this.geojsonData = await this.fetchData(GEOJSON_ENDPOINT);
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
      getRadius: 3,
      autoHighlight: true,
      highlightColor: [0, 255, 0]
    });
  }
}

