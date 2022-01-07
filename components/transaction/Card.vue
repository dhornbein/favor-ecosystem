<template>
  <article class="card" :class="classes" @click="$emit('click')">

    <header class="header">
      <nuxt-link :to="`/transactions/${trans.uid}`" @click.stop><time :datetime="trans.created">{{ trans.created | formatDate }}</time></nuxt-link>
    </header>

    <main>
      <div class="exchange">
        <div class="people">
          <MemberPortrait class="payee" :member="payee" :highlight="isFocusedPayee"/>
          <div class="middle"></div>
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
            <div class="fee">
              <BaseFavor :num="focusFee">
                <span class="label text-sm">Fee</span>
              </BaseFavor>
              </div>
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
        <div class="description" :v-html="trans.description"></div>
      </div>
    </main>

    <footer class="footer">
      <div class="broker" v-if="broker">
        <MemberIcon :username="broker.username" />
        <div>
          <p class="label text-xs">Broker</p>
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
      return this.isFocusedPayee ? - this.trans.amount : this.trans.amount
    },
    focusFee(){
      return this.focusUid ? - this.fee : this.fee
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
  @apply flex flex-col gap-3 rounded-md border border-gray-300 shadow-md p-2 mb-5 last:mb-0
    transition cursor-pointer hover:border-gray-500;
  .header {}
  .exchange {
    .people {
      @apply flex flex-row gap-1 items-center mb-4;
      .payee, .recipient {
        @apply flex-grow text-center;
      }
      // .middle:before { content: '\290B' } // down arrow
      .middle:before { content: '\21DB' } // right arrow
    }
    .favor {
      @apply flex gap-1 justify-around items-center text-right;
      .summary { @apply hidden }
      .fee { @apply text-gray-400; }
      .total { @apply pt-1 mt-1 border-t border-gray-400; }
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