<template>
  <div class="input" :class="[$attrs.type, { 'is-required': ('required' in $attrs) }]" v-if="label">
    <label :for="$attrs.id">{{ label }}</label>
    <input v-bind="$attrs" :value="value" v-on:input="$emit('input', $event.target.value)">
  </div>
  <input class="input" v-else v-bind="$attrs" :value="value" v-on:input="$emit('input', $event.target.value)">
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['label', 'value']
}
</script>

<style lang="scss">
  .input {
    @apply flex flex-col gap-2;

    &.radio,
    &.checkbox {
      @apply flex-row-reverse justify-end items-baseline;
    }

    &.is-required label:after {
      content: ' *';
      @apply text-red-500 font-bold;
    }
  }
    
  input.input,
  .input input {
    @apply border border-brand-gray-200 shadow-inner rounded-lg p-2 focus:border-blue-200 w-full;
  }
</style>