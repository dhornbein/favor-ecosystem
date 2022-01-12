<template>
  <article class="onboard__fees">
    <h1>Favor Solutions Network and the {{ $globals.fee * 100 }}% fee</h1>

    <p>The Favor Solutions Network (FSN) is like the bank, it is the entity that manages all the transactions.</p>

    <p>The network charges a {{ $globals.fee * 100 }}% fee on all transactions, check this one out:</p>

    <TransactionCard class="border-b" :trans="exampleTrans" size="open" />

    <p>Deacon paid Drew <BaseFavor :num="exampleTrans.amount" />, each of them paid a {{ $globals.fee / 2 * 100 }}% fee 
    (<BaseFavor :num="exampleTrans.amount * ($globals.fee / 2)" />) on the transaction.</p>

    <p>These fees help the FSN pay it's members (like you) to help maintain the network.</p>

    
  </article>
</template>

<script>
export default {
  computed: {
    exampleTrans() {
      return this.$store.getters.getTransactionsByUid('e691d7ed-c7f4-456e-b77a-89f8c8532221')
    }
  }
}
</script>

<style lang="scss">
.onboard__fees {
  .card .exchange .favor .fee {
    @apply bg-yellow-200 text-green-700;

  }
}
</style>