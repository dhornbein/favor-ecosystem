<template>
  <main class="view-layout">
    <MainNav ref="nav" class="foot fixed top-0 left-0 right-0" />
    
    <nuxt class="content mb-12 p-2" :style="{ marginTop: navHeight + 'px'}" />
    
    <div class="flex justify-between items-center fixed bottom-0 right-0 left-0 p-2">
      <nuxt-link to="/exchange" class="text-center rounded-full bg-brand-primary text-brand-gold font-bold px-4 py-2 text-2xl">
        <svg class="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        Send Favor
      </nuxt-link>
      <ChatBot class="w-12 h-12" />
    </div>
  </main>
</template>

<script>
/**
 * The main layout
 * has the main nav, content, send favor, and chat bot
 */
export default {
  data() {
    return {
      navHeight: 90,
    }
  },
  mounted() {
    this.navHeight = this.$refs.nav.$el.offsetHeight
  },
}
</script>

<style lang="scss">
</style>