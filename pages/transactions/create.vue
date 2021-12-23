<template>
  <main>
    
    <header>
      <h2>New Transaction</h2>
    </header>

    <div class="">
      <div class="btn">Request Payment</div>
      <div class="btn">Make Payment</div>
    </div>

    <div class="response" v-if="response">
      <ErrorHandler :error="error" v-if="error" />
      <div v-else>
        <p class="text-green-700"><strong>Success!</strong> The Transaction was added:</p>
        <!-- <TransactionCard :row="response.data" /> -->
        <p>Add another?</p>
      </div>
    </div>

    <div id="transaction-box" class="transaction">
      <h2 class="">Enter Transaction</h2>

      <form class="broker-form">
        <label for="payeeId">Select Payee</label>
        <v-select id="payeeId" :options="membersLabelList" v-model="form.payeeId" :reduce="member => member.uuid"></v-select>
        <label for="recipientId">Select Recipient</label>
        <v-select id="recipientId" :options="membersLabelList" v-model="form.recipientId" :reduce="member => member.uuid"></v-select>
        <label for="schedule"><input type="checkbox" v-model="scheduleLater" id="schedule"> Schedule Payment</label>
        <BaseInput label="Effective Date" id="effectiveDatetime" type="datetime-local" v-model="form.effectiveDatetime" v-if="scheduleLater" />

        <!-- <p>Will this transaction be one time or recurring?</p>
        <BaseInput label="One Time" id="one-time" type="radio" name="recurring-or-not" value="one-time" checked />
        <BaseInput label="Recurring" id="recurring" type="radio" name="recurring-or-not" value="recurring" />

        <BaseInput label="Monthly" type="radio" id="monthly" name="frequency" value="monthly" checked />
        <BaseInput label="Weekly" type="radio" id="weekly" name="frequency" value="weekly" /> -->

        <BaseInput label="Favor Amount" id="amount" type="number" v-model="form.amount" placeholder="100" required />
        <BaseInput label="Transaction Title" id="title" type="text" v-model="form.title" placeholder="Magic Beans, cheap" required />
        <textarea id="transaction-description" class="type__textarea" v-model="form.description" placeholder="Please describe the transaction as accurately as is reasonable. Description should be sufficient to determine that currency speculation and other other anti-network behavior are not at work."></textarea>

        <label for="brokerId">Select Broker</label>
        <v-select id="brokerId" :options="membersLabelList" v-model="form.brokerId" :reduce="member => member.uuid"></v-select>

        <p>Do you attest that this transaction meets our network guidelines?</p>

        <BaseInput label="Yes, I, [Broker Name], most certainly do!" id="assurance" type="checkbox" v-model="form.assurance" />

      </form>

      <button class="btn" @click="formConfirm">Preview</button>

      <BaseModal v-if="showConfirm" @close="showConfirm = false">
        <h2 class="text-2xl">Confirm Transaction</h2>
        <TransactionCard :row="{...form,created:form.effectiveDate}" v-if="form.payeeId && form.recipientId" />
        <p>Are you sure you want to submit this transaction?</p>
        <button class="btn" @click="sendReq">Submit</button> <button class="btn" @click="showConfirm = false">Edit</button>

      </BaseModal>


    </div><!-- TRANSACTION -->

  </main>
</template>

<script>
import { mapState } from 'vuex'
import vSelect from 'vue-select'

export default {
  components: {
    vSelect
  },
  async fetch({store}) {
    await store.dispatch('getAllTransactions'), 
    await store.dispatch('getAllMembers')
  },
  data() {
    return {
      response: null,
      error: null,
      showConfirm: false,
      scheduleLater: false,
      form: {
        payeeId: null,
        recipientId: null,
        effectiveDatetime: this.getDatetimeString(),
        amount: null,
        title: null,
        description: null,
        brokerId: null,
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
  },
  methods: {
    // TODO why isn't this sending me errors?
    async sendReq() {
      this.showConfirm = false
      if (this.formValid){
        await this.$http.$post('/api/transactions', this.form)
        .then(response => {
          this.response = response
        })
        .catch(error => {
          this.response = true
          this.error = error.response.data
          console.warn(error.response);
        })
      }
    },
    // TODO move this into the global scope
    getDatetimeString(date) {
      const newDate = date ? new Date(date) : new Date();
      return new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000).toISOString().slice(0, -8);
    },
    formValid() {
      return true
    },
    formConfirm() {
      if (this.formValid()){
        this.showConfirm = true
      }
    }
  },
}
</script>

<style lang="scss">
@import "vue-select/src/scss/vue-select.scss";

.v-select .vs__dropdown-toggle {
  @apply border border-gray-200 shadow-inner rounded-lg p-2;
  &[aria-expanded="true"] {
    @apply border-t-blue-200 border-l-blue-200 border-r-blue-200 rounded-b-none;
  }
}
</style>
