<template>
  <main>
    
    <MemberCard :member="member" size="open">
      <nuxt-link :to="`/exchange/pay/${member.username}`" class="btn has-text-sm is-primary is-rounded-full" v-if="!isMe">
        <svg class="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        Pay {{ member.firstName }}
      </nuxt-link>
    </MemberCard>

    <h2 class="text-xl font-cormorant">{{ member.firstName }}'s Recent Transactions</h2>
    
    <TransactionCard v-for="(row, idx) in memberTransactions.slice().reverse()" :focusUid="member.uid" :key="idx" ref="card" :trans="row" size="compact" @click="clickTransaction(idx)" />

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
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