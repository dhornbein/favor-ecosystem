<template>
  <section class="user is-logged-in" v-if="user">
    <header @click="toggleMemberInfo">
        <MemberIcon :username="user.username" highlight />
        <h1>{{ user.firstName }}</h1>
        <p class="ml-auto">{{ user.balance }}</p>
    </header>
    <main v-if="memberInfo">
      collapsable, user information, ability to edit
      <a @click="$auth.logout()">Logout</a>
    </main>
  </section>
  <section class="user" v-else>
    <BaseButton><nuxt-link to="/account/login">Login</nuxt-link></BaseButton>
  </section>
</template>

<script>
export default {
  data() {
    return {
      memberInfo: false,
    }
  },
  computed: {
    user() {
      return this.$auth.user;
    },
  },
  methods: {
    toggleMemberInfo() {
      this.memberInfo = !this.memberInfo;
    },
  }
}
</script>

<style lang="scss">
.user {
  @apply p-2;
  header {
    @apply flex justify-start items-center;
  }
}

</style>