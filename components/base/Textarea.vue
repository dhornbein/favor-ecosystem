<template>
  <div class="textarea" :class="[$attrs.type, { 'is-required': ('required' in $attrs) }]" v-if="label">
    <label :for="$attrs.id">{{ label }}</label>
    <textarea v-bind="$attrs" :value="value" v-on:input="$emit('input', $event.target.value)">
    </textarea>
  </div>
  <textarea v-else v-bind="$attrs" :value="value" v-on:input="$emit('input', $event.target.value)">
  </textarea>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['label', 'value']
}
</script>

<style lang="scss">
textarea {
  @apply border border-gray-200 shadow-inner rounded-lg p-2 focus:border-blue-200 w-full h-80 max-h-[70vh]
}
</style>