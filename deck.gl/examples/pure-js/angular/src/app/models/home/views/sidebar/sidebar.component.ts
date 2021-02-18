import { Component, OnDestroy, OnInit } from '@angular/core';
import { AirportLayer } from "../../layers/airport-layer";
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
    private airportLayer: AirportLayer,
    private mapService: MapService
  ) {
  }

  ngOnInit(): void {
    this.mapService.addLayer(this.airportLayer);

    this.subscription = this.airportLayer.viewportLoaded.subscribe(data => {
      console.log(`Data from ${this.airportLayer.id} has arrived!`, data);
    })
  }

  ngOnDestroy () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.mapService.removeLayer(this.airportLayer.id);
  }

}
