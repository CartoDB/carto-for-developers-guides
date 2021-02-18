import {
  Component,
  AfterViewInit,
  NgZone,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Map as MapboxMap } from 'mapbox-gl';
import { Deck } from '@deck.gl/core';
import { setDefaultCredentials, BASEMAP } from '@deck.gl/carto';
import { MapService } from "../../../../services/map.service";

setDefaultCredentials({
  username: 'public',
  apiKey: 'default_public'
});

const INITIAL_VIEW_STATE = {
  longitude: -85,
  latitude: 40,
  zoom: 3,
};

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements AfterViewInit {
  public deck: any = null;
  public geojsonData$: any = null;

  @ViewChild('mapboxContainer', {static: true}) mapboxContainer: ElementRef;
  @ViewChild('deckCanvas', {static: true}) deckCanvas: ElementRef;

  constructor(
    private zone: NgZone,
    private mapService: MapService
  ) {
  }

  ngAfterViewInit() {
    this.launchMap(INITIAL_VIEW_STATE);
  }

  private launchMap(initialViewState: any) {
    this.zone.runOutsideAngular(() => {
      const map = new MapboxMap({
        container: this.mapboxContainer.nativeElement,
        style: BASEMAP.DARK_MATTER,
        interactive: false,
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom
      });

      this.deck = new Deck({
        canvas: this.deckCanvas.nativeElement,
        initialViewState,
        controller: true,
        onBeforeRender: () => {
          if (this.deck) {
            const viewport = this.deck.getViewports()[0];
            map.jumpTo({
              center: [viewport.longitude, viewport.latitude],
              zoom: viewport.zoom,
              bearing: viewport.bearing,
              pitch: viewport.pitch
            });
            // TODO: only redraw when viewport has changed
            this.redrawMapbox(map);
          }
        }
      });

      this.mapService.setDeckInstance(this.deck);
   })
  }

  redrawMapbox(map: any) {
    if (map.style) {
      if (map._frame) {
        map._frame.cancel();
        map._frame = null;
      }
      map._render();
    }
  }
}
