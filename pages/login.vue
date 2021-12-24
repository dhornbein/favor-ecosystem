<template>
  <div>
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
        console.log('login',response)
      } catch (err) {
        console.log('login',err)
      }
    }
  }
}
</script>