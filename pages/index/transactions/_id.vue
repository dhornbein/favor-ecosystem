<template>
  <main>
    
    <header>
      <h2>Transactions for {{ member.firstName }}</h2>
    </header>
      
    <div>
      <TransactionCard v-for="(row, idx) in memberTransactions" :key="idx" :row="row" />
    </div>

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['transactions','members']),
    member() {
      return this.$store.getters.getMemberById(this.$route.params.id);
    },
    memberTransactions() {
      return this.$store.getters.getTransactionsByMemberUUID(this.member.uuid);
    }
  },


    

}
</script>

<style lang="scss" scoped>

</style>
