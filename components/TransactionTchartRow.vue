<template>
  <div class="tchart__transaction" :datetime="row.timestamp">
    <FavorDisplay class="w-1/4" :num="row.amount" :label="row.timestamp | formatDate" />
    <div class="tchart__details flex-grow">
      <p class="">
        <nuxt-link :to="`/members/${row.payee_id}`" class="font-bold hover:text-brand-primary">{{ row.payee }}</nuxt-link>
        paid
        <nuxt-link :to="`/members/${row.recipient_id}`" class="font-bold hover:text-brand-primary">{{ row.recipient }}</nuxt-link>
      </p>
      {{ row.title }}
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