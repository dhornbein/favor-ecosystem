<template>
  <main v-if="$auth.loggedIn">
    
    <header>

      <nuxt-link to="/members" class="text-sm text-gray-500 hover:text-brand-primary">Members</nuxt-link>
      <div class="flex items-center gap-3">
        <h2 class="text-5xl font-cormorant">{{ fullName }}</h2>
        <MemberIcon :username="member.username" />
        <div class="text-sm rounded-md bg-brand-primary text-yellow-500 font-bold px-2" 
          v-for="role in member.roles" :key="role"
        >{{ role }}</div>
      </div>
      <div class="flex gap-3">
        <FavorDisplay :num="member.creditLimit" label="Your Credit Limit" />
        <FavorDisplay :num="member.transactionTotal" label="Your Total Transactions" class="text-purple-500" />
      </div>
      <p class="my-3 text-center">
        <a href="#table" @click="toggleView('table')" class="btn" :class="{ 'is-active': isTable}">Table</a>
        <a href="#grid" @click="toggleView('grid')" class="btn" :class="{ 'is-active': isGrid}">Grid</a>
      </p>

      <div class="member__balance m-5 text-center">
        <span>Your Balance</span>
        <div class="text-4xl font-bold font-mono" :class="{ 'text-purple-500': member.balance < 0 }">{{ member.balance | favor }}</div>
      </div>

    </header>

    <section class="relative" v-if="isGrid">
      <TransactionCard v-for="(row, idx) in memberTransactions.slice().reverse()" :key="idx" :row="row" isSlim :focusUser="member.uuid" />
    </section>

    <section class="container-fill" v-if="isTable">
      <div class="member__inout flex justify-center">
        <div class="member__credits w-1/2 flex-grow text-right bg-green-200 p-2 border-b-2 border-green-500">
          <FavorDisplay :num="member.credit" label="Credit" />
        </div>
        <div class="member__debits w-1/2 flex-grow bg-purple-200 p-2 border-b-2 border-purple-500">
          <FavorDisplay :num="-member.debit" label="Debit" />
        </div>
      </div>
      <TransactionTchart :trans="memberTransactions.slice().reverse()" :focusUUID="member.uuid" />
    </section>

  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: ['auth'],
  data() {
    return {
      view: 'grid',
    }
  },
  created() {
    this.view = (this.$route.hash) ? this.$route.hash.slice(1) : this.view
  },
  computed: {
    ...mapState(['transactions','members']),
    member() {
      return this.$auth.user;
    },
    memberTransactions() {
      return this.$store.getters.getTransactionsByMemberUUID(this.$auth.user.uuid);
    },
    fullName() {
      return this.member.firstName + ' ' + this.member.lastName
    },
    isGrid() {
      return this.view === 'grid'
    },
    isTable() {
      return this.view === 'table'
    },
  },
  methods: {
    toggleView(view) {
      this.view = view
    }
  },
}
</script>