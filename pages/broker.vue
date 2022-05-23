<template>
  <main>

    <ValidationObserver 
    class="transaction-form form"
    tag="div"
    ref="form"
    v-slot="{ handleSubmit }"
  >
    <ActionTitle>Broker Transaction</ActionTitle>
    <BaseLoader class="loader" v-if="loading">{{ status }}</BaseLoader>

    <div class="response" v-if="response">
      <ErrorHandler :error="error" v-if="error" />
      <div v-else>
        <p class="text-green-700"><strong>Success!</strong> The Transaction was added:</p>
        <TransactionCard :row="response.data" />
      </div>
    </div>

    <ValidationProvider immediate rules="uid|unique:@recipient,Recipient|required" v-slot="{ errors }">
      <label for="payeeUid">Select Payee</label>
      <v-select id="payeeUid" :options="membersLabelList" required v-model="form.payeeUid" :reduce="member => member.uid"></v-select>
      <span class=errors>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider name="recipient" rules="uid|required" v-slot="{ errors }">
      <label for="recipientUid">Select Recipient</label>
      <v-select id="recipientUid" :options="membersLabelList" required v-model="form.recipientUid" :reduce="member => member.uid"></v-select>
      <span class=errors>{{ errors[0] }}</span>
    </ValidationProvider>

    <!-- <label for="schedule"><input type="checkbox" v-model="scheduleLater" id="schedule"> Schedule Payment</label>
    <BaseInput label="Effective Date" id="effectiveDatetime" type="datetime-local" v-model="form.effectiveDatetime" v-if="scheduleLater" /> -->
    
    <!-- <p>Will this transaction be one time or recurring?</p>
    <BaseInput label="One Time" id="one-time" type="radio" name="recurring-or-not" value="one-time" checked />
    <BaseInput label="Recurring" id="recurring" type="radio" name="recurring-or-not" value="recurring" />

    <BaseInput label="Monthly" type="radio" id="monthly" name="frequency" value="monthly" checked />
    <BaseInput label="Weekly" type="radio" id="weekly" name="frequency" value="weekly" /> -->

    <div class="transaction-form__inputs">

      <ValidationProvider slim rules="min_value:0.001" v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <input
            v-model="form.amount"
            type="number"
            placeholder="0.000"
            min="0.000"
            step="1"
            :max="payee.creditLimit + payee.balance"
            required
            name="amount"
            class="amount"
          >
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
            <span class="detail is-hidden-on-error" v-if="payee">Available: <BaseFavor :num="payee.creditLimit + payee.balance" :sup="false" /></span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <input
            v-model="form.title"
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
            <span class="detail" v-if="form.title">{{ form.title.length }}/140</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider slim v-slot="{ errors, classes }">
        <div class="control" :class="classes">
          <textarea
            v-model="form.description"
            name="description"
            placeholder="Optional description"
            class="description flex"
          ></textarea>
          <div class="input-meta">
            <span class=errors>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider rules="uid" v-slot="{ errors }">
        <label for="brokerUid" class="text-lg font-bold">Broker</label>
        <MemberCard :member="broker" size="mini" class="my-2" />
        <input
            v-model="form.brokerUid"
            type="hidden"
            readonly
            name="brokerUid"
          ><span class=errors>{{ errors[0] }}</span>
      </ValidationProvider>
    </div>



    <button
      @click="handleSubmit(submitPreview)"
      class="text-2xl mx-2 w-full flex-grow bg-purple-500 text-purple-100 font-bold px-4 py-2 rounded-full disabled:bg-brand-gray-200"
    >Preview</button>

    <BaseModal v-if="showConfirm" @close="showConfirm = false">
      <h2 class="text-2xl">Confirm Transaction</h2>
      <TransactionCard :trans="{...form,created:form.effectiveDate,amount: parseInt(form.amount)}" size="open" v-if="form.payeeUid && form.recipientUid" />
      <p>Are you sure you want to submit this transaction?</p>
      <button class="btn" @click="handleSubmit(submitTransaction)">Submit</button> <button class="btn" @click="showConfirm = false">Edit</button>
    </BaseModal>


  </ValidationObserver>

  <div class="history mt-4" v-if="transactionHistory.length > 0">
    <h2 class="font-bold">Transaction History</h2>
    <div class="transaction-history">
      <TransactionCard v-for="(transaction, index) in transactionHistory" :key="index" :trans="transaction"></TransactionCard>
    </div>
  </div>

  </main>
</template>

<script>
/**
 * Add transaction page
 * This page is used by brokers to add new transactions to the network.`
 */
import { ValidationProvider, ValidationObserver } from "vee-validate"
import { mapState } from 'vuex'
import vSelect from 'vue-select'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    vSelect
  },
  layout: 'action',
  head () {
    return {
      title: `Create Transaction`
    }
  },
  middleware: ['auth-broker'], // authenticate broker
  async fetch({store}) {
    await store.dispatch('getAllTransactions'), 
    await store.dispatch('getAllMembers')
  },
  data() {
    return {
      loading: false,
      status: '',
      response: null,
      error: null,
      showConfirm: false,
      scheduleLater: false,
      transactionHistory: [],
      form: {
        payeeUid: null,
        recipientUid: null,
        effectiveDatetime: this.getDatetimeString(),
        amount: null,
        title: null,
        description: null,
        brokerUid: null, // set by computed.broker
        assurance: false
      }
    }
  },
  computed: {
    ...mapState(['transactions','members']),
    membersLabelList() {
      return this.members.reduce((arr, member) => {
        return [...arr, 
          {
            label: `${member.firstName} ${member.lastName} (${member.username})`,
            ...member
          }
        ]
      }, []);
    },
    payee() {
      if (!this.form.payeeUid) return false
      return this.members.find(member => member.uid === this.form.payeeUid)
    },
    recipient() {
      if (!this.form.recipientUid) return false
      return this.members.find(member => member.uid === this.form.recipientUid)
    },
    broker() {
      const broker = this.$auth.user
      this.form.brokerUid = broker.uid
      return broker
    }
  },
  methods: {
    async submitTransaction () {
      this.loading = true;
      this.showConfirm = false
      this.status = 'Posting Transaction...'
      try {
        const payload = this.form

        this.$axios.post('api/transactions', payload)
        .then(async response => {
          const transaction = response.data.data
          console.log('response', response);

          this.status = 'Refreshing data...'
          await Promise.all([
            this.$store.dispatch('getAllTransactions'),
            this.$store.dispatch('getAllMembers'),
            this.$auth.fetchUser()
          ]);

          this.$store.dispatch('chat/broadcastSuccess', { 
            title: 'Transaction Successful!',
            body: `<p>You successfully brokered ${this.payee.firstName} paying ${this.recipient.firstName} f${transaction.amount}!</p>`,
            button: {
              text: 'View Transaction',
              url: `/transactions/${transaction.uid}`
            }
          })
          // add to transaction list
          this.transactionHistory.unshift( transaction )
          this.loading = false
        })
      } catch (error) {
        console.error('submit payment error', error);
        this.$store.dispatch('chat/broadcastErrorResponse', {
          response: error.response,
        })
      }
    },
    // TODO move this into the global scope
    getDatetimeString(date) {
      const newDate = date ? new Date(date) : new Date();
      return new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000).toISOString().slice(0, -8);
    },
    submitPreview() {
      this.showConfirm = true
    }
  },
}
</script>

<style lang="scss">
@import "vue-select/src/scss/vue-select.scss";

.v-select .vs__dropdown-toggle {
  @apply border border-brand-gray-200 shadow-inner rounded-lg p-2;
  &[aria-expanded="true"] {
    @apply border-t-blue-200 border-l-blue-200 border-r-blue-200 rounded-b-none;
  }
}

// TODO: move this into the global scope, duplicate of /exachange/pay/_username.vue
.transaction-form {
  @apply flex flex-col gap-4;

  .transaction-form__portraits {
    @apply flex my-4 justify-between;
  }

  .transaction-form__inputs {
    @apply flex flex-col gap-4;

    input {
      @apply p-2 w-full text-2xl border-b-2 border-brand-gray-400;
    }
  }

  .control {
    &.invalid input {
      @apply border-red-500;
    }
    &.invalid .is-hidden-on-error {
      @apply hidden;
    }
  }

  

  .amount {
    @apply text-4xl text-center;
  }

  textarea.description {
    @apply w-full max-w-prose mx-auto min-h-[6rem] shadow-md rounded-md p-2 border border-brand-gray-200;
  }
}
</style>
