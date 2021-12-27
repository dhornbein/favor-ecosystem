<template>
  <main>
      
    <div>

      <MemberDetails :member="$auth.user" v-if="$auth.user" />

      <h2 class="text-xl font-cormorant">Latest Transactions</h2>
      
      <TransactionCard v-for="(row, idx) in filteredTransactions" :key="idx" :row="row" />

    </div>

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
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
