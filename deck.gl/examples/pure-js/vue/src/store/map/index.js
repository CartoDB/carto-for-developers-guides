/**
 *  Filters store module file
**/

import { state } from './state'
import { mutations } from './mutations'
import { getters } from './getters'

export default {
  namespaced: true,
  state,
  mutations,
  getters
}

export { MODULE_NAME, GETTERS, MUTATIONS } from './constants'
