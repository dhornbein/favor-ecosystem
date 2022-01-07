<template>
  <main class="flex flex-col justify-center">

    <BaseLoader class="loader" v-if="loading"/>

    <ValidationObserver 
      class="flex flex-col justify-between max-w-prose mx-auto"
      tag="form"
      ref="form"
      v-slot="{ invalid, handleSubmit }"
    >
      <h1 class="text-2xl mb-4">Invite your Friend to Favor</h1>
      <div class="flex gap-2 flex-col md:flex-row">
      <ValidationProvider slim rules="required" v-slot="{ errors, classes }">
        <div class="control flex-grow" :class="classes">
          <BaseInput label="First Name" required type="text" v-model="details.firstName" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control flex-grow" :class="classes">
          <BaseInput label="Last Name" type="text" v-model="details.lastName" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      </div>
      <ValidationProvider slim rules="required" v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Email" required type="email" v-model="details.email" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Phone" type="phone" v-model="details.phone" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <div class="notice text-sm text-red-400 p-2 text-center" v-if="invalid">A valid <strong>email</strong> and <strong>First Name</strong> are required</div>
      <button class="btn is-primary text-2xl mt-4" :disabled="invalid" @click.prevent="handleSubmit(handleForm)">Create Invitation</button>
    </ValidationObserver>
  </main>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  layout: 'action',
  data() {
    return {
      loading: false,
      details: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        invitedByUid: this.$auth.user.uid,
      }
    }
  },
  methods: {
    async handleForm() {
      this.loading = true;
      this.$refs.form.validate().then(async success => {
        console.log(success);
        if (!success) {
          this.loading = false;
          return;
        }

        try {
          const response = await this.$axios.post('/api/auth/invite', this.details)
          const data = response.data.data
          console.log(response);
          this.$store.dispatch('chat/broadcastResponse', { 
            response: response,
            title: 'Invitation Created!',
            message: `You successfully created an invite!`,
            button: {
              text: 'View Invite',
              url: `/invite/${data.invitation_token}`
            }
          })
          // send to invitation page
          this.$router.push(`/invite/${data.invitation_token}`)
          this.loading = false
        } catch (error) {
          console.log('why here',error);
          this.$store.dispatch('chat/broadcastErrorResponse', {
            response: error.response,
          })
          this.loading = false
        }
      });
    }
  },
}
</script>