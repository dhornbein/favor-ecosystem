<template>
    <nav class="flex justify-center">
      <nuxt-link :to="item.url" v-for="(item, idx) in nav" :key="idx"
        class="mx-5 mb-5 px-10 bg-brand-primary text-white p-2 rounded-b-lg hover:bg-yellow-500 hover:text-brand-primary"
      >{{ item.title }}</nuxt-link>
    </nav>
</template>

<script>
  export default {
    data() {
      return {
        nav: [
          {
            title: 'Summary',
            url: '/summary'
          }, 
          {
            title: 'Ledger',
            url: '/ledger'
          }, 
          {
            title: 'transactions',
            url: '/transactions'
          }, 
          {
            title: 'Members',
            url: '/members'
          },
        ]
      }
    }
  }
</script>
