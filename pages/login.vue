<template>
  <div>
    <h1 class="text-2xl my-4">Log In</h1>
    <form @submit.prevent="userLogin">
      <div>
        <BaseInput label="Username" type="text" v-model="login.username" required />
      </div>
      <div>
        <BaseInput label="Password" type="password" v-model="login.password" required />
      </div>
      <div class="py-4">
        <button class="btn" type="submit">Submit</button>
      </div>
    </form>
    <p>Don't have an account? <nuxt-link to="/join" class="font-bold text-brand-primary">Join Favor!</nuxt-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login: {
        username: 'DrewH',
        password: 'time2GO@'
      }
    }
  },
  methods: {
    async userLogin() {
      try {
        let response = await this.$auth.loginWith('local', { data: this.login })
        this.$store.dispatch('chat/broadcastResponse', {
          response: response,
          title: 'login successful',
        })
      } catch (error) {
        this.$store.dispatch('chat/broadcastErrorResponse', {
          response: error,
        })
      }
    }
  }
}
</script>