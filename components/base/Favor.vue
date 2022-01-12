<template>
  <span class="favor-display">
    <slot></slot>
    <span class="favor-display__num" :class="classes">
      <span class="font-normal">f</span><span :data-favor="num" v-if="sup">{{ splitNumber[0] }}.<span class="decimals">{{ splitNumber[1] }}</span></span><span v-else>{{ normalizedNum | favor }}</span>
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
    sup: {
      type: Boolean,
      default: true
    },
  },
  computed: {
    splitNumber() {
      return parseFloat(this.normalizedNum).toFixed(3).toString().split('.');
    },
    normalizedNum() {
      return this.num < 0 ? -this.num : this.num;
    },
    classes() {
      return {
        'favor-display__num--neg': this.num < 0,
        'favor-display__num--plus': this.plus && this.num > 0
        }
    }
  },
}
</script>

<style lang="scss">
.favor-display {
  .favor-display__num {
    @apply font-mono whitespace-nowrap;

    .decimals {
      @apply text-sm;
      vertical-align: super;
    }

    &.favor-display__num--neg:before {
      content: '\2212'; // minus sign
    }
    &.favor-display__num--plus:before {
      content: '\002B'; // plus sign
    }
  }
}
</style>