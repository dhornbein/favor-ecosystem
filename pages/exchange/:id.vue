<template>
  <div class="flex flex-col justify-center">

    <MemberCard :member="target" v-if="target" />

    <div class="my-4 flex-grow flex flex-col">
      <input v-model="details.amount" type="number" placeholder="0.000" name="" id="" class="p-2 w-full text-center text-4xl border-b-2 border-gray-500">
      <input v-model="details.title" type="text" maxlength="140" placeholder="Click to add Title" class="p-2 my-4 w-full text-2xl border-b-2 border-gray-500 invalid:border-red-600">
      <textarea v-model="details.description" name="description" class="p-2 flex-grow w-full min-h-[2rem] border-b-2 border-gray-500 focus:shadow-inner" placeholder="Optional description"></textarea>
    </div>
    
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
      details: {
        recipientId: '',
        amount: '',
        title: '',
        description: '',
        brokerId: '',
        payeeId: '',
      }
    }
  },
  mounted() {
    // this.details = this.$store.state.exchange.details
  },
  methods: {
    validate() {
      
      return true
    },
    setValues() {
      this.$store.dispatch('exchange/setDetails', this.details)
    },
    clickPay() {
      if(!this.validate) return
      // this.setValues()
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