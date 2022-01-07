<template>
  <section>
    <ActionSearch 
      placeholder="Search" 
      v-model="search" 
      :keys="searchKeys"
      :search="members.filter(m => m.uid !== $auth.user.uid)"
      @results="searchRender" 
    />
    <div class="p-2 text-sm text-red-500" v-if="searchResults.length < 1 && search.length > 0">No members found...</div>
    <h2 class="text-xl font-cormorant my-2" v-if="searchResults.length < 1">Frequent Exchanges</h2>
    <MemberCard 
      class="my-2 cursor-pointer"
      v-for="(member, idx) in filteredMembers"
      :key="idx" 
      :member="member" 
      @cardClick="cardClick(member.username)" 
      view="compact"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'action',
  data() {
    return {
      search: '',
      searchResults: [],
      searchKeys: ['username', 'email', 'firstName', 'lastName'],
    }
  },
  computed: {
    ...mapState(['members']),
    filteredMembers() {
      const recent = this.$store.getters.getRelatedMembers(this.$auth.user.uid)

      return (this.searchResults.length > 0) ? this.searchResults : recent

    },
  },
  methods: {
    searchRender(results) {
      this.searchResults = results
    },
    cardClick(username) {
      this.$router.push(`/exchange/pay/${username}`)
    }
  }
}
</script>