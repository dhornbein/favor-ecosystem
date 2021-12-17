<template>
  <section class="flex-grow flex justify-center items-center">
    <div class="text-center">
      <Logo />
      <h1 class="text-4xl text-brand-primary font-mono my-2">
        {{ error.statusCode }}
      </h1>
      <h2 class="text-lg text-gray-700 font-mono">
        {{ error.message }}
      </h2>
      <nuxt-link v-if="error.statusCode === 404" class="p-3 mt-2 rounded-md border border-current hover:bg-yellow-500 text-brand-primary inline-block" to="/">
        Homepage
      </nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
