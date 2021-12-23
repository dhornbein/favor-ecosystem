<template>
  <div class="member-card">
    <header class="member-card__head">
      <nuxt-link :to="`/members/${row.id}`">
        <MemberIcon :username="row.username" class="flex-shrink-0" />
      </nuxt-link>
      <div class="member__bio">
        <nuxt-link :to="`/members/${row.id}`">
          <h2 class="text-2xl">{{ row.firstName }} {{ row.lastName }}</h2>
        </nuxt-link>
        <p class="text-sm" v-if="row.email || row.pone">
          <a :href="`mailto:${row.email}`" v-if="row.email" class="whitespace-nowrap">{{ row.email }}</a>
          <a :href="`tel:${row.phone}`" v-if="row.phone" class="whitespace-nowrap">{{ row.phone }}</a>
        </p>
      </div>
    </header>
    <div class="member-card__body">
      <div class="member__details">
        <FavorDisplay :num="row.transactionTotal" label="Total Transactions" />
        <FavorDisplay :num="row.creditLimit" label="Credit Limit" class="text-gray-500 text-sm" />
      </div>
      <div class="member__balance">
        <span>Balance</span>
        <div class="text-4xl font-bold font-mono" :class="{ 'text-purple-500': row.balance < 0 }">{{ row.balance | favor }}</div>
      </div>
      <div class="member__inout">
        <div class="member__credits">
          <FavorDisplay :num="row.credit" label="Credit" />
        </div>
        <div class="member__debits">
          <FavorDisplay :num="-row.debit" label="Debit" />
        </div>
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
    }
  },
}
</script>

<style lang="scss">
.member-card {
  @apply flex flex-col relative overflow-hidden rounded-md border border-gray-300 shadow-md py-5 mb-10 last:mb-0;
  
  .member-card__head {
    @apply flex-grow flex justify-between pb-4 px-5 border-b border-gray-200;
    
    .member__bio {
      @apply text-right;
    }
  }
  .member-card__body {
    @apply flex flex-col;
  }

  .member__details {
    @apply flex items-center justify-between px-5 py-2 mb-2 border-b border-gray-200;
  }
  .member__balance {
    @apply mx-5 text-center;
  }
  .member__inout {
    @apply flex justify-start w-full;
    
    .member__credits,
    .member__debits {
      @apply p-2 -mb-5 border-b-2 w-1/2;
    }
    .member__credits {
      @apply bg-green-200 border-green-500 text-right;
    }
    .member__debits {
      @apply bg-purple-200 border-purple-500 -mr-5;
    }
  }
}
</style>