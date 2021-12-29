<template>
  <section>
    <ActionSearch placeholder="Search" v-model="search" />
    <h2 class="text-xl font-cormorant">Frequent Exchanges</h2>
    <MemberCard 
      class="my-2"
      v-for="(member, idx) in recentMembers" 
      :key="idx" 
      :member="member" 
      @cardClick="cardClick(member.uuid)" 
      view="compact"
    />
  </section>
</template>

<script>
export default {
  layout: 'action',
  data() {
    return {
      search: ''
    }
  },
  computed: {
    recentMembers() {
      return this.$store.getters.getRelatedMembers(this.$auth.user.uuid)
    }
  },
  methods: {
    cardClick(uuid) {
      this.$router.push(`/exchange/${uuid}`)
    }
  }
}
</script>