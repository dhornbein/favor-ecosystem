<template>
  <div class="input input--username" :class="[$attrs.type, { 'is-required': ('required' in $attrs) }]">
    <label :for="$attrs.id">{{ label }}</label>
    <BaseDropdown v-bind="$attrs" :maxItem="maxItems" :options="members" @selected="apply" v-if="members" />
    <BaseInput :id="hiddenName" :name="hiddenName" type="hidden" v-model="user.id" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['label', 'value', 'hiddenName'],
  data() {
    return {
      test: [{ id: 1, name: 'Option 1'}, { id: 2, name: 'Option 2'}],
      members: null,
      user: {},
      maxItems: 10,
    }
  },
  async fetch() {
    this.members = (await this.$http.$get('/api/members/')).map(member => {
      return {
        id: member.ID,
        name: member.username,
      }
    })
  },
  methods: {
    apply(user) {
      this.user = user
    },
  }
}
</script>