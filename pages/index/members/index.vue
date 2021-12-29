<template>
  <main>
    
    <header>
      <ActionSearch 
        placeholder="Search Members" 
        v-model="search" 
        :keys="searchKeys"
        :search="members"
        @results="searchRender" 
      />
      <h2>Members</h2>
    </header>

    <MemberCard 
      class="my-2 pt-2 pb-4 border-b border-gray-200" 
      v-for="(row, idx) in filteredMembers" 
      :key="idx" 
      :ref="idx" 
      :member="row" 
      :view="view" 
      @cardClick="cardClicked"
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
    cardClicked(row) {
    },
    searchRender(results) {
      this.searchResults = results
    },
  },
}
</script>