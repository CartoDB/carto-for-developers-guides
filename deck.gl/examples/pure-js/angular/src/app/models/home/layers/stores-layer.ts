import { CartoSQLLayer, colorCategories } from "@deck.gl/carto";
import { Injectable } from "@angular/core";
import { Layer } from "../../../layers/layer";
import { Subject } from "rxjs";
import { GeoJsonLayer } from '@deck.gl/layers';

const GEOJSON_ENDPOINT = 'https://public.carto.com/api/v2/sql?q=SELECT * FROM retail_stores&format=geojson';

@Injectable()
export class StoresLayer extends Layer {

  id = 'STORES_LAYER';
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
      pointRadiusUnits: 'pixels',
      lineWidthUnits: 'pixels',
      pickable: true,
      getFillColor: colorCategories({
        attr: 'storetype',
        domain: ['Supermarket', 'Discount Store', 'Hypermarket', 'Drugstore', 'Department Store'],
        colors: 'Pastel'
      }),
      getLineColor: [0, 0, 0, 100],
      getRadius: 3,
      autoHighlight: true,
      highlightColor: [0, 255, 0]
    });
  }
}

