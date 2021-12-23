<template>
  <main>
    
    <header>
      <h2>Transactions for {{ member.first_name }}</h2>
    </header>
      
    <div>
      <TransactionCard v-for="(row, idx) in trans" :key="idx" :row="row" />
    </div>

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['transactions','members']),
    member() {
      return this.$store.getters.getMemberById(this.$route.params.id);
    },
    memberTransactions() {
      return this.$store.getters.getTransactionsByMemberUUID(this.member.uuid);
    }
  },
  async fetch({store}) {
    await store.dispatch('getAllTransactionsOnce'), 
    await store.dispatch('getAllMembersOnce')
  }


    

}
</script>

<style lang="scss" scoped>

</style>
