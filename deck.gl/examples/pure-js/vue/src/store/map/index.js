/**
 *  Filters store module file
**/

import { state } from './state'
import { mutations } from './mutations'

export default {
  namespaced: true,
  state,
  mutations
}

export { MODULE_NAME, MUTATIONS } from './constants'
