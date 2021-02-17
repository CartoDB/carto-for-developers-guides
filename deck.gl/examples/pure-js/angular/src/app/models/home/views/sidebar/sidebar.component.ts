import { Component, OnInit } from '@angular/core';
import { AirportLayer } from "../../layers/airport-layer";
import { MapService } from "../../../../services/map.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private airportLayer: AirportLayer,
    private mapService: MapService
  ) {
  }

  ngOnInit(): void {
    this.mapService.addLayer(this.airportLayer)
  }

}
