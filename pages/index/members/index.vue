<template>
  <main>
    
    <header>
      <ActionSearch 
        placeholder="Search Members"
        class="search-field"
        v-model="search" 
        :keys="searchKeys"
        :search="members"
        @results="searchRender" 
      />
    </header>

    <MemberCard 
      class="my-2 pt-2 pb-4 border-b border-gray-200 cursor-pointer" 
      v-for="(row, idx) in filteredMembers" 
      :key="idx" 
      ref="card" 
      :member="row" 
      :view="view" 
      @click="clickCard(row.username)"
    />

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      search: '',
      view: 'compact',
      search: '',
      searchResults: [],
      searchKeys: ['username', 'email', 'firstName', 'lastName'],
    }
  },
  computed: {
    ...mapState(['members']),
    filteredMembers() {
      return (this.searchResults.length > 0) ? this.searchResults : this.members
    },
  },
  methods: {
    clickCard(username) {
      if (username == this.$auth.user.username) {
        this.$router.push(`/`)
      } else {
        this.$router.push(`/members/${username}`)
      }
    },
    searchRender(results) {
      this.searchResults = results
    },
  },
}
</script>