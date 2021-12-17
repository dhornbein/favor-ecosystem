<template>
  <div class="container">
    <div>
      <Header />

      <h1 class="title font-logo text-2xl text-brand-primary">
        Favor Solutions Network
      </h1>
      <div style="text-align:left">
        <h2 class="text-xl font-cormorant">The API is fresh</h2>
        <pre>{{ !!stats.data }}</pre>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ $http }) {
    const stats = await $http.$get('/api/stats')

    return {
      stats
    }
  }
}
</script>

<style scoped>

</style>
