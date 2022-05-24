<template>
  <article class="grid grid-cols-2 items-center">

    <div class="col-span-2 items-center text-center flex flex-col gap-4 justify-center pt-6 pb-4">

      <MemberIcon :username="member.username" highlight />

      <div class="name leading-snug">
        <MemberDisplayName class="block" :member="member" />
        <MemberUsername class="text-sm text-brand-gray-400" noLink :username="member.username" />
      </div>

    </div>

    <BaseFavor class="w-auto col-span-2 text-3xl text-right py-4 px-2 mb-4 -mx-2 bg-brand-primary text-brand-gold" :sup="false" :num="member.creditLimit + member.balance">
      <div class="text-base">Available</div>
    </BaseFavor>


    <nuxt-link to="/onboard">
      <svg class="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      Onboarding
    </nuxt-link>

    <BaseFavor class="text-right" :num="member.balance">
      <div class="label text-xs">Balance</div>
    </BaseFavor>
    
    <nuxt-link to="/my/settings" class="cursor-pointer">
      <svg class="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      Edit Profile
    </nuxt-link>

    <BaseFavor class="text-right" :num="member.creditLimit">
      <div class="label text-xs">Credit Limit</div>
    </BaseFavor>
    
    <button class="text-left" @click="$auth.logout()">
      <svg class="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
      Logout
    </button>

    <BaseFavor class="text-right" :num="member.transactionTotal">
      <div class="label text-xs">Total Transactions</div>
    </BaseFavor>
    
    <nuxt-link to="/broker" class="cursor-pointer" v-if="isBroker">
      <svg class="w-6 h-6 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path></svg>
      Broker Transaction
    </nuxt-link>

  </article>
</template>

<script>
export default {
  computed: {
    member() {
      return this.$auth.user
    },
    isBroker() {
      return this.$auth.user.roles.includes('broker')
    }
  },
}
</script>