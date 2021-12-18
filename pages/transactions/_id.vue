<template>
  <main>
    
    <div class="lg:container mx-auto px-5">

      <header class="max-w-3xl mx-auto">
        <Logo />
        <h2 class="text-xl font-cormorant">Transactions for {{ member.first_name }}</h2>
      </header>
      
      <div class="max-w-3xl mx-auto py-5">
        <TransactionCard v-for="(row, idx) in trans" :key="idx" :row="row" />
      </div>

    </div>

  </main>
</template>

<script>
export default {
  asyncData ({ params, error, $http }) {
    return Promise.all([
      $http.$get('/api/transactions/' + params.id), 
      $http.$get('/api/members/' + params.id)
    ])
    .then(function([trans,member]) {
      return { trans, member }
    })
    .catch((e) => {
      console.log(e);
      error({ statusCode: 404, message: 'Member not found for id: ' + params.id })
    });
  },
}
</script>

<style lang="scss" scoped>

</style>
