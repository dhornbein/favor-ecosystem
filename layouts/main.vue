<template>
  <main class="view-layout">
    <MainNav ref="nav" class="foot fixed top-0 left-0 right-0" />
    
    <nuxt class="content mb-12 p-2" :style="{ marginTop: navHeight + 'px'}" />
    
    <div class="flex justify-between items-center fixed bottom-0 right-0 left-0 p-2">
      <nuxt-link to="/exchange" class="text-center rounded-full bg-brand-primary text-yellow-500 font-bold px-4 py-2 text-2xl">Send Favor</nuxt-link>
      <ChatBot class="w-12 h-12" />
    </div>
  </main>
</template>

<script>
export default {
  middleware: 'load-data',
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