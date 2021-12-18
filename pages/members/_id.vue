<template>
  <main>
    
    <div class="lg:container mx-auto px-5">

      <header class="max-w-3xl mx-auto">
        <Logo />
        <nuxt-link to="/members" class="text-sm text-gray-500 hover:text-brand-primary">Members</nuxt-link>
        <h2 class="text-5xl font-cormorant flex items-center gap-3">
          <span>{{ userName }}</span>
          <MemberIcon :username="user.username" />
        </h2>
        <div class="flex gap-3">
          <FavorDisplay :num="user.credit_limit" label="Credit Limit" />
          <FavorDisplay :num="user.transaction_total" label="Total Transactions" class="text-purple-500" />
        </div>
      </header>

      <section>
        <div class="member__balance m-5 text-center">
          <span>Balance</span>
          <div class="text-4xl font-bold font-mono" :class="{ 'text-purple-500': user.balance < 0 }">{{ user.balance | favor }}</div>
        </div>
        <div class="member__inout flex justify-center">
          <div class="member__credits flex-grow text-right bg-green-200 p-2 mb-2 border-b-2 border-green-500">
            <FavorDisplay :num="user.credit" label="Credit" />
          </div>
          <div class="member__debits flex-grow bg-purple-200 p-2 mb-2 border-b-2 border-purple-500">
            <FavorDisplay :num="-user.debit" label="Debit" />
          </div>
        </div>
      </section>
      
    </div>

    <div class="py-5 px-2 flex flex-wrap">
    </div>


  </main>
</template>

<script>
export default {
  asyncData ({ params, error, $http }) {
    return $http.$get('/api/members/' + params.id)
      .then((res) => {
        return { user: res }
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'Member not found' })
      })
  },
  head () {
    return {
      title: `User: ${this.userName}`
    }
  },
  computed: {
    userName() {
      return this.user.first_name + ' ' + this.user.last_name
    }
  }
}
</script>