<template>
  <div class="payment-card flex gap-3 rounded-md border border-gray-300 shadow-md p-5 mb-5 last:mb-0">
    <div class="payment-card__body">
      <header class="text-sm">
        <p class="">
          <nuxt-link :to="`/member/${row.payee_id}`" class="font-bold hover:text-brand-primary">{{ row.payee }}</nuxt-link>
          paid
          <nuxt-link :to="`/member/${row.recipient_id}`" class="font-bold hover:text-brand-primary">{{ row.recipient }}</nuxt-link>
        </p>
        <time :datetime="row.timestamp">{{ row.timestamp | formatDate }}</time>
      </header>
      <div class="payment-card__details">
        <h1 class="text-2xl">{{ row.title }}</h1>
        <p class="" v-if="row.description">{{ row.description }}</p>
      </div>
    </div>
    <div class="flex-shrink flex justify-center items-center font-mono ml-auto">
      <div class="text-right">
        <div class="amount text-gray-600">
          <span class="">f</span>
          <span class="font-bold">{{ row.amount }}</span>
        </div>
        <div class="fee text-gray-400">
          <span class="">&minus;</span>
          <span class=" font-bold">{{ row.fee }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-start items-center">
      <MemberIcon :username="row.payee" />
      <div class="text-gray-400">&#x27F1;</div>
      <MemberIcon :username="row.recipient" :alt="true" />
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