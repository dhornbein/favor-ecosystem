<template>
  <div class="input">
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