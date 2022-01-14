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

    <div class="empty-search text-2xl text-center py-10" v-if="search.length > 0 && searchResults.length == 0">
      😳 Transactions not found!
    </div>

    <div class="empty-state text-2xl text-center py-10" v-if="search.length == 0 && myTransactions.length <= 0">
      😶 You haven't made any transactions yet.
    </div>

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head: {
    title: 'Your Account'
  },
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
  @apply my-4 px-0;
}

.page-title {
  @apply text-xl my-2 font-cormorant;
}

</style>
