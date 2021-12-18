<template>
  <div class="tchart">
    <div class="tchart__row" v-for="row in trans" :key="row.ID">
      <div class="tchart__credit">
        <TransactionTchartRow class="tchart__transaction" :row="row" v-if="row.payee_id === targetId" />
      </div>
      <div class="tchart__debit bg-purple-200 w-1/2">
        <TransactionTchartRow class="tchart__transaction" :row="row" v-if="row.recipient_id === targetId" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    trans: {
      type: Array,
      required: true
    },
    targetId: {
      type: Number,
      required: true
    }
  },
  computed: {
    isReceiver() {
      return this.trans.filter(obj => obj.recipient_id === this.targetId)
    },
    isPayee() {
      return this.trans.filter(obj => obj.payee_id === this.targetId)
    }
  },
  filters: {
    formatDate(dateStr) {
      return Intl.DateTimeFormat("us-EN").format(new Date(dateStr))
    }
  }
}
</script>

<style lang="scss">
.tchart {
  .tchart__row {
    @apply flex;
  }
  .tchart__credit,
  .tchart__debit {
    @apply w-1/2 p-2 border-b;

    .tchart__transaction {
      @apply flex justify-between items-center gap-2;
    }
  }
  .tchart__credit {
    @apply bg-green-100 border-green-200 text-right;

    .tchart__transaction {
      @apply flex-row-reverse;
    }

    .tchart__details {
      @apply text-left
    }
  }
  .tchart__debit {
    @apply bg-purple-100 border-purple-200;

    .tchart__transaction {
    }

    .tchart__details {
      @apply text-right
    }
  }
}
</style>