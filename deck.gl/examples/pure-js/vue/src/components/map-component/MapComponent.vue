/**
 *  MapComponent.vue
**/
/* template import */
<template src="./map-component.html"></template>
/* style import */
<style scoped lang="scss" src="./map-component.scss"></style>
<script>
import { mapMutations, mapState } from 'vuex'
import { MODULE_NAME, MUTATIONS } from '@/store/map'
import { BASEMAP } from '@deck.gl/carto'
import layerService from '@/services/layerService'

export default {
  name: 'MapComponent',
  mounted () {
    this.layerService = layerService // for debugging purposes
    this.setupDeck()
  },
  beforeDestroy () {
    this[MUTATIONS.RESET_VIEWSTATE]()
    layerService.destroy()
  },
  computed: {
    ...mapState(MODULE_NAME, ['viewState', 'bbox'])
  },
  methods: {
    ...mapMutations(MODULE_NAME, [
      MUTATIONS.SET_VIEWSTATE,
      MUTATIONS.RESET_VIEWSTATE,
      MUTATIONS.SET_MAP_LOADED
    ]),
    setupDeck () {
      if (layerService.deckInstance) {
        return
      }
      layerService.init({
        container: '#map',
        mapStyle: BASEMAP.POSITRON,
        viewState: this.viewState,
        onViewStateChange: ({ viewState }) => {
          this[MUTATIONS.SET_VIEWSTATE](viewState)
        },
        onLoad: () => {
          this[MUTATIONS.SET_MAP_LOADED](true)
        }
      })
    }
  }
}
</script>
