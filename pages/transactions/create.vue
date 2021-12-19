<template>
  <main>
    
    <div class="lg:container mx-auto px-5">

      <header class="max-w-3xl mx-auto">
        <Logo />
        <h2 class="text-xl font-cormorant">New Transaction</h2>
      </header>

      <div class="">
        <div class="btn">Request Payment</div>
        <div class="btn">Make Payment</div>
      </div>

      <pre>{{ response }}</pre>

      <div id="transaction-box" class="transaction">
        <h2 class="">Enter Transaction</h2>

        <form class="broker-form">
          <BaseInput label="Purchaser" id="purchaser" type="text" v-model="form.payee" placeholder="@jacklovesbeans" required />
          <BaseInput id="purchaser_id" type="hidden" v-model="form.payee_id" />
          <BaseInput label="Recipient" id="recipient" type="text" v-model="form.recipient" placeholder="@oldcowfan" required />
          <BaseInput id="recipient_id" type="hidden" v-model="form.recipient_id" />
          <label for="schedule"><input type="checkbox" v-model="scheduleLater" id="schedule"> Schedule Payment</label>
          <BaseInput label="Effective Date" id="effective_date" type="date" v-model="form.effective_datetime" v-if="scheduleLater" />

          <!-- <p>Will this transaction be one time or recurring?</p>
          <BaseInput label="One Time" id="one-time" type="radio" name="recurring-or-not" value="one-time" checked />
          <BaseInput label="Recurring" id="recurring" type="radio" name="recurring-or-not" value="recurring" />

          <BaseInput label="Monthly" type="radio" id="monthly" name="frequency" value="monthly" checked />
          <BaseInput label="Weekly" type="radio" id="weekly" name="frequency" value="weekly" /> -->

          <BaseInput label="Favor Amount" id="amount" type="number" v-model="form.amount" placeholder="100" required />
          <BaseInput label="Transaction Title" id="title" type="text" v-model="form.title" placeholder="Magic Beans, cheap" required />
          <textarea id="transaction-description" class="type__textarea" v-model="form.description" placeholder="Please describe the transaction as accurately as is reasonable. Description should be sufficient to determine that currency speculation and other other anti-network behavior are not at work."></textarea>

          <BaseInput label="Broker Username" id="broker" type="text" v-model="form.broker_name" placeholder="@tomsawyer" />
          <BaseInput type="hidden" v-model="form.broker_name_id" />
          <BaseInput label="Broker Password" id="password" type="password" name="password" placeholder="password" />


          <p>Do you attest that this transaction meets our network guidelines?</p>

          <BaseInput label="Yes, I, [Broker Name], most certainly do!" id="assurance" type="checkbox" v-model="form.assurance" />

        </form>

        <button class="btn" @click="formConfirm">Submit</button>

        <BaseModal v-if="showConfirm" @close="showConfirm = false">
          <h2 class="text-2xl">Confirm Transaction</h2>
          <TransactionCard :row="{...form,timestamp:form.effective_date}" v-if="form.payee && form.recipient" />
          <p>Are you sure you want to submit this transaction?</p>
          <button class="btn" @click="sendReq">Submit</button> <button class="btn" @click="showConfirm = false">Edit</button>

        </BaseModal>


      </div><!-- TRANSACTION -->

    </div>

  </main>
</template>

<script>
export default {
  data() {
    return {
      response: null,
      error: null,
      showConfirm: false,
      scheduleLater: false,
      form: {
        payee: null,
        payee_id: null,
        recipient: null,
        recipient_id: null,
        effective_datetime: new Date().toLocaleDateString('en-CA'),
        amount: null,
        title: null,
        description: null,
        broker_name: null,
        broker_name_id: null,
        assurance: false
      }
    }
  },
  methods: {
    sendReq() {
      this.showConfirm = false
      if (this.formValid){
        this.$http.$post('/api/transactions/create', this.form)
        .then(response => {
          this.response = response
        })
        .catch(error => {
          this.error = error
        })
      }
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

<style lang="scss" scoped>

</style>
