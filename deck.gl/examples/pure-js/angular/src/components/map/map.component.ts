import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setGeojsonData, setBounds } from '../../store/actions';
import { Map as MapboxMap } from 'mapbox-gl';
import { Deck } from '@deck.gl/core';
import { setDefaultCredentials, BASEMAP } from '@deck.gl/carto';
import { sqlLayer, bigQueryLayer, geoJsonLayer } from '../../layers';
import { LayersState, StoreT } from '../../models';

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
  public geojsonData$: any = null;

  constructor(private store: Store<{ reducer: StoreT }>) {}

  ngOnInit() {
    this.store.select('reducer').subscribe((state: StoreT) => {
      this.switchLayersVisibility(state.layersVisibility);
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

    const _geojsonLayer = async () => await geoJsonLayer({ visible: true });
    const geojsonData = await Promise.resolve(_geojsonLayer());
    this.store.dispatch(setGeojsonData({ payload: geojsonData.props.data }));

    this.deck = new Deck({
      canvas: 'deck-canvas',
      width: '100%',
      height: '100%',
      initialViewState,
      controller: true,
      onViewStateChange: ({ viewState: v }: any) => {
        map.jumpTo({
          center: [v.longitude, v.latitude],
          zoom: v.zoom,
          bearing: v.bearing,
          pitch: v.pitch
        });

        this.store.dispatch(setBounds({ payload: v }));
      },
      layers: [
        sqlLayer({ visible: true }),
        bigQueryLayer({ visible: true }),
        await _geojsonLayer()
      ]
    });
  }

  private async switchLayersVisibility(state: LayersState) {
    if (this.deck) {
      this.deck.setProps({
        layers: [
          sqlLayer({ visible: state.sql }),
          bigQueryLayer({ visible: state.bigquery }),
          await geoJsonLayer({ visible: state.geojson })
        ]
      })
    }
  }
}
