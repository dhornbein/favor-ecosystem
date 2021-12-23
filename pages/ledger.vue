<template>
  <main>
    
    <header>
      <h2>Ledger</h2>
    </header>
      
    <div class="overflow-x-scroll">
      <DataTable :trans="trans" :showCols="['payee','recipient','amount','fee','title','description']" />
    </div>

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['transactions'])
  },
  async fetch({store}) {
    await store.dispatch('getAllTransactionsOnce');
  }
}
</script>

<style lang="scss" scoped>

</style>
