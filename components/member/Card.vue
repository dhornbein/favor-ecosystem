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
      </div>
    </header>

    <main class="body">
      <div class="details flex flex-col gap-2">
        <div class="email" @click="$emit('emailClick')">{{ member.email }}</div>
        <div class="phone" @click="$emit('phoneClick')">{{ member.phone }}</div>
        <div class="edit text-gray-700 mt-auto flex gap-2" @click="$emit('editClick')" v-if="isCurrentUser">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Edit Your Profile
        </div>
        <div class="flex flex-col gap-2">
          <slot></slot>
        </div>
      </div>
      <div class="balance">
        <BaseFavor class="text-2xl font-bold" :num="member.creditLimit + member.balance">
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
    @apply flex gap-2 justify-between mt-2;
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