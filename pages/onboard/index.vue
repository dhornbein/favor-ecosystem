<template>
  <article>
    <h1>Welcome to the Favor Solutions Network!</h1>

    <p>You are member number {{ $store.state.members.length }}! We are so happy to have you.</p>

    <p>The following pages will help you better understand Favor and how to use this app. 
      If you'd rather just get right into things click the button below. You can always come back
      to the onboarding presentation from your home page.</p>


      <p class="flex gap-4 justify-around">
        <nuxt-link to="/" class="btn">Skip the onboarding</nuxt-link>
        <a @click="$emit('next')" class="btn is-primary">Carry on!</a>
      </p>
  </article>
</template>

<script>
export default {
  head: {
    title: 'Onboarding'
  },
}
</script>