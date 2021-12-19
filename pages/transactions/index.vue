<template>
  <main>
    
    <header>
      <h2>Transactions</h2>
    </header>
      
    <div>
      <TransactionCard v-for="(row, idx) in trans" isSlim :key="idx" :row="row" />
    </div>

  </main>
</template>

<script>
export default {
  async asyncData ({ $http }) {
    const trans = await $http.$get('/api/transactions')

    return {
      trans
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
