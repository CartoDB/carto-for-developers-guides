/**
 *  AppShell.vue
**/
/* template import */
<template src="./app-shell.html"></template>
/* style import */
<style scoped lang="css" src="./app-shell.css"></style>
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
