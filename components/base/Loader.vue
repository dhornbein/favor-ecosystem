<template>
  <div class="loader">
    <div class="spinner"></div>
    <div role="status">
      <slot>Loading...</slot>
    </div>
  </div>
</template>

<style lang="scss">
.loader {
  @apply absolute inset-0 z-50 flex flex-col gap-4 justify-center items-center w-full h-full bg-white bg-opacity-80 text-4xl text-purple-900;
  .spinner {
    @apply animate-spin inline-block w-16 h-16 border-4 rounded-full border-purple-900;
    border-right-color: transparent;
  }
}
</style>