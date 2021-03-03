import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { RailRoadsLayer } from "../../layers/rail-roads-layer";
import { BuildingsLayer } from "../../layers/buildings-layer";
import { StoresLayer } from "../../layers/stores-layer";
import { MapService } from "../../../../services/map.service";

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  layersStatus: { [id: string]: boolean } = {};

  constructor(
    public railRoadsLayer: RailRoadsLayer,
    public buildingsLayer: BuildingsLayer,
    public storesLayer: StoresLayer,
    private mapService: MapService
  ) { }

  ngOnInit() {
    let layers = [this.railRoadsLayer, this.buildingsLayer, this.storesLayer];

    layers.forEach(layer => this.layersStatus[layer.id] = layer.visible);

    this.subscription = this.mapService.onLayerChange([this.storesLayer.id, 
                                                       this.buildingsLayer.id, 
                                                       this.railRoadsLayer.id]).subscribe(layer => {
      this.layersStatus[layer.id] = layer.props.visible;
    });
  }

  onVisibilityChange (evt: any) {
    const target = evt.source.name;

    if (target === 'sql') {
      this.mapService.updateLayer(
        this.railRoadsLayer.id,
        evt.checked ? this.railRoadsLayer.show() : this.railRoadsLayer.hide()
      );
    } else if (target === 'bigquery') {
      this.mapService.updateLayer(
        this.buildingsLayer.id,
        evt.checked ? this.buildingsLayer.show() : this.buildingsLayer.hide()
      );
    } else if (target === 'geojson') {
      this.mapService.updateLayer(
        this.storesLayer.id,
        evt.checked ? this.storesLayer.show() : this.storesLayer.hide()
      );
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
