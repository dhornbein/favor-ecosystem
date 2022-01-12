<template>
  <header v-if="$auth.user">
    <MemberCard :size="view" ref="user" :member="$auth.user">
      <nuxt-link to="/onboard" class="flex gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Onboarding
      </nuxt-link>
      <button class="flex gap-2" @click="$auth.logout()">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        Logout
      </button>
    </MemberCard>
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