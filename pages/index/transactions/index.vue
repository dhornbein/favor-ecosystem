<template>
  <main>
    
    <header>
      <ActionSearch 
        placeholder="Search Network Transactions"
        class="search-field"
        v-model="search" 
        :keys="searchKeys"
        :search="transactions"
        @results="searchRender" 
      />
    </header>
      
    <div>
      <TransactionCard v-for="(row, idx) in filteredTransactions" :key="idx" ref="card" :trans="row" size="compact" @click="clickTransaction(idx)" />
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
    clickTransaction(idx) {
      const target = this.$refs.card[idx]
      let size = target.currentSize == 'compact' ? 'full' : 'compact'
      target.setSize(size)
    },
  },
}
</script>