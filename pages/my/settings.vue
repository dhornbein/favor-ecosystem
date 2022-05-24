<template>
  <section>
    <ActionTitle>Settings</ActionTitle>
    <MemberEdit :member="member" @close="editing = false" />
  </section>
</template>

<script>
/**
 * Member edit page
 * This page is used to edit a member's profile
 */
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