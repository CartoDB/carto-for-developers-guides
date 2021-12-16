import { Component, AfterViewInit, NgZone, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';

import { Map as MapboxMap } from 'mapbox-gl';

import { Deck } from '@deck.gl/core';
import { setDefaultCredentials, BASEMAP, API_VERSIONS } from '@deck.gl/carto';

import { MapService } from "../../../../services/map.service";

setDefaultCredentials({
  apiBaseUrl: 'https://gcp-us-east1.api.carto.com',
  apiVersion: API_VERSIONS.V3,
  accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfbHFlM3p3Z3UiLCJqdGkiOiI1YjI0OWE2ZCJ9.Y7zB30NJFzq5fPv8W5nkoH5lPXFWQP0uywDtqUg8y8c'
});

const INITIAL_VIEW_STATE = {
  longitude: -97.2,
  latitude: 44.33,
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
        style: BASEMAP.POSITRON,
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
            this.redrawMapbox(map);
          }
        },
        getTooltip: this.tooltip   
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

  tooltip(pickingInfo: any) {
    if (pickingInfo.object) {
      let html = `<div style="padding-bottom: 10px;"><strong>${pickingInfo.layer.id}</strong></div>`;
      for (const [name, value] of Object.entries(pickingInfo.object.properties)) {
        if (name != "layerName" && name != "cartodb_id") {
          html += `<div><strong>${name}: </strong>${value}</div>`;
        }
      }
      let style = {
        backgroundColor: '#FFF',
        color: '#111',
        fontFamily: 'Open Sans'          
      };
      return(pickingInfo.object && {
        html: html,
        style: style
      });  
    }
    return(null);
  }

}
