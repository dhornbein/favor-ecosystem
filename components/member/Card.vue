<template>
  <article class="card relative" :class="classes" @click="$emit('click')">

    <header class="head">
      <MemberIcon :username="member.username" :highlight="isCurrentUser" />
      <div class="name leading-snug">
        <MemberDisplayName class="block" :member="member" />
        <MemberUsername class="text-sm text-brand-gray-400" noLink :username="member.username" />
      </div>
      <div class="quick-look is-hidden-open">
        <BaseFavor class="text-right pr-2 border-r border-brand-gray-400" :num="member.creditLimit + member.balance" v-if="mine" >
          <div class="label text-xs">Available</div>
        </BaseFavor>
        <BaseFavor class="text-right pr-2" :num="member.transactionTotal" v-else-if="member.transactionTotal > 0">
          <div class="label text-xs">Total Transactions</div>
        </BaseFavor>
      </div>
    </header>

    <main class="body">

      <div class="bar">
        <nuxt-link :to="`/exchange/pay/${member.username}`" class="btn has-text-sm is-primary is-rounded-full" v-if="!mine">
          <svg class="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Pay Now
        </nuxt-link>
        <BaseFavor class="attribute--main ml-auto" :sup="false" :num="member.creditLimit + member.balance">
          <div class="text-base">Available</div>
        </BaseFavor>
      </div>

      <div class="attribute email" @click="$emit('emailClick')">
        <p class="label" v-if="member.email">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          Email
        </p>
        {{ member.email }}
      </div>
      
      <BaseFavor class="text-right" :num="member.balance">
        <div class="label text-xs">Balance</div>
      </BaseFavor>
      
      <div class="attribute phone" @click="$emit('phoneClick')">
        <p class="label" v-if="member.phone">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          Phone
        </p>
        {{ member.phone }}
      </div>
      
      <BaseFavor class="text-right" :num="member.creditLimit">
        <div class="label text-xs">Credit Limit</div>
      </BaseFavor>
      <div class="attribute invited">
        <template v-if="invitedBy">
          <p class="label">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            Invited By
          </p>
          <nuxt-link :to="`/members/${invitedBy.username}`" class="font-bold text-brand-primary">
            {{ invitedBy.firstName }}
          </nuxt-link>
        </template>
      </div>
      <BaseFavor class="text-right" :num="member.transactionTotal">
        <div class="label text-xs">Total Transactions</div>
      </BaseFavor>
    </main>

    <footer class="footer">
      <slot></slot>
    </footer>
  </article>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'compact'
    }
  },
  data() {
    return {
      visible: {},
      currentSize: this.size,
    }
  },
  methods: {
    setSize(size) {
      this.currentSize = size
    }
  },
  computed: {
    mine() {
      return this.member.username == this.$auth.user.username
    },
    classes() { 
      return {
        'card--compact': this.currentSize == 'compact',
        'card--open': this.currentSize == 'open',
        'card--mini': this.currentSize == 'mini',
        'card--me': this.$auth.user.uid == this.member.uid, 
      }
    },
    isBroker() {
      return this.member.roles ? this.member.roles.includes('broker') : false
    },
    isCurrentUser() {
      if (!this.$auth.user) return false
      return this.member.uid === this.$auth.user.uid
    },
    invitedBy() {
      if (!this.member.invitedByUid) return false
      return this.$store.getters.getMemberByUid(this.member.invitedByUid)
    },
  },
  filters: {
    formatDate(dateStr) {
      return Intl.DateTimeFormat("us-EN").format(new Date(dateStr))
    }
  },
}
</script>

<style lang="scss" scoped>
.card {
  .head {
    @apply col-span-2 flex gap-2 items-center;

    .quick-look {
      @apply ml-auto flex gap-2 items-center
    }
  }
  .bar {
    @apply flex gap-2 items-center w-auto col-span-2 py-4 px-2 mb-4 -mx-2 bg-brand-gold text-brand-primary;
  }
  .body {
    @apply grid grid-cols-2 items-center gap-y-2 py-4;
    .attribute--main {
      @apply text-xl text-right;
    }
    .attribute .label {
      @apply text-sm flex items-center gap-2;
    }
  }

  &.card--mini,
  &.card--compact {
    .body,
    .bar,
    .footer {
      @apply hidden;
    }
  }

  &.card--mini {
    .quick-look {
      @apply hidden;
    }
  }

  &.card--open {
    .head {
      @apply py-6;
    }
    .is-hidden-open {
      @apply hidden;
    }
  }
}
</style>