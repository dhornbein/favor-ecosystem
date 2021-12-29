<template>
  <main>

    
    <ActionSearch 
      placeholder="Search Transactions" 
      v-model="search" 
      :keys="searchKeys"
      :search="myTransactions"
      @results="searchRender" 
    />

    <h2 class="text-xl font-cormorant">Your Latest Transactions</h2>
      
    <TransactionCard v-for="(row, idx) in filteredTransactions" :key="idx" :trans="row" />

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      search: '',
      searchResults: [],
      searchKeys: ['payee', 'recipient', 'title', 'description'],
    }
  },
  computed: {
    ...mapState(['transactions','members']),
    myTransactions() {
      return this.$store.getters.getTransactionsByMemberUUID(this.$auth.user.uuid);
    },
    filteredTransactions() {
      let transactions = this.myTransactions
      transactions = (this.searchResults.length > 0) ? this.searchResults : transactions
      return transactions.slice().reverse()
    },
  },
  methods: {
    searchRender(results) {
      this.searchResults = results
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
