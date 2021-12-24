<template>
  <main>

    <header>
      <h2 class="text-xl font-cormorant">Latest Transactions</h2>
    </header>
      
    <div>
      <TransactionCard v-for="(row, idx) in transactions.slice().reverse()" :key="idx" :row="row" />

    </div>

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['transactions'])
  },
}
</script>

<style lang="scss" scoped>

</style>
