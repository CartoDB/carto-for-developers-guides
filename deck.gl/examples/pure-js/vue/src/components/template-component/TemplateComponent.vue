/**
 *  TemplateComponent.vue
**/
/* template import */
<template src="./template.component.html"></template>
/* style import */
<style lang="scss" src="./template.component.scss"></style>
<script>
import HeaderComponent from '../header-component/HeaderComponent.vue';
import SidebarComponent from '../sidebar-component/SidebarComponent.vue';
import MapComponent from '../map-component/MapComponent.vue';

export default {
  name: 'TemplateComponent',
  components: {
    HeaderComponent,
    SidebarComponent,
    MapComponent
  }
}
</script>
