<template>
  <main class="flex flex-col justify-center">
      
    <TransactionCard size="full" :trans="transaction" />

  </main>
</template>

<script>

export default {
  head() {
    return {
      title: `${transaction.title} | Transaction`
    }
  },
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
