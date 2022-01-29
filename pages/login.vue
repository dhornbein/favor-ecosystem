<template>
  <div>
    <BaseLoader class="loader" v-if="loading">Authenticating...</BaseLoader>

    <h1 class="text-2xl my-4">Log In</h1>

    <ValidationObserver 
      class="login-form form"
      ref="form"
      v-slot="{ handleSubmit }"
    >

      <BaseError class="error mb-4" v-if="loginError">{{ loginError }}</BaseError>
    
      <ValidationProvider slim rules="required" v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Username" type="text" v-model="login.username" required />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>

      <ValidationProvider slim rules="required" v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Password" type="password" v-model="login.password" required />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>

      <div class="py-4">
        <button class="btn is-primary text-2xl my-4" type="submit" @click.prevent="handleSubmit(userLogin)">Login</button>
      </div>

    </ValidationObserver>
    <p>Don't have an account? <nuxt-link to="/join" class="font-bold text-brand-primary">Join Favor!</nuxt-link></p>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  head: {
    title: 'Log In'
  },
  data() {
    return {
      loading: false,
      login: {
        username: '',
        password: ''
      },
      loginError: false
    }
  },
  methods: {
    async userLogin() {
      try {
        this.loading = true;
        let response = await this.$auth.loginWith('local', { data: this.login })

        this.$store.dispatch('chat/broadcastResponse', {
          response: response,
          title: 'login successful',
        })

        this.loading = false
      } catch (error) {
        if (error.response.data.error) {
          this.loginError = error.response.data.error[0].msg
        } else {
          // TODO unify error handling response
          this.loginError = error.response.data.title || error.response.data
        }
        
        this.loading = false
      }
    }
  }
}
</script>