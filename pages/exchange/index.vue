<template>
  <section>
    <ActionSearch 
      placeholder="Search" 
      v-model="search" 
      :keys="searchKeys"
      :search="members.filter(m => m.uuid !== $auth.user.uuid)"
      @results="searchRender" 
    />
    <h2 class="text-xl font-cormorant" v-if="searchResults.length < 1">Frequent Exchanges</h2>
    <MemberCard 
      class="my-2"
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
      const recent = this.$store.getters.getRelatedMembers(this.$auth.user.uuid)

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