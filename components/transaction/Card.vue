<template>
  <article class="card" :class="classes" @click="$emit('click')">

    <header class="header">
      <nuxt-link :to="`/transactions/${trans.uid}`" @click.stop><time :datetime="trans.created">{{ trans.created | formatDate }}</time></nuxt-link>
    </header>

    <main>
      <div class="exchange">
        <div class="people">
          <MemberPortrait class="payee" :member="payee" :highlight="isFocusedPayee"/>
          <div class="middle">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
          </div>
          <MemberPortrait class="recipient" :member="recipient" :highlight="isFocusedRecipient" />
        </div>
        <div class="favor">
          <div class="payee">
            <div class="amount font-bold text-purple-500"><BaseFavor :num="-trans.amount" /></div>
            <div class="fee"><BaseFavor :num="-fee / 2"><span class="text-sm">fee</span></BaseFavor></div>
            <div class="total text-purple-500"><BaseFavor :num="(-fee / 2) + -trans.amount" /></div>
          </div>
          <div class="summary">
            <div class="amount text-xl"><BaseFavor class="focus" :num="focusAmount" :plus="isFocusedRecipient" /></div>
          </div>
          <div class="recipient">
            <div class="amount font-bold"><BaseFavor :num="trans.amount" plus /></div>
            <div class="fee"><BaseFavor :num="-fee / 2"><span class="text-sm">fee</span></BaseFavor></div>
            <div class="total"><BaseFavor :num="(-fee / 2) + trans.amount" plus /></div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="summary">
          <nuxt-link :to="`/members/${payee.username}`" class="payee" @click.stop>{{ payee.firstName }}</nuxt-link> paid <nuxt-link :to="`/members/${recipient.username}`" class="recipient" @click.stop>{{ recipient.firstName }}</nuxt-link> for:
        </div>
        <h1 class="title">{{ trans.title }}</h1>
        <div class="description">{{ trans.description }}</div>
      </div>
    </main>

    <footer class="footer">
      <div class="broker" v-if="broker">
        <MemberIcon :username="broker.username" />
        <div class="broker_name">
          <p class="label">Broker</p>
          <nuxt-link :to="`/members/${broker.username}`">
            <MemberDisplayName :member="broker" />
          </nuxt-link>
        </div>
      </div>
    </footer>

  </article>
</template>

<script>
export default {
  props: {
    trans: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'compact',
      required: false
    },
    focusUid: {
      // pass the user uid of the user to focus on
      type: String,
      required: false
    }
  },
  data() {
    return {
      currentSize: this.size,
    }
  },
  computed: {
    classes() { 
      return {
        'card--compact': this.currentSize == 'compact', 
        'card--wide': this.currentSize == 'wide', 
        'card--open': this.currentSize == 'open', 
        'card--full': this.currentSize == 'full',
        'card--network': this.trans.payeeUid === this.$globals.networkUid, 
        'card--payee': this.isFocusedPayee, 
        'card--recipient': this.isFocusedRecipient,
        'card--focused': this.isFocusedRecipient || this.isFocusedPayee,
      }
    },
    isFocusedPayee() {
      return this.focusUid === this.trans.payeeUid
    },
    isFocusedRecipient() {
      return this.focusUid === this.trans.recipientUid
    },
    focusAmount(){
      return this.focusUid ? this.focusFee + (this.isFocusedPayee ? - this.trans.amount : this.trans.amount) : this.trans.amount
    },
    focusFee(){
      return this.focusUid ? - this.fee / 2 : this.fee
    },
    payee() {
      return this.$store.getters.getMemberByUid(this.trans.payeeUid)
    },
    recipient() {
      return this.$store.getters.getMemberByUid(this.trans.recipientUid)
    },
    broker() {
      return this.$store.getters.getMemberByUid(this.trans.brokerUid)
    },
    fee() {
      return this.trans.amount * this.$globals.fee
    }
  },
  methods: {
    setSize(size) {
      this.currentSize = size
    }
  },
  filters: {
    formatDate(dateStr) {
      if (Date.parse(dateStr)) return Intl.DateTimeFormat("us-EN").format(new Date(dateStr))
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  @apply flex flex-col gap-3 my-2 py-2 border-t border-brand-gray-400 border-dotted
    transition cursor-pointer;
  .header {}
  .exchange {
    .people {
      @apply flex flex-row gap-1 items-center mb-4;
      .payee, .recipient {
        @apply flex-grow text-center;
      }
      // .middle:before { content: '\290B' } // down arrow
      // .middle:before { content: '\21DB' } // right arrow
    }
    .favor {
      @apply flex gap-1 justify-around items-center text-right;
      .summary { @apply hidden }
      .fee { @apply text-brand-gray-400 whitespace-nowrap; }
      .total { @apply pt-1 mt-1 border-t border-brand-gray-400; }
    }
  }
  .content {
    .summary a {
      @apply text-brand-primary font-bold hover:underline;
    }
    .title { @apply text-2xl; }
  }

  .footer {
    .broker {
      @apply flex items-center gap-2;
      .member-icon { font-size: .75em; }
    }
  }

  &.card--compact {
    @apply flex-row flex-wrap gap-1;
    .header { @apply text-xs w-full }
    main { @apply flex flex-row-reverse gap-2 items-center w-full }
    .exchange { @apply ml-auto }

    .content { @apply p-0 }

    .favor .summary { @apply block }

    .favor .payee, .favor .recipient,
    .people { @apply hidden }
    .broker {
      .member-icon { @apply hidden }
      .broker_name { @apply text-xs flex gap-2 }
    }
  }
}
</style>

<style lang="scss">

  .card.card--focused {
    .focus.favor-display .favor-display__num {
      @apply text-green-500;
    }
    .focus.favor-display .favor-display__num--neg {
      @apply text-purple-500;
    }
  }

</style>