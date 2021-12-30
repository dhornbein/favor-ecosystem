<template>
  <div class="flex flex-col justify-center">

    <MemberCard class="justify-center" :member="target" v-if="target" />

    <ActionExchangeForm />
    
    <ActionButton>
      <button @click="clickPay" class="text-4xl w-full flex-grow bg-purple-500 text-purple-100 font-bold px-4 py-2 rounded-full rounded-r-none">Pay</button>
      <button @click="clickReq" class="text-4xl w-full flex-grow bg-green-500 text-green-100 font-bold px-4 py-2 rounded-full rounded-l-none disabled:bg-gray-300">Request</button>
    </ActionButton>

  </div>
</template>

<script>
export default {
  layout: 'action',
  data() {
    return {
    }
  },
  mounted() {
    // clear targets
    this.$store.dispatch('exchange/clearTargets');
  },
  methods: {
    clickPay() {
      this.$router.push('/exchange/pay/' + this.target.uuid)
    },
    clickReq() {
      this.$router.push('/exchange/request/' + this.target.uuid)
    },
  },
  computed: {
    target() {
      return this.$store.getters.getMemberByUid(this.$route.params.id)
    }
  },
}
</script>