<template>
  <div class="flex flex-col justify-center">
    <ValidationObserver immediate ref="form" v-slot="{ invalid }">

    <MemberCard :member="to" v-if="setup" />
    <div class="pay flex my-4 justify-between" v-else-if="pay || request">
      <MemberPortrait class="payee w-1/3 text-center" :member="payee" />
      <div class="text-4xl text-purple-500 font-bold text-center">
        <p class="mb-2">&rAarr;</p>
        <p>Pay</p>
      </div>
      <MemberPortrait class="recipient w-1/3 text-center" :member="recipient" />
    </div>

    <ActionExchangeForm />

    <div class="notice text-sm text-red-500" v-if="invalid">Add an amount and title to begin</div>
    <ActionButton>
      <button
        v-if="setup"
        @click="choosePay"
        :disabled="invalid"
        class="text-4xl w-full flex-grow bg-purple-500 text-purple-100 font-bold px-4 py-2 rounded-full rounded-r-none disabled:bg-gray-300"
      >Pay</button>
      <button
        v-else-if="pay"
        @click="submitPay"
        :disabled="invalid"
        class="text-4xl w-full flex-grow bg-purple-500 text-purple-100 font-bold px-4 py-2 rounded-full disabled:bg-gray-300"
      >Confirm</button>
      <button
        v-if="setup"
        @click="chooseReq"
        :disabled="invalid"
        class="text-4xl w-full flex-grow bg-green-500 text-green-100 font-bold px-4 py-2 rounded-full rounded-l-none disabled:bg-gray-300"
      >Request</button>
      <button
        v-else-if="request"
        @click="submitReq"
        :disabled="invalid"
        class="text-4xl w-full flex-grow bg-green-500 text-green-100 font-bold px-4 py-2 rounded-full disabled:bg-gray-300"
      >Confirm</button>
    </ActionButton>

    </ValidationObserver>

  </div>
</template>

<script>
import { ValidationObserver } from "vee-validate";
export default {
  components: {
    ValidationObserver
  },
  // TODO use nuxt validate function https://nuxtjs.org/docs/components-glossary/validate/
  layout: 'action',
  data() {
    return {
      payee: false,
      recipient: false,
    }
  },
  methods: {
    choosePay() {
      this.$router.push('/exchange/pay/' + this.to.username)
    },
    submitPay () {},
    chooseReq() {
      this.$router.push('/exchange/request/' + this.to.username)
    },
    submitReq () {},
  },
  computed: {
    valid() {
      // return this.$refs.form.validate().then(success => {
      //   if (!success) {
      //     return false;
      //   }
      //   return true;
      // })
    },
    from() {
      const username = this.$route.params.from
      const member = this.$store.getters.getMemberByUsername(username)
      
      return (member) ? member : this.$auth.user
    },
    to() {
      const username = this.$route.params.to
      const member = this.$store.getters.getMemberByUsername(username)
      if (!member)
        // TODO throw and error for the user "no member found"
        this.$router.push('/exchange/'); // no member, go back and choose one
      return (member) ? member : false
    },
    method() {
      const route = this.$route.params.method
      if (route == 'pay') {
        this.payee = this.from
        this.recipient = this.to
        this.$store.dispatch('exchange/setPayee', this.payee);
        this.$store.dispatch('exchange/setRecipient', this.recipient);
        return 'pay'
      } else if (route == 'request') {
        this.payee = this.to
        this.recipient = this.from
        this.$store.dispatch('exchange/setPayee', this.payee);
        this.$store.dispatch('exchange/setRecipient', this.recipient);
        return 'request'
      } else {
        this.$store.dispatch('exchange/clearTargets');
        return 'setup'
      }
    },
    pay() { return this.method == 'pay' },
    request() { return this.method == 'request' },
    setup() { return this.method == 'setup' },
  },
}
</script>