import { createReducer, on } from '@ngrx/store';
import { WebMercatorViewport } from '@deck.gl/core';
import { switchVisibility, setGeojsonData, setBounds } from './actions';
import { StoreT, Payload } from '../models';
 
export const initialState = {
  layersVisibility: {
    sql: true,
    bigquery: true,
    geojson: true
  },
  geojsonData: null,
  bounds: []
};
 
const _appReducer = createReducer(
  initialState,
  on(switchVisibility, (state: StoreT, { layerType: t }): StoreT => {
    return {
      ...state,
      layersVisibility: {
        ...state.layersVisibility,
        [t]: !state.layersVisibility[t]
      }
    }
  }),
  on(setGeojsonData, (state: any, data: Payload) => {
    return {
      ...state,
      geojsonData: data.payload
    }
  }),
  on(setBounds, (state: any, data: Payload) => {
    return {
      ...state,
      bounds: getBounds(data.payload)
    }
  }),
);
 
export function appReducer(state: StoreT | undefined, action: any) {
  return _appReducer(state, action);
}

function getBounds(viewState: {}) {
  return new WebMercatorViewport(viewState).getBounds();
}
