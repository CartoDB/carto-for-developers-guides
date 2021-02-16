import { createReducer, on } from '@ngrx/store';
import { switchVisibility } from './actions';
import { LayersVisibility as StateType } from '../models';
 
export const initialState = {
  layersVisibility: {
    sql: true,
    bigquery: true,
    geojson: true
  }
};
 
const _appReducer = createReducer(
  initialState,
  on(switchVisibility, (state: StateType, { layerType: t }): StateType => {
    return {
      ...state,
      layersVisibility: {
        ...state.layersVisibility,
        [t]: !state.layersVisibility[t]
      }
    }
  })
);
 
export function appReducer(state: StateType | undefined, action: any) {
  return _appReducer(state, action);
}
