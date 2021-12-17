<template>
  <main>
    
    <div class="lg:container mx-auto px-5">

      <header class="max-w-3xl mx-auto">
        <Logo />
        <h2 class="text-xl font-cormorant">Members</h2>
      </header>
      
    </div>

    <div class="py-5 px-2 flex flex-wrap">
      <div class="w-full md:w-1/2 lg:w-1/3 p-4" v-for="(row, idx) in members" :key="idx">
        <MemberCard class="h-full" :row="row" />
      </div>
    </div>


  </main>
</template>

<script>
export default {
  async asyncData ({ $http }) {
    const data = await $http.$get('/api/members')
    return { members: data }
  },
  head () {
    return {
      title: 'Users'
    }
  }
}
</script>