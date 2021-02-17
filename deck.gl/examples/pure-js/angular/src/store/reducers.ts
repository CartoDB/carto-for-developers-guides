import { createReducer, on } from '@ngrx/store';
import { WebMercatorViewport } from '@deck.gl/core';
import bboxPolygon from '@turf/bbox-polygon';
import intersects from '@turf/boolean-intersects';
import { switchVisibility, setGeojsonData, setBounds } from './actions';
import { StoreT, Payload } from '../models';
 
export const initialState = {
  layersVisibility: {
    sql: true,
    bigquery: true,
    geojson: true
  },
  geojsonData: null,
  bounds: [],
  viewportFeatures: null
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
      geojsonData: data.payload,
      viewportFeatures: data.payload
    }
  }),
  on(setBounds, (state: any, data: Payload) => {
    const bounds = getBounds(data.payload);
    const viewportFeatures = getViewportFeatures(state.geojsonData, bounds);

    return {
      ...state,
      bounds,
      viewportFeatures
    }
  }),
);
 
export function appReducer(state: StoreT | undefined, action: any) {
  return _appReducer(state, action);
}

function getBounds(viewState: {}) {
  return new WebMercatorViewport(viewState).getBounds();
}

function getViewportFeatures(data: [], bounds: any) {
  const bbox = bboxPolygon(bounds);

  return data.filter((f: any) => intersects(f, bbox));
} 
