/**
 *  SidebarComponent.vue
**/
/* template import */
<template src="./sidebar.component.html"></template>
/* style import */
<style lang="scss" src="./sidebar.component.scss"></style>
<script>
import SwitchComponent from '../switch-component/SwitchComponent.vue';
import BarChartComponent from '../bar-chart-component/BarChartComponent.vue';

export default {
  name: 'SidebarComponent',
  components: {
    SwitchComponent,
    BarChartComponent
  }
}
</script>
