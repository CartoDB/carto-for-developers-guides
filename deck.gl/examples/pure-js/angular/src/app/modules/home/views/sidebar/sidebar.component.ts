import { Component, OnDestroy, OnInit } from '@angular/core';

import { RailRoadsLayer } from "../../layers/rail-roads-layer";
import { BuildingsLayer } from "../../layers/buildings-layer";
import { StoresLayer } from "../../layers/stores-layer";
import { MapService } from "../../../../services/map.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  constructor(
    private railRoadsLayer: RailRoadsLayer,
    private buildingsLayer: BuildingsLayer,
    private storesLayer: StoresLayer,
    private mapService: MapService
  ) {
  }

  async ngOnInit() {
    await this.mapService.addLayer(this.railRoadsLayer);
    await this.mapService.addLayer(this.buildingsLayer);
    await this.mapService.addLayer(this.storesLayer);
  }

  ngOnDestroy () {
    this.mapService.removeLayer(this.railRoadsLayer.id);
    this.mapService.removeLayer(this.buildingsLayer.id);
    this.mapService.removeLayer(this.storesLayer.id);
  }

}
