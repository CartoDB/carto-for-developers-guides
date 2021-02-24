import { MUTATIONS } from './constants'
import layerService from '@/services/layerService'
import { initialViewState } from './state'
import { debounce } from '@/utils/debounce';

export const mutations = {
  [MUTATIONS.SET_VIEWSTATE]: (state, viewState) => {
    setDelayedViewState(state, viewState);
    layerService.deckInstance.setProps({ viewState: { ...viewState } })
  },
  [MUTATIONS.RESET_VIEWSTATE]: (state) => {
    const viewState = initialViewState()
    state.viewState = viewState
    layerService.deckInstance.setProps({ viewState: { ...viewState } })
  },
  [MUTATIONS.SET_VIEWPORT_FEATURES]: (state, data) => {
    state.viewportFeatures = data
  }
}

const setDelayedViewState = debounce((state, v) => {
  state.viewState = v
}, 500)
