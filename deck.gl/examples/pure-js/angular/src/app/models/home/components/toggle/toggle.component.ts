import { Component, OnDestroy, OnInit } from '@angular/core';
import { AirportLayer } from "../../layers/airport-layer";
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
    public airportLayer: AirportLayer,
    private mapService: MapService
  ) { }

  ngOnInit() {
    const airportLayerStatus = this.mapService.getLayer(this.airportLayer.id);
    this.layersStatus[this.airportLayer.id] = airportLayerStatus ? airportLayerStatus.visible : true;

    this.subscription = this.mapService.onLayerChange(this.airportLayer.id).subscribe(layer => {
      this.layersStatus[layer.id] = layer.props.visible;
    });
  }

  onVisibilityChange ({ checked }: { checked: boolean }) {
    this.mapService.updateLayer(
      this.airportLayer.id,
      checked ? this.airportLayer.show() : this.airportLayer.hide()
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
