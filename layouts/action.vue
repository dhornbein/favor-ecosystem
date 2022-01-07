<template>
  <div class="flex flex-col h-screen">
    <ActionTitle />
    <Nuxt class="overflow-y-scroll flex-grow p-2" />
    <ChatBot class="fixed bottom-2 right-2" />
  </div>
</template>

<script>
export default {
  middleware: 'load-data'
}
</script>