<template>
  <figure class="member-icon" :class="cssClass">
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
  },
  data() {
    return {
      classDefault: {
        'member-icon__alt': this.alt,
      }
    }
  },
  filters: {
    abbreviate(str) {
      return str.match(/[A-Z]/g).join('')
    }
  },
  computed: {
    cssClass() {
      if ( this.username === 'FSN' ) this.classDefault['member-icon__network'] = true
      return this.classDefault
    }
  }
}
</script>

<style lang="scss">
.member-icon {
  @apply border border-brand-primary bg-brand-primary text-yellow-400 text-center align-middle p-1 rounded-full h-10 w-10 text-sm flex justify-center items-center;
  &.member-icon__network {
    @apply border-yellow-400 font-bold text-brand-primary;
  }
  &.member-icon__alt {
    @apply bg-yellow-200 text-brand-primary;
  }
}
</style>