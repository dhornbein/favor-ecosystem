<template>
  <div class="input">
    <input class="input" v-bind="$attrs" :value="value" v-on:input="$emit('input', $event.target.value)">
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['value']
}
</script>