<template>
  <main>

    <ActionSearch placeholder="Search" v-model="search" />

    <h2 class="text-xl font-cormorant">Your Latest Transactions</h2>
      
    <TransactionCard v-for="(row, idx) in filteredTransactions" :key="idx" :trans="row" />

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      search: ''
    }
  },
  computed: {
    ...mapState(['transactions','members']),
    filteredTransactions() {
      let transactions = this.transactions
      if (this.$auth.user) {
        transactions = this.$store.getters.getTransactionsByMemberUUID(this.$auth.user.uuid);
      }
      return transactions.slice().reverse()
    },
  },
  
}
</script>

<style lang="scss" scoped>

</style>
