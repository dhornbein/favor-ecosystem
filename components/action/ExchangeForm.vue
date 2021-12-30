<template>
  <div class="my-4 flex-grow flex flex-col">
    <input 
      v-model="details.amount"
      @change="setValues"
      type="number"
      placeholder="0.000" 
      name=""
      id=""
      class="text-center text-4xl"
    >
    <input 
      v-model="details.title"
      @change="setValues"
      type="text"
      maxlength="140"
      placeholder="Click to add Title"
      class=""
    >
    <textarea 
      v-model="details.description"
      @change="setValues"
      name="description"
      placeholder="Optional description"
      class="min-h-[2rem]focus:shadow-inner"
    ></textarea>
    <!-- add broker drop down -->
  </div>
</template>



<script>
export default {
  data() {
    return {
      details: {
        amount: '',
        title: '',
        description: '',
        brokerId: '',
      }
    }
  },
  mounted() {
    this.details = {
      ...this.$store.getters['exchange/details']
    }

    // const unsubscribe = this.$store.subscribe((mutation, state) => {
    //   console.log('mutate');
    //   this.details = {
    //     ...mutation.payload
    //   }
    // })
  },
  methods: {
    validate() {
      
      return true
    },
    setValues() {
      this.$store.dispatch('exchange/setDetails', this.details)
    },
  },
  updated() {
    this.details.payeeId = this.payeeId
    this.details.recipientId = this.recipientId
  },
  computed: {
    target() {
      return this.$store.getters.getMemberByUid(this.$route.params.id)
    },
    setPayee() {
      // this.details.payeeId = this.payeeId
    },
    setRecipient() {
      // this.details.recipientId = this.recipientId
    }
  },
}
</script>

<style lang="scss" scoped>
input {
  @apply p-2 my-4 w-full text-2xl border-b-2 border-gray-500 invalid:border-red-600;
}
</style>