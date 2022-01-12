<template>
  <main class="onboard">
    <nuxt-child class="onboard__page" @next="nextPage" />
    <div class="onboard__nav">
      <nuxt-link :to="previous" v-if="previous">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </nuxt-link>
      <div v-else>
        <svg class="w-6 h-6 stroke-current text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </div>
      <nuxt-link :to="step" class="dot" v-for="step in steps" :key="step" :class="{ current: step == $route.path }"></nuxt-link>
      <nuxt-link :to="next">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </nuxt-link>
    </div>
  </main>
</template>

<script>
export default {
  layout: 'blank',
  data() {
    return {
      steps: [
        '/onboard',
        '/onboard/money',
        '/onboard/credit',
        '/onboard/fees',
        '/onboard/join',
      ]
    }
  },
  methods: {
    nextPage() {
      const index = this.steps.indexOf(this.$route.path)
      if (index < this.steps.length - 1) {
        this.$router.push(this.steps[index + 1])
      }
    },
  },
  computed: {
    previous() {
      const index = this.steps.indexOf(this.$route.path)
      return this.steps[index - 1]
    },
    next() {
      const index = this.steps.indexOf(this.$route.path)
      return (this.steps[index + 1]) ? this.steps[index + 1] : '/'
    }
  }
}
</script>

<style lang="scss">
.onboard {

  h1 {
    @apply text-2xl mb-2;
  }

  p {
    @apply text-lg mb-2 last:mb-0;
  }
  
  .onboard__page {
    @apply min-h-[80vh] p-2;
  }
  .onboard__nav {
    @apply flex justify-around items-center px-2 py-6;
  }
  .dot {
    @apply w-4 h-4 rounded-full bg-gray-200;
    &.current { @apply bg-purple-500}
  }
}
</style>