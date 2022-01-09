<template>
  <main>

    <MainUserHeader class="header" />
    
    <ActionSearch 
      placeholder="Search Your Transactions" 
      class="search-field"
      v-model="search" 
      :keys="searchKeys"
      :search="myTransactions"
      @results="searchRender" 
    />

    <h2 class="page-title">Your Latest Transactions</h2>
      
    <TransactionCard 
      v-for="(row, idx) in filteredTransactions" 
      :focusUid="$auth.user.uid" 
      :key="idx" ref="card"
      :trans="row" 
      @click="clickTransaction(idx)"
    />

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
      return this.$store.getters.getTransactionsByMemberUid(this.$auth.user.uid);
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
    clickTransaction(idx) {
      const target = this.$refs.card[idx]
      let size = target.currentSize == 'compact' ? 'full' : 'compact'
      target.setSize(size)
    },
  },
}
</script>

<style lang="scss">

.search-field {
  @apply my-2;
}

.page-title {
  @apply text-xl my-2 font-cormorant;
}

</style>
