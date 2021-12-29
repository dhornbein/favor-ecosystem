<template>
  <main>
    
    <header>
      <ActionSearch placeholder="Search" v-model="search" />
      <h2>Members</h2>
    </header>

    <MemberCard 
      class="my-2 pt-2 pb-4 border-b border-gray-200" 
      v-for="(row, idx) in members" 
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
      view: 'compact'
    }
  },
  computed: {
    ...mapState(['members']),
  },
  methods: {
    cardClicked(row) {
    }
  },
}
</script>