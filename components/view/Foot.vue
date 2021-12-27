<template>
  <footer class="w-screen p-2 bg-white shadow-lg border-t border-brand-primary z-30">
    <div class="actions flex justify-end">
      <nuxt-link to="/exchange" class="rounded-full bg-brand-primary text-yellow-500 font-bold px-4 h-full inline-block">Pay / Request</nuxt-link>
    </div>
    <nav class="flex justify-around items-center mt-2 pt-2 border-t border-dotted border-yellow-500">
      <nuxt-link to="/">Home</nuxt-link>
      <nuxt-link to="/members">Members</nuxt-link>
      <nuxt-link to="/invite">Invite</nuxt-link>
    </nav>
  </footer>
</template>