<template>
  <div class="min-h-screen flex flex-col">

    <LayoutHeader />

    <Nuxt class="default-container" />
      
  </div>
</template>

<script>

export default {
  middleware: 'load-data'
}
</script>

<style lang="scss">
.default-container{
  @apply container mx-auto px-5;
  .container-fill{
    @apply -mx-5;
  }
}
</style>
