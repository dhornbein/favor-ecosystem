<template>
  <main>
      
    <TransactionCard v-for="(row, idx) in transaction" size="full" :key="idx" :row="row" />

  </main>
</template>

<script>

export default {
  async asyncData({ store, route, error }) {
    const transaction = await store.getters.getTransactionsByUid(route.params.uid);
    if (!transaction) {
      store.dispatch('chat/broadcastError', { title: 'Transaction not found...'} )
      error({ statusCode: 404, message: 'Transaction not found...' })
    }
    return { transaction }
  },  
}
</script>
