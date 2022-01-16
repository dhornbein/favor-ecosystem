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
      class="my-2 pt-2 pb-4 border-b border-brand-gray-200 cursor-pointer" 
      v-for="(row, idx) in filteredMembers" 
      :key="idx" 
      ref="card" 
      :member="row" 
      :view="view" 
      @click="clickCard(row.username)"
    />

    <div class="empty-search text-2xl text-center py-10" v-if="search.length > 0 && searchResults.length == 0">
      🧐 No members found!
    </div>

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head: {
    title: 'Network Members'
  },
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
      return (this.search.length > 0) ? this.searchResults : this.members
    },
  },
  methods: {
    clickCard(username) {
      this.$router.push(`/members/${username}`)
    },
    searchRender(results) {
      this.searchResults = results
    },
  },
}
</script>