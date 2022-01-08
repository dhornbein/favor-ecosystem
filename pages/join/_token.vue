<template>
  <div>
    <BaseLoader class="loader" v-if="loading">{{ status }}</BaseLoader>
    <div class="errors text-red-700 text-center" v-if="errors">
      <h1 class="text-xl">There was a problem with this invitation</h1>
      <ul>
        <li v-for="(error, idx) in errors" :key="idx">{{ error.msg }}</li>
      </ul>
      <nuxt-link to="/join" class="btn mt-4 text-brand-primary">Join Wait list</nuxt-link>
    </div>
    <ValidationObserver 
      class="flex flex-col gap-2 justify-between max-w-prose mx-auto"
      tag="form"
      ref="form"
      v-else-if="member"
      v-slot="{ invalid, handleSubmit }"
    >
      <h1 class="text-2xl mb-4 text-center">You've been invited to join Favor</h1>
      <div class="notice text-sm text-red-400 p-2 text-center">&nbsp;
        <span v-if="invalid">A valid <strong>Username</strong> and <strong>Email</strong> are required</span>
      </div>
      <div class="flex gap-2 flex-col md:flex-row">
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control flex-grow" :class="classes">
          <BaseInput label="First Name" required type="text" v-model="member.firstName" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control flex-grow" :class="classes">
          <BaseInput label="Last Name" type="text" v-model="member.lastName" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      </div>
      <ValidationProvider slim rules="required" v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Email" required type="email" v-model="member.email" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim rules="required" v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Username" required type="text" v-model="member.username" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Phone" type="phone" v-model="member.phone" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }" vid="confirmation">
        <div class="control" :class="classes">
          <BaseInput label="Password" type="password" v-model="member.passwordConfirm" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim rules="confirmed:confirmation" v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Password Confirm" type="password" v-model="member.password" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim>
        <input label="invitedByUid" type="hidden" v-model="member.invitedByUid" />
      </ValidationProvider>
      <button class="btn is-primary text-2xl my-4" :disabled="invalid" @click.prevent="handleSubmit(handleForm)">Create your Account</button>
    </ValidationObserver>

    <ChatBot class="fixed bottom-2 right-2 w-12 h-12" />
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  auth: false,
  async asyncData({ route, $axios }) {
    try {
      const response = await $axios.get(`api/members/join/${route.params.token}`);
      if (response.data.success) {
        return {
          member: response.data.data,
          errors: false,
          token: route.params.token
        }
      } else {
        console.error('Error from successful api call to members/join/:token',error)
      }
    } catch (error) {
      console.error('Caught error from unsucessful api call to members/join/:token',error.response)
      if (422 == error.response.status) {
        return {
          errors: error.response.data.error,
          member: false
        }
      } else {
        return {
          errors: true,
          member: false
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      status: 'Loading...',
    }
  },
  methods: {
    async handleForm() {
      this.loading = true;
      this.$refs.form.validate().then(async success => {
        
        if (!success) {
          this.loading = false;
          return;
        }

        try {
          this.status = 'Creating Account...';
          const response = await this.$axios.post(`api/members/join/${this.token}`, this.member)
          
          if (response.status != 201) {
            // TODO better error handling here
            throw new Error('unknown error')
          }

          this.status = 'Account Created! Logging in...';

          this.$store.dispatch('chat/broadcastResponse', { 
            response: response,
            title: 'Account created!',
            message: `You successfully created an account!`,
          })

          // login
          try {
            const responseLogin = await this.$auth.loginWith('local', { 
              data: {
                username: this.member.username,
                password: this.member.password
              }
            })

            this.$store.dispatch('chat/broadcastResponse', {
              response: responseLogin,
              title: 'login successful',
            })

            // send to ionboarding
            this.$router.push(`/onboard`)

          } catch (error) {
            console.log('error logging in', error);
            throw new Error('logging in unknown error')
            this.$store.dispatch('chat/broadcastErrorResponse', {
              response: error.response,
            })
          }
          this.loading = false
        } catch (error) {
          console.log('error creating account', error);
          this.$store.dispatch('chat/broadcastErrorResponse', {
            response: error.response,
          })
          this.loading = false
        }
      });
    }
  }
}
</script>