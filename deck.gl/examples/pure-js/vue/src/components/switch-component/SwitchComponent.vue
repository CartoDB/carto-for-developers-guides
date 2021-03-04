/**
 *  SwitchComponent.vue
**/
/* template import */
<template src="./switch.component.html"></template>
/* style import */
<style lang="scss" src="./switch.component.scss"></style>
<script>
import { mapState } from 'vuex'
import { MODULE_NAME } from '@/store/map'
import layerService from '@/services/layerService'

export default {
  name: 'SwitchComponent',
  components: {},
  data: () => ({
    mapLoaded_: false,
    layersData: []
  }),
  methods: {
    handleChange (layerId) {
      const isVisible = layerService.isVisible(layerId);
      layerService[isVisible ? 'hideLayer' : 'showLayer'](layerId);
    }
  },
  computed: {
    ...mapState(MODULE_NAME, ['mapLoaded']),
  },
  watch: {
    mapLoaded(isLoaded) {
      const layers = Object.entries(layerService.getLayers());
      this.layersData = layers.map(([id, props]) =>
        ({ id, isVisible: 'visible' in props ? props.visible : true, label: props._vueToggleLabel }))
      this.mapLoaded_ = isLoaded
    },
  }
}
</script>
