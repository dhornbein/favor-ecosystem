<template>
  <div class="flex flex-col h-screen">
    <Nuxt ref="page" class="overflow-y-scroll flex-grow p-2" />
    <ChatBot class="fixed bottom-2 right-2 w-12 h-12" />
  </div>
</template>

<!-- Action layout, used for "action" pages, like the exchange page -->