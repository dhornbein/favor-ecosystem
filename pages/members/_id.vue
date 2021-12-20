<template>
  <main>
    
    <header>

      <nuxt-link to="/members" class="text-sm text-gray-500 hover:text-brand-primary">Members</nuxt-link>
      <h2 class="text-5xl font-cormorant flex items-center gap-3">
        <span>{{ userName }}</span>
        <MemberIcon :username="member.username" />
      </h2>
      <div class="flex gap-3">
        <FavorDisplay :num="member.credit_limit" label="Credit Limit" />
        <FavorDisplay :num="member.transaction_total" label="Total Transactions" class="text-purple-500" />
      </div>
      <p class="my-3 text-center">
        <a href="#table" @click="toggleView('table')" class="btn" :class="{ 'is-active': isTable}">Table</a>
        <a href="#grid" @click="toggleView('grid')" class="btn" :class="{ 'is-active': isGrid}">Grid</a>
      </p>

      <div class="member__balance m-5 text-center">
        <span>Balance</span>
        <div class="text-4xl font-bold font-mono" :class="{ 'text-purple-500': member.balance < 0 }">{{ member.balance | favor }}</div>
      </div>

    </header>

    <section class="relative" v-if="isGrid">
      <TransactionCard v-for="(row, idx) in trans.slice().reverse()" :key="idx" :row="row" isSlim :focusUser="member.ID" />
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
      <TransactionTchart :trans="trans.slice().reverse()" :targetId="member.ID" />
    </section>

  </main>
</template>

<script>
export default {
  asyncData ({ params, error, $http }) {
    return Promise.all([
      $http.$get('/api/transactions/' + params.id), 
      $http.$get('/api/members/' + params.id)
    ])
    .then(function([trans,member]) {
      return { trans, member }
    })
    .catch((e) => {
      console.log(e);
      error({ statusCode: 404, message: 'Member not found for id: ' + params.id })
    });
  },
  head () {
    return {
      title: `User: ${this.userName}`
    }
  },
  data() {
    return {
      view: 'grid',
    }
  },
  created() {
    this.view = (this.$route.hash) ? this.$route.hash.slice(1) : this.view
  },
  computed: {
    userName() {
      return this.member.first_name + ' ' + this.member.last_name
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