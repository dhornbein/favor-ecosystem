<template>
  <section class="flex-col flex justify-center items-center bg-red-700 text-white">
    <div class="text-center p-4 border border-white rounded-md max-w-prose mb-4">
      <h1 class="text-4xl font-mono my-2">
        {{ error.statusCode }}
      </h1>
      <h2 class="text-lg font-mono">
        {{ error.message }}
      </h2>
    </div>
    <div class="max-w-prose mb-4">
      <h1 class="text-lg">The Favor Network Needs your help!</h1>
      <p>When you encounter an error we need to know about it! 
        Please consider what you were trying to do to end up on this error page.
        If you think that this is a bug, please report it to us.
        Email <a href="mailto:webmaster@dhornbein.com" target="_blank" class="font-bold underline">Drew Hornbein</a> 
        with details about what happened here!</p>
    </div>
    <nuxt-link to="/" class="btn bg-white text-brand-primary">Go Back Home</nuxt-link>
  </section>
</template>

<script>
/**
 * Error layout
 * when an error occurs, this layout is displayed
 * begging users to submit the error to the webmaster
 */
export default {
  layout: 'main',
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
