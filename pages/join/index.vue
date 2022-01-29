<template>
  <main>

    <nuxt-link to="/" class="fixed top-2 right-2">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </nuxt-link>

    <div class="text-center">
      <h1 class="text-2xl">Join Wait List</h1>
      <p>Favor is currently invite only.</p>
    </div>

    <ValidationObserver 
      class="form flex flex-col gap-2 justify-between max-w-prose mx-auto"
      tag="form"
      ref="form"
      v-if="!showThankYou"
      v-slot="{ invalid, handleSubmit }"
    >

      <ValidationProvider slim rules="required" v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Email" required type="email" v-model="applicant.email" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>

      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Phone" type="phone" v-model="applicant.phone" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>

      <div class="flex gap-2 flex-col md:flex-row">

        <ValidationProvider slim v-slot="{ errors, classes }">
          <div class="control flex-grow" :class="classes">
            <BaseInput label="First Name" type="text" v-model="applicant.firstName" />
            <div class="input-meta">
              <span class=errors>{{ errors[0] }}</span>
            </div>
          </div>
        </ValidationProvider>

        <ValidationProvider slim v-slot="{ errors, classes }">
          <div class="control flex-grow" :class="classes">
            <BaseInput label="Last Name" type="text" v-model="applicant.lastName" />
            <div class="input-meta">
              <span class=errors>{{ errors[0] }}</span>
            </div>
          </div>
        </ValidationProvider>

      </div>

      <button class="btn is-primary text-2xl my-4" :disabled="invalid" @click.prevent="handleSubmit(handleForm)">Join Wait List</button>
    </ValidationObserver>
    <div class="max-w-prose mx-auto p-2" v-if="showThankYou">
      <h1 class="text-xl mb-2">Thank you for joining</h1>
      <p>We will be in touch soon about how to join.</p>
    </div>
  </main>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  auth: false,
  head: {
    title: 'Join'
  },
  data() {
    return {
      loading: false,
      showThankYou: false,
      status: 'Loading...',
      applicant: {}
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
          this.status = 'Adding to wait list...';
          // just post to mailchimp for now?
          // const response = await this.$axios.post('api/members/waitlist', this.member)
          
          // if (response.status != 201) {
          //   // TODO better error handling here
          //   throw new Error('unknown error')
          // }

          this.loading = false
          this.showThankYou = true;
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