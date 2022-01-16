<template>
  <div class="min-h-screen flex flex-col gap-4 items-center pt-6">

    <Logo class="flex-col items-center" />
    <Nuxt class="default-container" />
      
  </div>
</template>

<style lang="scss">
.default-container{
  @apply container mx-auto px-5;
  .container-fill{
    @apply -mx-5;
  }
}
</style>
