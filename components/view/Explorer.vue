<template>
  <section class="">
    <div class="search">
      <v-select class="search__field" id="payeeUid" :options="members" v-model="search" label="firstName">
        <template v-slot:option="option">
          <MemberIcon :username="option.username" />
          {{ option.username }}
        </template>
      </v-select>
      <BaseButton>Search</BaseButton>
    
    </div>
    <div class="history">
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import vSelect from 'vue-select'

export default {
  components: {
    vSelect
  },
  data() {
    return {
      search: '',
    }
  },
  computed: {
    ...mapState(['members'])
  },
}
</script>

<style lang="scss">
@import "vue-select/src/scss/vue-select.scss";
.search {
  @apply flex justify-between gap-2 items-center p-2;
  .search__field {
    @apply flex-grow; 
    .vs__dropdown-toggle {
      @apply px-4 py-2 shadow-inner rounded-md border border-brand-gray-400 focus:border-brand-primary;
    }
  }
}
</style>