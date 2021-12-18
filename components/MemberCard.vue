<template>
  <div class="member-card flex flex-col relative rounded-md border border-gray-300 shadow-md p-5 mb-10 last:mb-0">
    <nuxt-link class="member-card__button" :to="`/members/${row.ID}`">More...</nuxt-link>
    <div class="flex-grow flex justify-between pb-4 mb-4 border-b border-gray-400">
      <header class="member-card__head flex justify-start gap-3 w-full">
        <MemberIcon :username="row.username" class="flex-shrink-0" />
        <div class="member__bio">
          <h2 class="text-2xl">{{ row.first_name }} {{ row.last_name }}</h2>
          <p class="text-sm" v-if="row.email || row.pone">
            <a :href="`mailto:${row.email}`" v-if="row.email" class="whitespace-nowrap">{{ row.email }}</a>
            <a :href="`tel:${row.phone}`" v-if="row.phone" class="whitespace-nowrap">{{ row.phone | phoneNumber }}</a>
          </p>
        </div>
      </header>
      <div>
        <FavorDisplay :num="row.transaction_total" label="Total"
        class="member__total text-sm text-right rounded-bl-md p-5 -mt-5 -mr-5 bg-yellow-100" />
      </div>
    </div>
    <div class="member-card__body flex items-center">
      <div class="member__inout">
        <div class="member__credits bg-green-200 p-2 rounded-r mb-2 -ml-5 pl-7 border-l-2 border-green-500">
          <FavorDisplay :num="row.credit" label="Credit" />
        </div>
        <div class="member__debits bg-purple-200 p-2 rounded-r mb-2 -ml-5 pl-7 border-l-2 border-purple-500">
          <FavorDisplay :num="-row.debit" label="Debit" />
        </div>
      </div>
      <div class="member__balance mx-5">
        <span>Balance</span>
        <div class="text-4xl font-bold font-mono" :class="{ 'text-purple-500': row.balance < 0 }">{{ row.balance | favor }}</div>
        <FavorDisplay :num="row.credit_limit" label="Credit Limit" class="text-gray-500" />
      </div>
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
    },
    phoneNumber(phone) {
      return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    }
  },
}
</script>

<style lang="scss">
.member-card {
  .member-card__button {
    @apply absolute bottom-0 right-0 rounded-tl-md rounded-br-md p-2 border text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white;
  }
}
</style>