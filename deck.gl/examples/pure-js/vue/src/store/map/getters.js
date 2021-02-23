import { GETTERS } from './constants'

/**
 *  Getters module file
**/

export const getters = {
  [GETTERS.GET_VIEWSTATE] (state) {
    return state.viewState
  }
}
