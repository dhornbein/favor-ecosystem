<template>
  <main>
    
    <div class="lg:container mx-auto px-5">

      <header class="max-w-3xl mx-auto">
        <Logo />
        <h2 class="text-xl font-cormorant">Transactions</h2>
      </header>
      
      <div class="max-w-3xl mx-auto py-5">
        <TransactionCard v-for="(row, idx) in trans.data" :key="idx" :row="row" />
      </div>

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
