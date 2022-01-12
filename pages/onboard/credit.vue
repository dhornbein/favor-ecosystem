<template>
  <article class="onboard__credit">
    <h1>Every Member has a line of credit</h1>

    <p>This is you:</p>

    <MemberCard :member="$auth.user" size="open" class="p-2 my-2 border border-gray-200 rounded-md" />

    <p>Right now you have a <strong>balance</strong> of <BaseFavor :num="$auth.user.balance" />, that might seem low but you
    have a line of <strong>credit</strong> of <BaseFavor :num="$auth.user.creditLimit" />. That's why your <strong>available balance</strong> is 
    <BaseFavor :num="$auth.user.creditLimit + $auth.user.balance" />!</p>

    <p>The most important number, though, is your <strong>Total Transactions</strong>. That is how much money you
    have moved through the network. It's not about having a big balance, it's about having the most transactions!</p>

    <p></p>
  </article>
</template>

<style lang="scss">
.onboard__credit {
  .edit .btn,
  .body .edit {
    @apply hidden;
  }
}
</style>