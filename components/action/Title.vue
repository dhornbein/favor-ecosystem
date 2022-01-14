<template>
  <div class="flex p-2 border-b border-brand-gray-200">
    <a @click="$router.go(-1)" class="text-brand-gray-400 flex gap-1 items-center cursor-pointer">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
      Back
    </a>
    <div class="mx-2 px-2 flex-grow border-l border-r border-brand-gray-200 font-bold text-brand-primary"><slot></slot></div>
    <nuxt-link to="/" class=" flex gap-1 items-center">
      close
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </nuxt-link>
  </div>
</template>