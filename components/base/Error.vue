<template>
  <div class="error-box">
    <p class="error-box__title">Error!</p>
    <div class="error-box__message">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.error-box {
  @apply p-4 border-l-2 border-red-500 bg-red-100;
  .error-box__title {
    @apply text-red-500 font-bold;
  }
}
</style>