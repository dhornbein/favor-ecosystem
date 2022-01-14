<template>
  <div class="search">
    <input class="input" v-bind="$attrs" :value="value" @input="searchRender">
  </div>
</template>

<script>
const fuzzysort = require('fuzzysort')

export default {
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: '',
    },
    keys: {
      type: Array,
      required: true
    },
    search: {
      type: Array,
      required: true
    },
  },
  methods: {
    searchInput() {
      
    },
    searchRender(e) {
      const results = fuzzysort.go(e.target.value, this.search, {
        keys: this.keys,
        allowTypo: true,
        threshold: -1000,
      })
      // return results only if there is something in the input
      let out = (e.target.value != '') ? results.map(r => r.obj) : []
      this.$emit('results', out)
      this.$emit('input', e.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  .input {
    background-image: url('data:image/svg+xml;utf8,<svg class="search-icon" fill="none" stroke="%23C1D1E1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>');
    background-repeat: no-repeat;
    background-position: 0.5rem center;
    background-size: 1.5rem;
    @apply pl-10;
    &:focus {
      background-image: url('data:image/svg+xml;utf8,<svg class="search-icon" fill="none" stroke="%23601d46" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>');
    }
  }
}
</style>