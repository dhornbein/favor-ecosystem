<template>
  <header class="w-screen p-2 bg-white shadow-lg border-b border-brand-primary z-30">
    <nav class="flex justify-around items-center">
      <nuxt-link to="/">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      </nuxt-link>
      <nuxt-link to="/members">Members</nuxt-link>
      <nuxt-link to="/transactions">Transactions</nuxt-link>
    </nav>
  </header>
</template>