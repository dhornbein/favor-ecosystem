<template>
    <nav class="nav" :class="{'is-active':showNav}">
      <MemberIcon username="FSN" />
      <div class="nav__menu">
        <nuxt-link :to="item.url" v-for="(item, idx) in nav" :key="idx"
          class=""
        >{{ item.title }}</nuxt-link>
      </div>
      <BaseBurger :active="showNav" @click="showNav = !showNav" />
    </nav>
</template>

<script>
  export default {
    data() {
      return {
        showNav: true,
        nav: [
          {
            title: 'Home',
            url: '/'
          },
          {
            title: 'transactions',
            url: '/transactions'
          }, 
          {
            title: '+ Create',
            url: '/transactions/create'
          }, 
          {
            title: 'Members',
            url: '/members'
          },
          {
            title: '+ Create',
            url: '/members/create'
          },
        ]
      }
    }
  }
</script>

<style lang="scss">
.nav {
  @apply bg-white flex gap-2 justify-between items-center p-2;

  .nav__menu {
    @apply hidden md:flex justify-between gap-2 px-2;

    a {
      @apply font-bold text-brand-primary hover:text-yellow-500;
    }
  }

  &.is-active {
    @apply flex-wrap;

    .nav__menu {
      @apply flex flex-col order-last w-full p-2 -mx-2 bg-gray-100;

      a {
        @apply font-bold text-brand-primary hover:text-yellow-500;
      }
    }
  }
    
}
</style>