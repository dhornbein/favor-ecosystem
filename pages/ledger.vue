<template>
  <main>
    
    <div class="lg:container mx-auto px-5">

      <header class="max-w-3xl mx-auto">
        <Logo />
        <h2 class="text-xl font-cormorant">Ledger</h2>
      </header>
      
      <div class="p-5">
        <TransactionTable :trans="trans" />
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
