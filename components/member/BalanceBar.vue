<template>
  <div class="balance-bar">
    <div class="balance" :style="balanceStyle"></div>
    <div class="mid"></div>

  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      balanceOver: 0
    }
  },
  computed: {
    balancePercent() {
      const percentage = ((this.member.balance + this.member.creditLimit)  / (this.member.creditLimit * 2)) * 100
      if (percentage < 0 || percentage > 0) this.balanceOver = percentage
      return percentage < 0 ? 0 : percentage > 100 ? 100 : percentage  
    },
    balanceStyle() {
      return {
        height: `${this.balancePercent}%`
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.balance-bar {
  @apply flex flex-col justify-center h-full w-[1px] bg-gradient-to-b from-green-200 via-purple-500 to-green-200;
  .balance {
    @apply w-full bg-pink-500
  }
}
</style>