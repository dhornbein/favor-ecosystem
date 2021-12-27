<template>
  <main>
    
    <MemberDetails :member="member" v-if="member" />

    <h2 class="text-xl font-cormorant">{{ member.firstName }}'s Transactions</h2>
    
    <TransactionCard v-for="(row, idx) in memberTransactions" :key="idx" :row="row" />

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
      view: 'grid',
    }
  },
  created() {
    this.view = (this.$route.hash) ? this.$route.hash.slice(1) : this.view
  },
  computed: {
    ...mapState(['transactions','members']),
    member() {
      return this.$store.getters.getMemberById(this.$route.params.id);
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
    isGrid() {
      return this.view === 'grid'
    },
    isTable() {
      return this.view === 'table'
    },
  },
  methods: {
    toggleView(view) {
      this.view = view
    }
  },
}
</script>