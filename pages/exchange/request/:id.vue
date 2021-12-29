<template>
  <div class="flex flex-col justify-center">
    <div class="pay flex my-4 flex-row-reverse justify-between">
      <div class="payee w-1/3 text-center">
        <MemberIcon :username="$auth.user.username" class="mx-auto" highlight />
        <p class="text-2xl mt-2">You</p>
      </div>
      <div class="text-4xl text-green-500 font-bold text-center">
        <p class="mb-2">&rAarr;</p>
        <p>Pays</p>
        </div>
      <div class="recipient w-1/3 text-center">
        <MemberIcon :username="recipient.username" class="mx-auto" />
        <p class="text-2xl mt-2">{{ `${recipient.firstName} ${recipient.lastName}` }}</p>
      </div>
    </div>

    <div class="my-4 flex-grow flex flex-col">
      <input type="number" placeholder="0.000" name="" id="" class="p-2 w-full text-center text-4xl border-b-2 border-green-500 text-green-500">
      <input type="text" maxlength="140" placeholder="Click to add Title" class="p-2 my-4 w-full text-2xl border-b-2 border-gray-500 invalid:border-red-600">
      <textarea name="description" class="p-2 flex-grow w-full min-h-[2rem] border-b-2 border-gray-500 focus:shadow-inner" placeholder="Optional description"></textarea>
    </div>

    <ActionButton>
      <button @click="clickReq" class="text-4xl w-full flex-grow bg-green-500 text-green-100 font-bold px-4 py-2 rounded-full">Request</button>
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
    // this.details = this.$store.getters.details
    // HOW???
  },
  computed: {
    recipient() {
      return this.$store.getters.getMemberIdByUUID(this.$route.params.id)
    }
  },
}
</script>