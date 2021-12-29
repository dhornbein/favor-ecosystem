<template>
  <main>
    
    <header>
      <ActionSearch 
        placeholder="Search Transactions" 
        v-model="search" 
        :keys="searchKeys"
        :search="transactions"
        @results="searchRender" 
      />
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
  data() {
    return {
      search: '',
      searchResults: [],
      searchKeys: ['payee', 'recipient', 'title', 'description'],
    }
  },
  computed: {
    ...mapState(['transactions']),
    filteredTransactions() {
      let transactions = this.transactions
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
