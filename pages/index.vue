<template>
  <NuxtChild  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout ({ $auth }) {
    return ($auth.user) ? 'view' : 'default'
  },
  computed: {
    ...mapState(['transactions'])
  },
}
</script>

<style lang="scss" scoped>
</style>
