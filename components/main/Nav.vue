<template>
  <footer class="w-screen p-2 bg-white shadow-lg border-t border-brand-primary z-30 relative">
    <div class="actions grid grid-cols-4 gap-2">
      <nuxt-link to="/exchange" class="col-start-2 col-end-4 w-full text-center rounded-full bg-brand-primary text-yellow-500 font-bold px-4 text-2xl">Send Favor</nuxt-link>
      <ChatBot />
    </div>
    <nav class="flex justify-around items-center mt-2 pt-2 border-t border-dotted border-yellow-500">
      <nuxt-link to="/">Home</nuxt-link>
      <nuxt-link to="/members">Members</nuxt-link>
      <nuxt-link to="/transactions">Transactions</nuxt-link>
    </nav>
  </footer>
</template>