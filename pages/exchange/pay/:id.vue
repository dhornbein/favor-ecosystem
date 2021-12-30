<template>
  <div class="flex flex-col justify-center">
    <div class="pay flex my-4 justify-between">
      <MemberPortrait class="payee w-1/3 text-center" :member="payee"/>
      <div class="text-4xl text-purple-500 font-bold text-center">
        <p class="mb-2">&rAarr;</p>
        <p>Pay</p>
      </div>
      <MemberPortrait class="recipient w-1/3 text-center" :member="recipient"/>
    </div>

    <ActionExchangeForm />

    <ActionButton>
      <button @click="clickPay" class="text-4xl w-full flex-grow bg-purple-500 text-purple-100 font-bold px-4 py-2 rounded-full">Pay</button>
    </ActionButton>

  </div>
</template>

<script>
export default {
  layout: 'action',
  methods: {
    clickPay() {
      
    },
  },
  computed: {
    payee() {
      const target = this.$auth.user
      this.$store.dispatch('exchange/setPayee', target);
      return target
    },
    recipient() {
      const id = this.$route.params.id
      const target = this.$store.getters.getMemberByUid(id)
      this.$store.dispatch('exchange/setRecipient', target);
      return target
    },
  },
}
</script>