<template>
  <div class="my-4 flex-grow flex flex-col">

    <ValidationProvider immediate rules="uuid|unique:@recipient,Recipient" v-slot="{ errors }">
        <input
          :value="payeeUid"
          @change="setValues"
          type="hidden"
          name="payee"
        ><span class=errors>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider name="recipient" rules="uuid" v-slot="{ errors }">
        <input
          :value="recipientUid"
          @change="setValues"
          type="hidden"
          name="recipient"
        ><span class=errors>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider slim v-slot="{ errors, classes }">
      <div class="control" :class="classes">
        <input
          v-model="details.amount"
          @change="setValues"
          type="number"
          placeholder="0.000"
          min="0.001"
          required
          name="amount"
          class="amount"
        >
        <div class="input-meta">
          <span class=errors>{{ errors[0] }}</span>
        </div>
      </div>
    </ValidationProvider>
    <ValidationProvider slim v-slot="{ errors, classes }">
      <div class="control" :class="classes">
        <input
          v-model="details.title"
          @change="setValues"
          type="text"
          maxlength="140"
          minlength="4"
          required
          placeholder="Click to add Title"
          name="title"
          class="title"
        >
        <div class="input-meta">
          <span class=errors>{{ errors[0] }}</span>
          <span class="detail text-right text-sm text-gray-400">{{ details.title.length }}/140</span>
        </div>
      </div>
    </ValidationProvider>
    <ValidationProvider slim v-slot="{ errors, classes }">
      <div class="control" :class="classes">
        <textarea
          v-model="details.description"
          @change="setValues"
          name="description"
          placeholder="Optional description"
          class="description"
        ></textarea>
        <div class="input-meta">
          <span class=errors>{{ errors[0] }}</span>
        </div>
      </div>
    </ValidationProvider>
    <!-- add broker drop down -->
  </div>
</template>



<script>
import { ValidationProvider } from "vee-validate";

export default {
  components: {
    ValidationProvider
  },
  props: {
    payeeUid: {
      type: String,
    },
    recipientUid: {
      type: String,
    }
  },
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
      this.$store.dispatch('exchange/setDetails', {
        ...this.details,
        payeeId: this.payeeUid,
        recipientId: this.recipientUid
      })
    },
  },
}
</script>

<style lang="scss" scoped>
input {
  @apply p-2 w-full text-2xl border-b-2 border-gray-500;
}

.control {
  @apply my-4;
}

.errors {
  @apply text-red-500 text-sm;
}

.amount {
  @apply text-4xl text-center;
}

.title {
}

.description {
  @apply w-full max-w-prose mx-auto min-h-[2rem] shadow-md rounded-md p-2 border border-gray-100;
}
</style>