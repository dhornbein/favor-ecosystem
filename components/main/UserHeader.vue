<template>
  <header>
    <MemberCard class="p-2 shadow-lg border-b border-gray-400" :size="view" :member="$auth.user" @cardClick="toggleView" />
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