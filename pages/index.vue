<template>
  <div class="container">
    <div>
      <Header />

      <h1 class="title">
        Favor Solutions Network
      </h1>
      <div style="text-align:left">
        <pre>{{ stats.data }}</pre>

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
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.submission-button {
  font-size: .8rem;
   margin: 2rem 0;
    min-width: 40vw;
    padding: 1.5rem;
    color: white;
    border-radius: 12px;
    background-color: #601d46;
}

.submission-button:hover {

  cursor: pointer;
  background-color: #e79f39;
}

.links {
  padding-top: 15px;
  margin: 5px
}
</style>
