<template>
  <section class="edit-member p-4">

    <BaseLoader class="loader" v-if="loading">{{ status }}</BaseLoader>

    <ValidationObserver 
      class="flex flex-col gap-2 justify-between max-w-prose mx-auto"
      tag="form"
      ref="form"
      v-slot="{ invalid, handleSubmit }"
    >
      <div class="flex gap-2 flex-col md:flex-row">
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control flex-grow" :class="classes">
          <BaseInput label="First Name" type="text" v-model="memberUpdate.firstName" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control flex-grow" :class="classes">
          <BaseInput label="Last Name" type="text" v-model="memberUpdate.lastName" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      </div>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Email" type="email" v-model="memberUpdate.email" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Username" type="text" v-model="memberUpdate.username" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <BaseInput label="Phone" type="phone" v-model="memberUpdate.phone" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors }" vid="confirmation">
        <div class="control">
          <BaseInput label="New Password" type="password" v-model="memberUpdate.passwordConfirm" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim rules="confirmed:confirmation" v-slot="{ errors }">
        <div class="control">
          <BaseInput label="New Password Confirm" type="password" v-model="memberUpdate.password" />
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <button class="btn is-primary text-2xl my-4" :disabled="invalid" @click.prevent="handleSubmit(handleForm)">Update</button>
    </ValidationObserver>

  </section>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    member: {
      type: Object,
    required: true
    }
  },
  data() {
    return {
      loading: false,
      status: "",
      memberUpdate: {}
    }
  },
  mounted() {
    this.memberUpdate = {...this.member};
  },
  methods: {
    async handleForm() {
      this.loading = true
      this.status = "Updating..."
      const payload = this.updatedFields

      try {
        const response = await this.$axios.patch(`/api/members/${this.member.uid}`, payload)

        if (response.status != 200) {
          // TODO better error handling here
          throw new Error('unknown error')
        }

        this.status = "Success!"

        this.$store.dispatch('chat/broadcastResponse', { 
          response: response,
          title: 'Update successful!',
          message: `You successfully updated your account!`,
        })

        this.$emit('updated', response.data)

        this.status = "Reloading User..."
        await this.$auth.fetchUser()

        this.resetForm()

        this.loading = false
        
      } catch (error) {
        this.loading = false
        this.status = "Error"
        this.$store.dispatch('chat/broadcastErrorResponse', {
          response: error.response,
        })
      }
    },
    resetForm() {
      this.memberUpdate = {...this.member}
      this.$refs.form.reset()
    },
  },
  computed: {
    updatedFields() {
      const updatedFields = {}
      Object.keys(this.memberUpdate).forEach(key => {
        if (this.member[key] !== this.memberUpdate[key]) {
          updatedFields[key] = this.memberUpdate[key]
        }
      })
      return updatedFields
    }
  },
}
</script>

<style lang="scss">
.edit-member {
  .control.changed {
    input {
      @apply text-brand-primary
    }
    label:after {
      @apply text-red-500 text-sm;
      content: ' (unsaved edit)';
    }
  }
}
</style>