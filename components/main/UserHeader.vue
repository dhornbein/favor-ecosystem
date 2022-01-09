<template>
  <header v-if="$auth.user">
    <MemberCard :size="view" ref="user" :member="$auth.user" />
  </header>
</template>

<script>
export default {
  data() {
    return {
      view: 'open'
    }
  },
}
</script>