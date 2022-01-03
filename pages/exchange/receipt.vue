<template>
  <div class="flex flex-col justify-center">
    <h1 class="font-logo text-2xl text-center text-brand-primary">Transaction Successful!</h1>
    <TransactionCard :trans="receipt" size="full" v-if="receipt" />
  </div>
</template>

<script>
export default {
  layout: 'main',
  computed: {
    receipt() {
      const receipt = this.$store.getters['exchange/receipt']
      if (Object.keys(receipt).length === 0)
        return false;
      
      return receipt
    }
  },
}
</script>