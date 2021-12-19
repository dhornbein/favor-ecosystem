<template>
  <div class="modal">
    <div class="modal__overlay"  @click="$emit('close')">
      <BaseCloseButton class="modal__close-button">Close</BaseCloseButton>
    </div>
    <div class="modal__body">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.modal {
  @apply fixed inset-0 z-40 justify-center items-center flex;
  
  .modal__overlay {
    @apply bg-opacity-30 bg-black absolute inset-0;
    
    .modal__close-button {
      @apply p-2 m-2 float-right text-white bg-black rounded-md border border-white hover:bg-white hover:text-brand-primary;
    }
  }

  .modal__body {
    @apply relative bg-white rounded-md shadow-lg p-5 max-w-[90vw] max-h-[90vh] z-50;
  }
}
</style>