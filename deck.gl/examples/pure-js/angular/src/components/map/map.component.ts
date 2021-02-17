import {Component, AfterViewInit, NgZone, ChangeDetectionStrategy, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Store } from '@ngrx/store';
import { setGeojsonData, setBounds } from '../../store/actions';
import { Map as MapboxMap } from 'mapbox-gl';
import { Deck } from '@deck.gl/core';
import { setDefaultCredentials, BASEMAP } from '@deck.gl/carto';
import { sqlLayer, bigQueryLayer, geoJsonLayer } from '../../layers';
import { LayersState, StoreT } from '../../models';
import {debounce} from "../../utils/debounce";
import {first} from "rxjs/operators";

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
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterViewInit {
  public deck: any = null;
  public geojsonData$: any = null;

  private _updateSetBounds = debounce(this.updateSetBounds.bind(this), 500)

  @ViewChild('mapboxContainer', { static: true }) mapboxContainer: ElementRef;
  @ViewChild('deckCanvas', { static: true }) deckCanvas: ElementRef;

  constructor(
      private store: Store<{ reducer: StoreT }>,
      private zone: NgZone
  ) {}

  ngOnInit() {
    this.store.select('reducer').subscribe((state: StoreT) => {
      this.switchLayersVisibility(state.layersVisibility);
    });
  }

  ngAfterViewInit() {
    this.zone.onStable.pipe(first()).subscribe(() => {
      this.launchMap(INITIAL_VIEW_STATE);
    })
  }

  updateSetBounds (v: any) {
    this.store.dispatch(setBounds({payload: v}))
  }

  slowUpdateSetBounds (v: any) {
    this._updateSetBounds(v)
  }

  private async launchMap(initialViewState: any) {
    const geojsonLayer = await geoJsonLayer({visible: true});
    this.store.dispatch(setGeojsonData({payload: geojsonLayer.props.data}));

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
        onViewStateChange: ({viewState}: any) => {
          this.slowUpdateSetBounds(viewState);
        },
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
        },
        layers: [
          // sqlLayer({visible: true}),
          // bigQueryLayer({visible: true}),
          geojsonLayer
        ]
      });
    })
  }

  // code taken from here: https://github.com/visgl/react-map-gl/blob/ce6f6662ca34f8765cf0f515039e316adb52a957/src/mapbox/mapbox.js#L421
  // Force redraw the map now. Typically resize() and jumpTo() is reflected in the next
  // render cycle, which is managed by Mapbox's animation loop.
  // This removes the synchronization issue caused by requestAnimationFrame.
  redrawMapbox(map: any) {
    // map._render will throw error if style does not exist
    // https://github.com/mapbox/mapbox-gl-js/blob/fb9fc316da14e99ff4368f3e4faa3888fb43c513/src/ui/map.js#L1834
    if (map.style) {
      // cancel the scheduled update
      if (map._frame) {
        map._frame.cancel();
        map._frame = null;
      }
      // the order is important - render() may schedule another update
      map._render();
    }
  }

  private async switchLayersVisibility(state: LayersState) {
    if (this.deck) {
      this.deck.setProps({
        layers: [
          // sqlLayer({ visible: state.sql }),
          // bigQueryLayer({ visible: state.bigquery }),
          await geoJsonLayer({ visible: state.geojson })
        ]
      })
    }
  }
}