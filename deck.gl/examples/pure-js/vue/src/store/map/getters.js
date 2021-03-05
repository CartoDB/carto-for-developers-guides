/**
 *  Getters module file
**/

import { GETTERS } from './constants'

export const getters = {
  [GETTERS.GET_CREDENTIALS]: state => state.credentials,
  [GETTERS.GET_BASEMAP]: state => state.basemap
}
