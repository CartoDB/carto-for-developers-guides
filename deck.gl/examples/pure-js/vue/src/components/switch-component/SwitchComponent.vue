/**
 *  SwitchComponent.vue
**/
/* template import */
<template src="./switch.component.html"></template>
/* style import */
<style lang="scss" src="./switch.component.scss"></style>
<script>
import layerService from '@/services/layerService'
import { layersInfo } from '@/layersConfig'

export default {
  name: 'SwitchComponent',
  components: {},
  data: () => ({
    ...layersInfo
  }),
  methods: {
    handleChange (layerId) {
      const isVisible = layerService.isVisible(layerId);
      layerService[isVisible ? 'hideLayer' : 'showLayer'](layerId);
    }
  }
}
</script>
