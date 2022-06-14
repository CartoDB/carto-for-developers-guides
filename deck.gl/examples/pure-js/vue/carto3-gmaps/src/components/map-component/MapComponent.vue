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
import 'mapbox-gl/dist/mapbox-gl.css'
import layerManager from './map-utils/layerManager'

export default {
  name: 'MapComponent',
  mounted () {
    this.layerManager = layerManager // for debugging purposes
    this.setupGoogleMaps()
  },
  beforeDestroy () {
    this[MUTATIONS.RESET_VIEWSTATE]()
    layerManager.destroy()
  },
  computed: {
    ...mapState(MODULE_NAME, ['viewState', 'basemap'])
  },
  methods: {
    ...mapMutations(MODULE_NAME, [
      MUTATIONS.SET_VIEWSTATE,
      MUTATIONS.RESET_VIEWSTATE,
      MUTATIONS.SET_MAP_LOADED
    ]),
    setupGoogleMaps () {
      if (layerManager.gmapsInstance) {
        return
      }
      layerManager.init({
        container: '#map',
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
