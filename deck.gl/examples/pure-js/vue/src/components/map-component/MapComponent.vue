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
  mixins: [],
  components: {},
  props: {},
  data () {
    return {
      loaded: false
    }
  },
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
      MUTATIONS.RESET_VIEWSTATE
    ]),
    setupDeck () {
      if (layerService.deckInstance) {
        return
      }
      layerService.init({
        container: '#map',
        mapStyle: BASEMAP.DARK_MATTER,
        viewState: this.viewState,
        onViewStateChange: ({ viewState }) => {
          this[MUTATIONS.SET_VIEWSTATE](viewState)
        },
        onLoad: () => {
          this.loaded = true
          this.$emit('loaded')
        }
      })
      window.deckMap = layerService.deckInstance
    }
  }
}
</script>
