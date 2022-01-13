<template>
  <article>
    <h1>That's it, you're ready to go!</h1>

    <p>Before you go, please consider installing this webapp as a phone app, just click the button below and follow the prompts</p>

    <button class="btn">Add to homescreen</button>

    <p>Head over to the exchange to send someone some Favor!</p>

    <nuxt-link to="/exchange" class="text-center inline-block my-4 rounded-full bg-brand-primary text-yellow-500 font-bold px-4 py-2 text-2xl">Send Favor</nuxt-link>

    <p>Or just start poking around!</p>

    <MainNav ref="nav" class="mt-4 w-full -m-2 shadow-none" />
  </article>
</template>

<script>
export default {
  head: {
    title: 'Last Thing | Onboarding'
  },
}
</script>