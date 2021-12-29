<template>
  <main v-if="$auth.loggedIn">
    
    <div class="flex items-center gap-3">
      <MemberIcon :username="member.username" />
      <h2 class="text-2xl font-cormorant">{{ fullName }}</h2>
      <div class="text-xs rounded-md bg-brand-primary text-yellow-500 font-bold px-2" 
        v-for="role in member.roles" :key="role"
      >{{ role }}</div>
    </div>

    <div class="flex gap-3">
      <BasicFavor :num="member.creditLimit" label="Credit Limit" />
      <BasicFavor :num="member.transactionTotal" label="Total Transactions" class="text-purple-500" />
    </div>

    <div class="member__balance m-5 text-center" v-if="balance">
      <span>Balance</span>
      <div class="text-4xl font-bold font-mono" :class="{ 'text-purple-500': member.balance < 0 }">{{ balanceSplit[0] }}<sup>{{ balanceSplit[1] }}</sup> </div>
    </div>

  </main>
</template>

<script>

export default {
  props: {
    member: {
      type: Object,
      required: true
    },
    balance: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
    }
  },
  computed: {
    balanceSplit() {
      return parseFloat(this.member.balance).toFixed(3).toString().split('.')
    },
    memberTransactions() {
      return this.$store.getters.getTransactionsByMemberUUID(this.member.uuid);
    },
    fullName() {
      return this.member.firstName + ' ' + this.member.lastName
    },
  },
}
</script>