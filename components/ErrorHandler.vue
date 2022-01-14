<template>
  <aside class="p-5 my-5 bg-red-200 border-l-2 border-current text-red-700">
    <h1 class="text-4xl text-brand-primary font-mono my-2">
      {{ error.code }}
    </h1>
    <h2 class="text-lg text-brand-gray-800 font-mono">
      {{ error.message }}
    </h2>
    <div @click="moreError = !moreError" class="cursor-pointer">
      <span class="" v-if="moreError">&#10225; More Details</span>
      <span class="" v-else>&#10224; Less Details</span>
    </div>
    <pre class="text-left" v-if="moreError">{{ error }}</pre>
  </aside>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      moreError: true
    }
  },
}
</script>
