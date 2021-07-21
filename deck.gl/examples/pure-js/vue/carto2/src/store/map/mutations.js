import { MUTATIONS } from './constants'
import layerManager from '@/components/map-component/map-utils/layerManager'
import { initialViewState } from './state'
import { debounce } from '@/utils/debounce';

export const mutations = {
  [MUTATIONS.SET_MAP_LOADED]: (state, isMapLoaded) => {
    state.mapLoaded = isMapLoaded
  },
  [MUTATIONS.SET_VIEWSTATE]: (state, viewState) => {
    setDelayedViewState(state, viewState);
    layerManager.deckInstance.setProps({ viewState: { ...viewState } })
  },
  [MUTATIONS.RESET_VIEWSTATE]: (state) => {
    const viewState = initialViewState()
    state.viewState = viewState
    layerManager.deckInstance.setProps({ viewState: { ...viewState } })
  },
  [MUTATIONS.SET_VIEWPORT_FEATURES]: (state, data) => {
    state.viewportFeatures = data
  }
}

const setDelayedViewState = debounce((state, v) => {
  state.viewState = v
}, 500)
