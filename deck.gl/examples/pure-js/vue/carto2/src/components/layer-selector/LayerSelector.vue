/**
 *  LayerSelector.vue
**/
/* template import */
<template src="./layer-selector.html"></template>
/* style import */
<style lang="scss" src="./layer-selector.scss"></style>
<script>
import { mapState } from 'vuex'
import { MODULE_NAME } from '@/store/map'
import layerManager from '../map-component/map-utils/layerManager'

export default {
  name: 'LayerSelector',
  components: {},
  data: () => ({
    mapLoaded_: false,
    layersData: []
  }),
  methods: {
    handleChange (layerId) {
      const isVisible = layerManager.isVisible(layerId);
      layerManager[isVisible ? 'hideLayer' : 'showLayer'](layerId);
    }
  },
  computed: {
    ...mapState(MODULE_NAME, ['mapLoaded']),
  },
  watch: {
    mapLoaded(isLoaded) {
      const layers = Object.entries(layerManager.getLayers());
      this.layersData = layers.map(([id, layer]) =>
        ({ id, isVisible: 'visible' in layer.props ? layer.props.visible : true, label: id || '' }))
      this.mapLoaded_ = isLoaded
    },
  }
}
</script>
