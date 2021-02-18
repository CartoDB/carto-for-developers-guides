import { Component, OnDestroy, OnInit } from '@angular/core';
import { RailRoadsLayer } from "../../layers/rail-roads-layer";
import { BuildingsLayer } from "../../layers/buildings-layer";
import { StoresLayer } from "../../layers/stores-layer";
import { MapService } from "../../../../services/map.service";
import { Subscription } from "rxjs";

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
    const railRoadsLayerStatus = this.mapService.getLayer(this.railRoadsLayer.id);
    this.layersStatus[this.railRoadsLayer.id] = railRoadsLayerStatus ? railRoadsLayerStatus.visible : true;

    this.subscription = this.mapService.onLayerChange(this.railRoadsLayer.id).subscribe(layer => {
      this.layersStatus[layer.id] = layer.props.visible;
    });

    const buildingsLayerStatus = this.mapService.getLayer(this.buildingsLayer.id);
    this.layersStatus[this.buildingsLayer.id] = buildingsLayerStatus ? buildingsLayerStatus.visible : true;

    this.subscription = this.mapService.onLayerChange(this.buildingsLayer.id).subscribe(layer => {
      this.layersStatus[layer.id] = layer.props.visible;
    });

    const storesLayerStatus = this.mapService.getLayer(this.storesLayer.id);
    this.layersStatus[this.storesLayer.id] = storesLayerStatus ? storesLayerStatus.visible : true;

    this.subscription = this.mapService.onLayerChange(this.storesLayer.id).subscribe(layer => {
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
