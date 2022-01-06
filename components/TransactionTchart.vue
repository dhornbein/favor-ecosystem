<template>
  <div class="tchart">
    <div class="tchart__row" v-for="row in trans" :key="row.id">
      <div class="tchart__credit">
        <TransactionTchartRow class="tchart__transaction" :row="row" v-if="row.payeeUid === focusUid" />
      </div>
      <div class="tchart__debit bg-purple-200 w-1/2">
        <TransactionTchartRow class="tchart__transaction" :row="row" v-if="row.recipientUid === focusUid" />
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
    focusUid: {
      type: String,
      required: true
    }
  },
  computed: {
    isReceiver() {
      return this.trans.filter(obj => obj.recipientUid === this.targetUid)
    },
    isPayee() {
      return this.trans.filter(obj => obj.payeeUid === this.targetUid)
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

  // apply to both credit and debit columns
  .tchart__credit,
  .tchart__debit {
    @apply w-1/2 p-2 border-b;

    .tchart__transaction {
      @apply flex justify-between items-center gap-2;
    }
  }

  // apply to credit column only
  .tchart__credit {
    @apply bg-green-100 border-green-200 text-right;

    .tchart__transaction {
      @apply flex-row-reverse;
    }

    a.payee { @apply hidden }

    .tchart__details {
      @apply text-left
    }
  }

  // apply to debit column only
  .tchart__debit {
    @apply bg-purple-100 border-purple-200;

    .tchart__transaction {
    }

    a.recipient { @apply hidden }

    .tchart__details {
      @apply text-right
    }
  }
}
</style>