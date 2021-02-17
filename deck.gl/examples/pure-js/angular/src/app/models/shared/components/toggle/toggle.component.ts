import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchVisibility } from '../../../../../store/actions';
import { LayersState, StoreT } from '../../../../../models';

@Component({
  selector: 'toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent {
  public layers$: LayersState | null = null;

  constructor(private store: Store<StoreT>) {}

  ngOnInit() {
    this.store.select(state => this.layers$ = state.layersVisibility);
  }

  onVisibilityChange(evt: any) {
    const layerType = evt.source.name;
    this.store.dispatch(switchVisibility({ layerType }));
  }
}
