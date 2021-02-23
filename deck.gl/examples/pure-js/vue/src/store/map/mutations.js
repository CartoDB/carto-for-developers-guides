import { MUTATIONS } from './constants'
import layerService from '@/services/layerService'
import { initialViewState } from './state'

export const mutations = {
  [MUTATIONS.SET_VIEWSTATE]: (state, viewState) => {
    state.viewState = viewState
    layerService.deckInstance.setProps({ viewState: { ...viewState } })
  },
  [MUTATIONS.RESET_VIEWSTATE]: (state) => {
    const viewState = initialViewState()
    state.viewState = viewState
    layerService.deckInstance.setProps({ viewState: { ...viewState } })
  }
}
