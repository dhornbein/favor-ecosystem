<template>
  <article class="card" :class="classes">

    <header class="header">
      <time :datetime="trans.created">{{ trans.created | formatDate }}</time>
    </header>

    <main>
      <div class="exchange">
        <div class="people">
          <MemberPortrait class="payee" :member="payee"/>
          <div class="middle"></div>
          <MemberPortrait class="recipient" :member="recipient"/>
        </div>
        <div class="favor">
          <div class="payee">
            <div class="amount font-bold text-purple-500"><BaseFavor :num="-trans.amount" /></div>
            <div class="fee"><BaseFavor :num="-fee / 2"><span class="text-sm">fee</span></BaseFavor></div>
            <div class="total text-purple-500"><BaseFavor :num="(-fee / 2) + -trans.amount" /></div>
          </div>
          <div class="summary">
            <div class="amount text-xl"><BaseFavor :num="trans.amount" /></div>
            <div class="fee">
              <BaseFavor :num="fee">
                <span class="label text-sm">Fee</span>
              </BaseFavor>
              </div>
          </div>
          <div class="recipient">
            <div class="amount font-bold"><BaseFavor :num="trans.amount" plus /></div>
            <div class="fee"><BaseFavor :num="-fee / 2"><span class="text-sm">fee</span></BaseFavor></div>
            <div class="total"><BaseFavor :num="(-fee / 2) + trans.amount" /></div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="summary">
          <nuxt-link :to="`/members/${payee.username}`" class="payee">{{ payee.firstName }}</nuxt-link> paid <nuxt-link :to="`/members/${recipient.username}`" class="recipient">{{ recipient.firstName }}</nuxt-link> for:
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
      // pass the user uuid of the user to focus on
      type: String,
      required: false
    }
  },
  data() {
    return {
      slim: this.isSlim,
    }
  },
  computed: {
    classes() { 
      return {
        'card--compact': this.size == 'compact', 
        'card--wide': this.size == 'wide', 
        'card--open': this.size == 'open', 
        'card--full': this.size == 'full',
        'card--network': this.trans.payeeId === this.$globals.networkUUID, 
        'card--payee': this.isFocusedPayee, 
        'card--recipient': this.isFocusedRecipient 
      }
    },
    isFocusedPayee() {
      return this.focusUid === this.trans.payeeId
    },
    isFocusedRecipient() {
      return this.focusUid === this.trans.recipientId
    },
    payee() {
      return this.$store.getters.getMemberByUid(this.trans.payeeId)
    },
    recipient() {
      return this.$store.getters.getMemberByUid(this.trans.recipientId)
    },
    broker() {
      return this.$store.getters.getMemberByUid(this.trans.brokerId)
    },
    fee() {
      return this.trans.amount * this.$globals.fee
    }
  },
  methods: {
    toggleSlim() {
      this.slim = !this.slim
      this.classes['trans-card--slim'] = this.slim
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