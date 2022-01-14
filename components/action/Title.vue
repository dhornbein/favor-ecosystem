<template>
  <div class="flex p-2 border-b border-brand-gray-200">
    <a @click="$router.go(-1)" class="text-brand-gray-400">&larrlp; Back</a>
    <div class="mx-2 px-2 flex-grow border-l border-r border-brand-gray-200 font-bold text-brand-primary">Request / Pay</div>
    <nuxt-link to="/">close</nuxt-link>
  </div>
</template>