<template>
  <nuxt-link :to="`/members/${username}`">@{{ username }}</nuxt-link>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      required: true
    }
  },
}
</script>