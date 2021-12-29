<template>
  <span class="favor-display">
    <slot></slot>
    <span class="favor-display__num" :class="{'favor-display__num--neg': num < 0}">
      <span v-if="plus">&plus;</span><span class="font-normal">f</span><span>{{ normalizedNum | favor }}</span>
    </span>
  </span>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      required: true
    },
    plus: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    normalizedNum() {
      return this.num < 0 ? -this.num : this.num;
    },
  },
}
</script>

<style lang="scss">
.favor-display {
  .favor-display__num {
    @apply font-mono whitespace-nowrap;

    &.favor-display__num--neg:before {
      content: '\2212'; // minus sign
    }
  }
}
</style>