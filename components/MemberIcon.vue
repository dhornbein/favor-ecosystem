<template>
  <figure class="member-icon" :class="cssClass" :title="username">
    <span>{{ username | abbreviate }}</span>
  </figure>
</template>

<script>
export default {
  props: {
    username:{
      type: String,
      required: true
    },
    alt: {
      type: Boolean,
      default: false
    },
    highlight: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    abbreviate(str) {
      if ( str === 'FSN' ) return str
      return (str.match(/[A-Z]/g)) ? str.match(/[A-Z]/g).join('').slice(0,2) : '??'
    }
  },
  computed: {
    cssClass() {
      return {
        'member-icon__highlight': this.highlight,
        'member-icon__network': this.username === 'FSN',
        'member-icon__alt': this.alt,
      }
    }
  }
}
</script>

<style lang="scss">
.member-icon {
  @apply border border-brand-primary bg-yellow-100 text-brand-primary text-center align-middle p-1 rounded-full h-10 w-10 text-sm flex justify-center items-center;
  &.member-icon__network {
    @apply bg-yellow-400 text-brand-primary font-bold;
  }
  &.member-icon__alt {
    @apply bg-yellow-100 text-brand-primary;
  }
  &.member-icon__highlight {
    @apply bg-brand-primary text-yellow-400;
  }
}
</style>