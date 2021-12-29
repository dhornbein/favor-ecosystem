<template>
  <main class="view-layout">
    <MainUserHeader class="header" />
    <nuxt class="content" />
    <MainNav class="foot" />
  </main>
</template>

<script>
export default {
  middleware: 'load-data'
}
</script>

<style lang="scss">

.view-layout {
  @apply flex flex-col h-screen;

  .header {
    // @apply
  }
  .search {
    // @apply
  }
  .content {
    @apply overflow-y-scroll flex-grow p-2;
  }
  .foot {
    @apply mt-auto
  }
}
</style>