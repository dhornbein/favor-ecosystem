<template>
  <div class="my-4 flex-grow flex flex-col">
    <div class="field">
      <input
        v-model="details.amount"
        @change="setValues"
        type="number"
        placeholder="0.000"
        required
        name=""
        id=""
        class="amount"
      >
    </div>
    <div class="field">
      <input
        v-model="details.title"
        @change="setValues"
        type="text"
        maxlength="140"
        required
        placeholder="Click to add Title"
        class="title"
      >
      <div class="detail text-right text-sm text-gray-400">{{ details.title.length }}/140</div>
    </div>
    <div class="field">
      <textarea
        v-model="details.description"
        @change="setValues"
        name="description"
        placeholder="Optional description"
        class="description"
      ></textarea>
    </div>
    <!-- add broker drop down -->
  </div>
</template>



<script>
export default {
  data() {
    return {
      details: {
        amount: '',
        title: '',
        description: '',
        brokerId: '',
      }
    }
  },
  mounted() {
    this.details = {
      ...this.$store.getters['exchange/details']
    }
  },
  methods: {
    validate() {
      
      return true
    },
    setValues() {
      this.$store.dispatch('exchange/setDetails', this.details)
    },
  },
}
</script>

<style lang="scss" scoped>
input {
  @apply p-2 w-full text-2xl border-b-2 border-gray-500 invalid:border-red-200;
}

.field {
  @apply my-4;
}

.amount {
  @apply text-4xl text-center;
}

.title {
}

.description {
  @apply min-h-[2rem] focus:shadow-inner;
}
</style>