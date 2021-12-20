<template>
  <div class="trans-card" :class="classes" v-on:click="toggleSlim()">
    <div class="trans-card__body">
      <header class="text-sm">
        <p class="">
          <nuxt-link :to="`/members/${row.payee_id}`" class="member-link payee font-bold hover:text-brand-primary">{{ row.payee }}</nuxt-link>
          paid
          <nuxt-link :to="`/members/${row.recipient_id}`" class="member-link recipient font-bold hover:text-brand-primary">{{ row.recipient }}</nuxt-link>
        </p>
        <time :datetime="row.timestamp">{{ row.timestamp | formatDate }}</time>
      </header>
      <div class="trans-card__details">
        <h1>{{ row.title }}</h1>
        <p v-if="row.description">{{ row.description }}</p>
      </div>
    </div>
    <div class="trans-card__favor">
      <div class="fee text-gray-400" v-if="!slim">
        <span class="text-xs">fee</span>
        <span class="">{{ row.fee ? - row.fee / 2 : row.amount * 0.01 | favor }}</span>
      </div>
      <div class="amount text-gray-600">
        <span class="">f</span>
        <span class="font-bold">{{ ((isFocusedPayee) ? -row.amount : row.amount) | favor }}</span>
      </div>
      <div class="fee text-gray-400" v-if="!slim">
        <span class="text-xs">fee</span>
        <span class="">{{ row.fee ? - row.fee / 2 : row.amount * 0.01 | favor }}</span>
      </div>
      <div class="fee text-gray-400" v-else>
        <span class="text-xs">fee</span>
        <span class="">{{ row.fee ? - row.fee : row.amount * 0.02 | favor }}</span>
      </div>
    </div>
    <div class="trans-card__icons">
      <MemberIcon :username="row.payee" :highlight="isFocusedPayee || !isFocusedRecipient" />
      <div class="text-gray-400">&#x27F1;</div>
      <MemberIcon :username="row.recipient" alt :highlight="isFocusedRecipient" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    },
    isSlim: {
      type: Boolean,
      required: false
    },
    focusUser: {
      required: false
    }
  },
  data() {
    return {
      slim: this.isSlim,
      classes: { 
        'trans-card--slim': this.isSlim, 
        'trans-card--network': this.row.payee_id === 1, 
        'trans-card--payee': this.isFocusedPayee, 
        'trans-card--recipient': this.isFocusedRecipient 
      }
    }
  },
  computed: {
    isFocusedPayee() {
      if (isNaN(this.focusUser)) return this.focusUser === this.row.payee
      return this.focusUser === this.row.payee_id
    },
    isFocusedRecipient() {
      if (isNaN(this.focusUser)) return this.focusUser === this.row.recipient
      return this.focusUser === this.row.recipient_id
    },
  },
  methods: {
    toggleSlim() {
      this.slim = !this.slim
      this.classes['trans-card--slim'] = this.slim
    }
  },
  filters: {
    formatDate(dateStr) {
      if (Date.parse(dateStr)) return Intl.DateTimeFormat("us-EN").format(new Date(dateStr))
    },
  },
}
</script>

<style lang="scss">
.trans-card {
  @apply flex gap-3 rounded-md border border-gray-300 shadow-md p-2 mb-5 last:mb-0
    transition cursor-pointer hover:border-gray-500;
  .trans-card__body {}
  .trans-card__details {
    h1 { @apply text-lg break-words }
  }
  .trans-card__favor {
    @apply flex-shrink flex flex-col justify-center items-end text-right font-mono ml-auto;

    .fee,
    .amount { @apply whitespace-nowrap }
  }
  .trans-card__icons {
    @apply flex flex-col justify-start items-center;
  }

  &.trans-card--slim + &:not(.trans-card--slim) {
    @apply rounded-t-none;
  }

  &:not(.trans-card--slim) + .trans-card.trans-card--slim  {
    @apply rounded-t-md;
  }

  // Slimming
  &.trans-card--slim {
    @apply py-2 items-center gap-0 shadow-none mb-0 rounded-none first:rounded-t-md last:rounded-b-md;

    .trans-card__body header {
      @apply flex gap-2;
    }
    .trans-card__details {
      h1 { @apply text-base; }
      p { @apply hidden; }
    }
    .trans-card__icons {
      @apply hidden;
    }
  }

  // Focus User
  &.trans-card--payee,
  &.trans-card--recipient {
    @apply bg-gradient-to-l via-transparent
  }

  &.trans-card--payee {
    @apply from-purple-300;
    .payee {
      @apply text-brand-primary;
    }
  }
  &.trans-card--recipient {
    @apply from-green-100;
    .recipient {
      @apply text-brand-primary;
    }
  }
  &.trans-card--network {
    @apply from-yellow-100 border-yellow-400;
    .payee {
      @apply text-yellow-500;
    }
  }
}
</style>