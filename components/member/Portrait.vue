<template>
  <div class="member-portrait">
    <MemberIcon class="mx-auto" :username="member.username" />
    <MemberDisplayName class="block mt-2" :member="member" />
    <MemberUsername class="text-sm text-gray-400" :username="member.username" />
  </div>
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