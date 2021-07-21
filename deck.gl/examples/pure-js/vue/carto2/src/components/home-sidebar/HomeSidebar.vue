/**
 *  HomeSidebar.vue
**/
/* template import */
<template src="./home-sidebar.html"></template>
/* style import */
<style lang="scss" src="./home-sidebar.scss"></style>
<script>
import LayerSelector from '../layer-selector/LayerSelector.vue';
import BarChart from '../bar-chart/BarChart.vue';

export default {
  name: 'HomeSidebar',
  components: {
    LayerSelector,
    BarChart
  }
}
</script>
