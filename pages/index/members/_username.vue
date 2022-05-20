<template>
  <main>
    
    <MemberCard :member="member" size="open" />

    <h2 class="text-xl font-cormorant">{{ member.firstName }}'s Recent Transactions</h2>
    
    <TransactionCard v-for="(row, idx) in memberTransactions.slice().reverse()" :focusUid="member.uid" :key="idx" ref="card" :trans="row" size="compact" @click="clickTransaction(idx)" />

    <div class="empty-state text-2xl text-center py-10" v-if="memberTransactions.length <= 0">
      😶 {{ member.firstName }} hasn't made any transactions yet.
    </div>

  </main>
</template>

<script>
/**
 * Single member page
 * Shows individual member information based on the member Username
 */
import { mapState } from 'vuex'

export default {
  middleware: ['redirect-user'],
  async asyncData({ store, route, error }) {
    const member = await store.getters.getMemberByUsername(route.params.username);
    if (!member) {
      store.dispatch('chat/broadcastError', { title: `Member "${route.params.username}" not found...`} )
      error({ statusCode: 404, message: `Member "${route.params.username}" not found...` })
    }
    return { member }
  },
  head () {
    return {
      title: `${this.fullName} | Member`
    }
  },
  computed: {
    ...mapState(['transactions','members']),
    memberTransactions() {
      return this.$store.getters.getTransactionsByMemberUid(this.member.uid);
    },
    isBroker() {
      return this.row.roles ? this.row.roles.includes('broker') : false
    },
    fullName() {
      return this.member.firstName + ' ' + this.member.lastName
    },
    isMe() {
      return this.member.uid === this.$auth.user.uid
    }
  },
  methods: {
    clickTransaction(idx) {
      const target = this.$refs.card[idx]
      let size = target.currentSize == 'compact' ? 'full' : 'compact'
      target.setSize(size)
    },
  },
}
</script>