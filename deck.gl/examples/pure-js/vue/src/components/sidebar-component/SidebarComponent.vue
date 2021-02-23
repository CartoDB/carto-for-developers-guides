/**
 *  SidebarComponent.vue
**/
/* template import */
<template src="./sidebar.component.html"></template>
/* style import */
<style lang="scss" src="./sidebar.component.scss"></style>
<script>
import SwitchComponent from '../switch-component/SwitchComponent.vue';

export default {
  name: 'SidebarComponent',
  components: {
    SwitchComponent
  }
}
</script>
