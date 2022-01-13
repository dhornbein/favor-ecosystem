<template>
  <main>

    <div class="bg-red-200 text-red-900 border-l-2 border-current p-4">
      <strong>You need an invite token!</strong>
      <p>Favor is invite only, you need to connect with a member and ask for an invitation. Fill out the form below to be added to our wait list.</p>
      </div>

    <h1 class="text-2xl">Join</h1>

    <form action="">
      <div class="">
        <BaseInput label="First Name" type="text" class="flex-shrink" />
        <BaseInput label="Last Name" type="text" class="flex-shrink" />
      </div>
      <BaseInput label="Email" type="email" />
      <BaseInput label="Phone" type="phone" />
      <button class="btn is-primary text-2xl">Join Wait List</button>
    </form>
  </main>
</template>

<script>
export default {
  auth: false,
  head: {
    title: 'Join'
  },
}
</script>