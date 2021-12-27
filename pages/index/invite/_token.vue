<template>
  <main>
    <h1 class="text-2xl">Share your invite</h1>

    <form action="">
      <BaseInput label="Email" type="text" readonly value="https://app.favor.solutions/invite/asdf8asyd9fa8whofanslvaisbvoas8dfbasdlfasbdfad7gf" />
      
    </form>
  </main>
</template>

<script>
export default {
  layout ({ $auth }) {
    return ($auth.user) ? 'view' : 'default'
  },
  auth: false
}
</script>