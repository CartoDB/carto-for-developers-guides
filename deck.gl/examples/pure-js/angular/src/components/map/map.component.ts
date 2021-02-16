import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Map as MapboxMap } from 'mapbox-gl';
import { Deck } from '@deck.gl/core';
import { setDefaultCredentials, BASEMAP } from '@deck.gl/carto';
import { sqlLayer, bigQueryLayer, geoJsonLayer } from '../../layers';
import { LayersState, LayersVisibility } from '../../models';

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
  selector: 'deckgl-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  public deck: any = null;

  constructor(private store: Store<LayersVisibility>) {}

  ngOnInit() {
    this.store.select('layersVisibility').subscribe((state: LayersState) => {
      this.switchLayersVisibility(state);
    });
  }

  ngAfterViewInit() {
    this.launchMap(INITIAL_VIEW_STATE);
  }

  private async launchMap(initialViewState: any) {
    const map = new MapboxMap({
      container: 'mapbox-map',
      style: BASEMAP.DARK_MATTER,
      interactive: true,
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom
    });

    this.deck = new Deck({
      canvas: 'deck-canvas',
      width: '100%',
      height: '100%',
      initialViewState,
      controller: true,
      onViewStateChange: ({viewState: v}: any) => {
        map.jumpTo({
          center: [v.longitude, v.latitude],
          zoom: v.zoom,
          bearing: v.bearing,
          pitch: v.pitch
        });
      },
      layers: [
        sqlLayer({ visible: true }),
        bigQueryLayer({ visible: true }),
        await geoJsonLayer({ visible: true })
      ]
    });
  }

  private async switchLayersVisibility(state: any) {
    if (this.deck) {
      this.deck.setProps({
        layers: [
          sqlLayer({ visible: state.layersVisibility.sql }),
          bigQueryLayer({ visible: state.layersVisibility.bigquery }),
          await geoJsonLayer({ visible: state.layersVisibility.geojson })
        ]
      })
    }
  }
}
