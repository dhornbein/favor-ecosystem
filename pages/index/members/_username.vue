<template>
  <main>
    
    <MemberCard :member="member" size="open" />

    <h2 class="text-xl font-cormorant">{{ member.firstName }}'s Recent Transactions</h2>
    
    <TransactionCard v-for="(row, idx) in memberTransactions.slice().reverse()" :key="idx" :trans="row" />

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head () {
    return {
      title: `User: ${this.fullName}`
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['transactions','members']),
    member() {
      return this.$store.getters.getMemberByUsername(this.$route.params.username);
    },
    memberTransactions() {
      return this.$store.getters.getTransactionsByMemberUUID(this.member.uuid);
    },
    isBroker() {
      return this.row.roles ? this.row.roles.includes('broker') : false
    },
    fullName() {
      return this.member.firstName + ' ' + this.member.lastName
    },
  },
}
</script>