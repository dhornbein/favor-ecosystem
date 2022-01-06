<template>
  <main>
      
    <TransactionCard v-for="(row, idx) in transaction" size="full" :key="idx" :row="row" />

  </main>
</template>

<script>

export default {
  computed: {
    transaction() {
      return this.$store.getters.getTransactionsByUid(this.$route.params.uid);
    }
  },


    

}
</script>

<style lang="scss" scoped>

</style>
