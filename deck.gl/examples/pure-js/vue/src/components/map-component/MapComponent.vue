/**
 *  MapComponent.vue
**/
/* template import */
<template src="./map-component.html"></template>
/* style import */
<style scoped lang="scss" src="./map-component.scss"></style>
<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import { MODULE_NAME, MUTATIONS, GETTERS } from '@/store/map'
import 'mapbox-gl/dist/mapbox-gl.css'
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
    ...mapState(MODULE_NAME, ['viewState']),
    ...mapGetters(MODULE_NAME, {
      mapStyle: GETTERS.GET_BASEMAP
    })
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
        mapStyle: this.mapStyle,
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
