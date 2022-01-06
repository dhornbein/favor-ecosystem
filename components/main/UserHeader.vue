<template>
  <header v-if="$auth.user">
    <MemberCard class="p-2 shadow-lg border-b border-gray-400" :size="view" :member="$auth.user" @cardClick="toggleView">
      <div class="flex justify-between">
        <button class="btn btn-sm" @click="$auth.logout()">Logout</button>
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
      this.view = this.view == 'compact' ? 'open' : 'compact'
    }
  },
}
</script>