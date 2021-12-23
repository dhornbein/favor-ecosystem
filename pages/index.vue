<template>
  <main>

    <header>
      <h2 class="text-xl font-cormorant">Latest Transactions</h2>
    </header>
      
    <div>
      <TransactionCard v-for="(row, idx) in transactions" :key="idx" :row="row" />

    </div>

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['transactions'])
  },
  async fetch({store}) {
    await store.dispatch('getAllTransactionsOnce');
  }
}
</script>

<style lang="scss" scoped>

</style>
