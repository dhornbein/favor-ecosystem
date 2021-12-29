<template>
  <span class="display-name">
    <span class="display-name__first">{{ member.firstName }}</span>
    <span class="display-name__last">{{ member.lastName }}</span>
  </span>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
      required: true
    }
  },
}
</script>