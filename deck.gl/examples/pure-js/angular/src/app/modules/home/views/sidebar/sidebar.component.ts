import { Component, OnDestroy, OnInit } from '@angular/core';
import { RailRoadsLayer } from "../../layers/rail-roads-layer";
import { BuildingsLayer } from "../../layers/buildings-layer";
import { StoresLayer } from "../../layers/stores-layer";
import { MapService } from "../../../../services/map.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(
    private railRoadsLayer: RailRoadsLayer,
    private buildingsLayer: BuildingsLayer,
    private storesLayer: StoresLayer,
    private mapService: MapService
  ) {
  }

  async ngOnInit() {
    await this.mapService.addLayer(this.railRoadsLayer);

    /* this.subscription = this.railRoadsLayer.viewportLoaded.subscribe(data => {
      console.log(`Data from ${this.railRoadsLayer.id} has arrived!`, data);
    }); */

    await this.mapService.addLayer(this.buildingsLayer);

    /* this.subscription = this.buildingsLayer.viewportLoaded.subscribe(data => {
      console.log(`Data from ${this.buildingsLayer.id} has arrived!`, data);
    }); */

    await this.mapService.addLayer(this.storesLayer);

    /* this.subscription = this.storesLayer.viewportLoaded.subscribe(data => {
      console.log(`Data from ${this.storesLayer.id} has arrived!`, data);
    }); */
  }

  ngOnDestroy () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.mapService.removeLayer(this.railRoadsLayer.id);
    this.mapService.removeLayer(this.buildingsLayer.id);
    this.mapService.removeLayer(this.storesLayer.id);
  }

}
