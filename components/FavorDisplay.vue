<template>
  <div class="favor-display">
    <span class="favor-display__label" v-if="label">{{ label }}</span>
    <div class="favor-display__num" :class="{'favor-display__num--neg': num < 0}">
      <span class="-mr-2">f</span>
      <span class="font-bold">{{ num | favor }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null
    },
    num: {
      type: Number,
      required: true
    },
  },
}
</script>

<style lang="scss">
.favor-display {

  .favor-display__label {
    @apply text-sm;
  }
  .favor-display__num {
    @apply font-mono text-lg whitespace-nowrap;

    &.favor-display__num--neg {
      @apply text-purple-500;
    }
  }
}
</style>