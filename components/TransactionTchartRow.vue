<template>
  <div class="tchart__transaction" :datetime="row.created">
    <BasicFavor class="" :num="row.amount" :label="row.created | formatDate" />
    <div class="tchart__details flex-grow">
      <p class="">
        <nuxt-link :to="`/members/${row.payeeId}`" class="payee font-bold hover:text-brand-primary">{{ row.payee }}</nuxt-link>
        <nuxt-link :to="`/members/${row.recipientId}`" class="recipient font-bold hover:text-brand-primary">{{ row.recipient }}</nuxt-link>
      </p>
      <p class="hidden md:block">{{ row.title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  filters: {
    formatDate(dateStr) {
      return Intl.DateTimeFormat("us-EN").format(new Date(dateStr))
    }
  },
}
</script>