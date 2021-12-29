<template>
  <div class="flex p-2 border-b border-gray-300">
    <a @click="$router.go(-1)" class="text-gray-500">&larrlp; Back</a>
    <div class="mx-2 px-2 flex-grow border-l border-r border-gray-300 font-bold text-brand-primary">Request / Pay</div>
    <nuxt-link to="/">close</nuxt-link>
  </div>
</template>