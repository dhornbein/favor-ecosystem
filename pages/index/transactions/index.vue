<template>
  <main>
    
    <header>
      <h2>Transactions</h2>
    </header>
      
    <div>
      <TransactionCard v-for="(row, idx) in transactions" :key="idx" :trans="row" size="compact" />
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
