<template>
  <div class="flex flex-col h-screen">
    <ActionTitle />
    <nuxt class="overflow-y-scroll flex-grow p-2" />
  </div>
</template>

<script>
export default {
  middleware: 'load-data'
}
</script>