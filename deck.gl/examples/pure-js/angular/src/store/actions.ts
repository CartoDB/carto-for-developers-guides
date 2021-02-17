import { createAction } from '@ngrx/store';
import { Layers } from '../models';

export const switchVisibility = createAction('layers visibility', (response: { layerType: Layers }) => response);

export const setGeojsonData = createAction('geojson data', (response: any) => response);

export const setBounds = createAction('bounds', (response: any) => response);