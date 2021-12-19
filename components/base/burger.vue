<template>
  <div class="burger" :class="{ 'is-active': active }" @click="$emit('click')">
    Menu
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script>
export default {
  props: ['active']
}
</script>

<style lang="scss">
.burger {
  @apply font-bold;
  &.is-active {
    @apply text-brand-primary;
  }
}
</style>