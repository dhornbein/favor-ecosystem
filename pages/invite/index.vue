<template>
  <main>
    <h1 class="text-2xl">Invite your Friend to Favor</h1>

    <form action="">
      <div class="">
        <BaseInput label="First Name" type="text" class="flex-shrink" />
        <BaseInput label="Last Name" type="text" class="flex-shrink" />
      </div>
      <BaseInput label="Email" type="email" />
      <BaseInput label="Phone" type="phone" />
      <button class="btn btn-primary text-2xl" @click="this.$router.push('/invite/asd9fha9w8eh')">Create Invitation</button>
    </form>
  </main>
</template>

<script>
export default {
  layout: 'action',
}
</script>