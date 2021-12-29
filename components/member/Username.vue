<template>
  <span class="username" v-if="noLink">@{{ username }}</span>
  <nuxt-link class="username" v-else :to="`/members/${username}`">@{{ username }}</nuxt-link>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      required: true
    },
    noLink: {
      type: Boolean,
      default: false
    }
  },
}
</script>