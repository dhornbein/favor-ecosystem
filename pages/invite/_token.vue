<template>
  <main v-if="authorized">
    <h1 class="text-2xl">Share your invite</h1>

    <BaseInput label="URL" type="text" readonly value="https://app.favor.solutions/invite/asdf8asyd9fa8whofanslvaisbvoas8dfbasdlfasbdfad7gf" />

    <!-- TODO share buttons and QR code -->
  </main>
  <main v-else>
    <h1 class="text-2xl">Claim your invite</h1>

    <!-- TODO add signup form here -->
  </main>
</template>

<script>
export default {
  layout ({ $auth }) {
    return ($auth.user) ? 'action' : 'default'
  },
  auth: false,
  computed: {
    authorized() {
      return this.$auth.loggedIn
    }
  }
}
</script>