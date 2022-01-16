<template>
  <section>
    <ActionTitle>Settings</ActionTitle>
    <MemberEdit :member="member" @close="editing = false" />
  </section>
</template>

<script>
export default {
  layout: 'action',
  head: {
    title: 'You\'r Settings'
  },
  data() {
    return {
      editing: false,
    }
  },
  computed: {
    member() {
      return this.$auth.user
    }
  },
}
</script>