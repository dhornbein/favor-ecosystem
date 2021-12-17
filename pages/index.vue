<template>
  <main>
    
    <div class="lg:container mx-auto">

      <header class="max-w-3xl mx-auto">
        <Logo />
        <h2 class="text-xl font-cormorant">Transactions</h2>
      </header>
      <table class="trans-table table-auto max-w-3xl w-full" v-if="trans">
        <thead>
          <tr>
            <th v-for="title in trans.header" :key="title" :class="title">{{ title }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in trans.data" :key="row.ID" :id="`row-${row.ID}`" :title="row.timestamp"
            class="odd:bg-gray-100"
          >
            <td v-for="(cell, col) in row" :key="row.ID + '-' + cell"
              :class="col"
            >
              <details v-if="col == 'title' && row.description != ''">
                <summary>{{ cell }}</summary>
                <p>{{ row.description }}</p>
              </details>
              <span v-else>{{ cell }}</span>
              
            </td>
          </tr>
        </tbody>
      </table>

    </div>

  </main>
</template>

<script>
export default {
  async asyncData ({ $http }) {
    const trans = await $http.$get('/api/transactions')

    return {
      trans
    }
  }
}
</script>

<style lang="scss" scoped>
.trans-table {
  @apply bg-white p-5 mx-auto;

  tr {

    th {
      @apply p-4;
    }
    td {
      @apply p-4;

      &.amount,
      &.fee {
        @apply text-right font-mono;
      }
      &.fee {
        @apply text-gray-600;
      }
    }
  }

  .ID,
  .timestamp,
  .payee_id,
  .recipient_id,
  .broker_name,
  .ip_address,
  .transaction_phone,
  .effective_datetime,
  .description {
    @apply hidden;
  }
  .payee {}
  .recipient {}
  .title {
    @apply max-w-sm;
  }
}
</style>
