import { createAction } from '@ngrx/store';
import { Layers } from '../models';

export const switchVisibility = createAction('layers visibility', (response: { layerType: Layers }) => response);