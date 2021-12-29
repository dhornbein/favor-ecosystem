<template>
  <div class="flex flex-col justify-center">
    <div class="pay flex my-4 justify-between">
      <MemberPortrait class="payee w-1/3 text-center" :member="$auth.user"/>
      <div class="text-4xl text-purple-500 font-bold text-center">
        <p class="mb-2">&rAarr;</p>
        <p>Pay</p>
      </div>
      <MemberPortrait class="recipient w-1/3 text-center" :member="recipient"/>
    </div>

    <div class="my-4 flex-grow flex flex-col">
      <input type="number" placeholder="0.000" name="" id="" class="p-2 w-full text-center text-4xl border-b-2 border-purple-500 text-purple-500">
      <input type="text" maxlength="140" placeholder="Click to add Title" class="p-2 my-4 w-full text-2xl border-b-2 border-gray-500 invalid:border-red-600">
      <textarea name="description" class="p-2 flex-grow w-full min-h-[2rem] border-b-2 border-gray-500 focus:shadow-inner" placeholder="Optional description"></textarea>
    </div>

    <ActionButton>
      <button @click="clickPay" class="text-4xl w-full flex-grow bg-purple-500 text-purple-100 font-bold px-4 py-2 rounded-full">Pay</button>
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
  computed: {
    recipient() {
      return this.$store.getters.getMemberByUid(this.$route.params.id)
    }
  },
}
</script>