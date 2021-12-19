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
export default {
  async asyncData ({ $http }) {
    const trans = await $http.$get('/api/transactions')

    return {
      trans
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
