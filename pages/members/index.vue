<template>
  <main>
    
    <header>
      <h2>Members</h2>
      <a href="#table" @click="toggleView('table')" class="btn" :class="{ 'is-active': isTable}">Table</a>
      <a href="#grid" @click="toggleView('grid')" class="btn" :class="{ 'is-active': isGrid}">Grid</a>
    </header>

    <div class="py-5 flex flex-wrap" v-if="isGrid">
      <div class="w-full md:w-1/2 lg:w-1/3 p-4" v-for="(row, idx) in members" :key="idx">
        <MemberCard class="h-full" :row="row" />
      </div>
    </div>

    <div class="py-5 overflow-x-scroll" v-if="isTable">
      <DataTable :trans="members" :showCols="['ID','username','credit_limit','balance','transaction_total']" />
    </div>


  </main>
</template>

<script>
export default {
  async asyncData ({ $http }) {
    const data = await $http.$get('/api/members')
    return { members: data }
  },
  head () {
    return {
      title: 'Users'
    }
  },
  data() {
    return {
      view: 'grid'
    }
  },
  created() {
    this.view = (this.$route.hash) ? this.$route.hash.slice(1) : this.view
  },
  computed: {
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