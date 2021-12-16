/**
 *  ViewTemplate.vue
**/
/* template import */
<template src="./view-template.html"></template>
/* style import */
<style lang="scss" src="./view-template.scss"></style>
<script>
import AppHeader from '../app-header/AppHeader.vue';
import HomeSidebar from '../home-sidebar/HomeSidebar.vue';
import MapComponent from '../map-component/MapComponent.vue';

export default {
  name: 'ViewTemplate',
  components: {
    AppHeader,
    HomeSidebar,
    MapComponent
  }
}
</script>
