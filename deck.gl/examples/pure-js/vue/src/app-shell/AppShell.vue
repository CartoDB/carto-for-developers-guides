/**
 *  AppShell.vue
**/
/* template import */
<template src="./app-shell.html"></template>
/* style import */
<style scoped lang="scss" src="./app-shell.scss"></style>
<script>
export default {
  name: 'AppShell',
  computed: {
    routes () {
      return [
        {
          to: { name: 'home' },
          name: 'Home'
        }
      ]
    }
  }
}
</script>
