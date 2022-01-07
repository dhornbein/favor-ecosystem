<template>
  <header v-if="$auth.user">
    <MemberCard class="p-2 shadow-lg border-b border-gray-400 cursor-pointer" :size="view" ref="user" :member="$auth.user" @click="toggleView">
      <div class="flex justify-between">
        <nuxt-link class="btn btn-sm" to="/invite">Invite</nuxt-link>
        <button class="btn btn-sm ml-auto" @click="$auth.logout()">Logout</button>
      </div>
    </MemberCard>
  </header>
</template>

<script>
export default {
  data() {
    return {
      view: 'compact'
    }
  },
  methods: {
    toggleView() {
      const target = this.$refs.user
      let size = target.currentSize == 'compact' ? 'open' : 'compact'
      target.setSize(size)
    }
  },
}
</script>