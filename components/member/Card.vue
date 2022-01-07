<template>
  <article class="card relative" :class="classes" @click="$emit('click')">

    <!-- <MemberBalanceBar class="absolute h-[80%] right-1 top-0 bottom-0" :member="member" /> -->

    <!-- <div v-if="mine" class="my more open-hidden">&#10225; open &#10225;</div> -->

    <header class="head">
      <MemberIcon :username="member.username" :highlight="isCurrentUser" />
      <div class="name leading-snug">
        <MemberDisplayName class="block" :member="member" />
        <MemberUsername class="text-sm text-gray-400" noLink :username="member.username" />
      </div>
      <div v-if="mine" class="my edit ml-auto flex gap-2 items-center">
        <BaseFavor class="text-right open-hidden pr-2 border-r border-gray-400" :num="member.creditLimit + member.balance">
          <div class="label text-xs">Available</div>
        </BaseFavor>
        <div><a>⚙</a></div>
      </div>
    </header>

    <main class="body">
      <div class="details">
        <div class="email" @click="$emit('emailClick')">{{ member.email }}</div>
        <div class="phone" @click="$emit('phoneClick')">{{ member.phone }}</div>
      </div>
      <div class="balance">
        <BaseFavor class="text-2xl" :num="member.creditLimit + member.balance">
          <div class="label text-xs">Available</div>
        </BaseFavor>
        <BaseFavor class="" :num="member.balance">
          <div class="label text-xs">Balance</div>
        </BaseFavor>
        <BaseFavor class="my" :num="member.creditLimit">
          <div class="label text-xs">Credit Limit</div>
        </BaseFavor>
        <BaseFavor class="my" :num="member.transactionTotal">
          <div class="label text-xs">Total Transactions</div>
        </BaseFavor>
      </div>
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
  .more {
    @apply text-xs text-gray-400 absolute bottom-0 left-0 right-0 text-center;
  }
  .head {
    @apply flex gap-2 items-center;
  }
  .body {
    @apply flex gap-2 justify-between;
    .balance {
      @apply text-right;
    }
  }

  &.card--compact {
    .body,
    .footer {
      @apply hidden;
    }
  }

  &.card--open {
    .open-hidden {
      @apply hidden;
    }
  }
}
</style>