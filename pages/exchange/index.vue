<template>
  <section>
    <ActionTitle>Exchange</ActionTitle>
    <ActionSearch 
      placeholder="Search for Member" 
      v-model="search" 
      :keys="searchKeys"
      :search="members.filter(m => m.uid !== $auth.user.uid)"
      @results="searchRender" 
    />
    <div class="p-2 text-sm text-red-500" v-if="searchResults.length < 1 && search.length > 0">No members found...</div>
    <h2 class="text-xl font-cormorant my-2" v-if="searchResults.length < 1 && !noRelations">Frequent Exchanges</h2>
    <h2 class="text-xl font-cormorant my-2" v-else>Fellow Members</h2>
    <MemberCard 
      class="my-2 cursor-pointer"
      v-for="(member, idx) in filteredMembers"
      :key="idx" 
      :member="member" 
      size="mini"
      @click="clickCard(member.username)" 
      view="compact"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'action',
  head: {
    title: 'Exchange'
  },
  data() {
    return {
      search: '',
      searchResults: [],
      searchKeys: ['username', 'email', 'firstName', 'lastName'],
      noRelations: false,
    }
  },
  created() {
    this.$store.dispatch('chat/broadcastOnce', { 
      title: 'Welcome to the Exchange',
      type:'info',
      quiet: true,
      body: 'You can exchange money with fellow members of the network. Just find the person using the search bar and click on their name.',
    })
  },
  computed: {
    ...mapState(['members']),
    filteredMembers() {
      const recent = this.$store.getters.getRelatedMembers(this.$auth.user.uid)
      this.noRelations = recent.length < 1

      return (this.searchResults.length > 0) ? this.searchResults : (this.noRelations) ? this.members : recent

    },
  },
  methods: {
    searchRender(results) {
      this.searchResults = results
    },
    clickCard(username) {
      this.$router.push(`/exchange/pay/${username}`)
    }
  }
}
</script>