<template>
  <NuxtChild  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout ({ $auth }) {
    return ($auth.user) ? 'main' : 'default'
  },
  head: {
    title: 'Home'
  },
  computed: {
    ...mapState(['transactions','members'])
  },
}
</script>

<style lang="scss" scoped>
</style>
