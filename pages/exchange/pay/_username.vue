<template>
  <ValidationObserver 
    class="flex flex-col justify-between"
    tag="div"
    immediate
    ref="form"
    v-slot="{ invalid }"
  >
    <BaseLoader class="loader" v-if="loading"/>

    <div class="pay flex my-4 justify-between">
      <MemberPortrait class="payee w-1/3 text-center" :member="from" />
      <div class="text-4xl text-purple-500 font-bold text-center">
        <p class="mb-2">&rAarr;</p>
        <p>Pay</p>
      </div>
      <MemberPortrait class="recipient w-1/3 text-center" :member="to" />
    </div>

    <div class="my-4 flex-grow flex flex-col">
      <ValidationProvider immediate rules="uid|unique:@recipient,Recipient" v-slot="{ errors }">
          <input
            v-model="details.payeeUid"
            type="hidden"
            name="payee"
          ><span class=errors>{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider name="recipient" rules="uid" v-slot="{ errors }">
          <input
            v-model="details.recipientUid"
            type="hidden"
            name="recipient"
          ><span class=errors>{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <input
            v-model="details.amount"
            type="number"
            placeholder="0.000"
            min="0.001"
            required
            name="amount"
            class="amount"
          >
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <input
            v-model="details.title"
            type="text"
            maxlength="140"
            minlength="4"
            required
            placeholder="Click to add Title"
            name="title"
            class="title"
          >
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
            <span class="detail text-right text-sm text-gray-400">{{ details.title.length }}/140</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <textarea
            v-model="details.description"
            name="description"
            placeholder="Optional description"
            class="description"
          ></textarea>
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <!-- add broker drop down -->
    </div>



    <ActionButton class="relative">
      <div class="notice text-sm bg-red-400 p-2 rounded-md absolute top-2 left-0 right-0 text-center" v-if="invalid">A valid <strong>amount</strong> and <strong>title</strong> are required</div>
      <button
        @click="submitPay"
        :disabled="invalid || loading"
        class="text-4xl w-full flex-grow bg-purple-500 text-purple-100 font-bold px-4 py-2 rounded-full disabled:bg-gray-300"
      >Pay</button>
    </ActionButton>


  </ValidationObserver>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  async asyncData({ route, store, $auth, error, redirect }) {
    const username = route.params.username
    const to = await store.getters.getMemberByUsername(username)
    const from = $auth.user
    
    if (!from) {
      error({ statusCode: 401, message: `No authorized user to submit payment!` })
      return
    }
    
    if (!to) {
      store.dispatch('chat/broadcastError', { title: `Member "${username}" not found!`} )
      error({ statusCode: 404, message: `Member "${username}" not found!` })
      return
    }

    return {
      to: to,
      from: from,
      details: {
        recipientUid: to.uid,
        payeeUid: from.uid,
        amount: '',
        title: '',
        description: '',
        brokerUid: '',
      }
    }
  },
  // TODO use nuxt validate function https://nuxtjs.org/docs/components-glossary/validate/
  layout: 'action',
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async submitPay () {
      this.loading = true;
      try {
        const payload = this.details

        this.$axios.post('api/transactions', payload)
        .then(async response => {
          const transaction = response.data.data

          //TODO pull these in parallel
          await this.$store.dispatch('getAllTransactions'),
          await this.$store.dispatch('getAllMembers')
          await this.$auth.fetchUser()

          this.$store.dispatch('chat/broadcastSuccess', { 
            title: 'Transaction Successful!',
            body: `<p>You successfully paid ${this.to.firstName} f${transaction.amount}!</p>`,
            button: {
              text: 'View Transaction',
              url: `/transactions/${transaction.uid}`
            }
          })
          // send to transaction
          this.$router.push('/transactions/' + transaction.uid )
          this.loading = false
        })
      } catch (error) {
        this.$store.dispatch('chat/broadcastErrorResponse', {
          response: error,
        })
      }
    },
  },
}
</script>


<style lang="scss" scoped>

input {
  @apply p-2 w-full text-2xl border-b-2 border-gray-500;
}

.control {
  @apply my-4;
}

.errors {
  @apply text-red-500 text-sm;
}

.amount {
  @apply text-4xl text-center;
}

.title {
}

.description {
  @apply w-full max-w-prose mx-auto min-h-[2rem] shadow-md rounded-md p-2 border border-gray-100;
}
</style>