<template>
  <keep-alive>
    <div class="chat-system">
      <transition name="fade" v-on:after-enter="focus" v-on:after-leave="reset">
        <aside class="chat-box" ref="chatBox" :class="chatBoxClasses" v-show="show" @focusout.self="blur" tabindex="-1">
          <div class="chat__messages">
            <div class="chat__message" :class="msg.type" v-for="(msg, idx) in messages" :key="idx" @click="dismiss(idx)">
              <div class="close" @click="remove(idx)">&times;</div>
              <h1 v-if="msg.title">{{ msg.title }}</h1>
              <div v-html="msg.body"></div>
            </div>
          </div>
        </aside>
      </transition>
      <button class="chat-btn" :class="chatBoxClasses" @click="toggleOpen">
        <div class="chat-badge" v-show="!open" v-if="unread > 0">{{ unread }}</div>
        <slot>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </slot>
      </button>
    </div>
  </keep-alive>
</template>

<script>
export default {
  async fetch(){
    this.messages = await this.$store.getters['chat/messages']
  },
  data(){
    return {
      show: false,
      open: false, // open indicates style, if not open then peek style is applied
      peek: false,
      ping: false,
      peekDelay: undefined,
      unreadCount: 0,
      messages: [],
      inputLog: [],
      isOverflown: false,
      defaultMessage: {
        title: 'Hello!',
        type: 'info',
        body: "I'm a super dumb chat bot, I mostly keep a record of things (like errors) that happen. Eventually I'll be able to do more. If you have any issues please reach out to my creator <a href='mailto:webmaster@dhornbein.com' target='_blank'>Drew Hornbein</a>",
      }
    }
  },
  created() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'chat/ADD_MESSAGE' ) {
        !mutation.payload.quiet ? this.triggerPeek() : this.triggerPing()
      }
    })
  },
  destroyed() {
    // TODO do I need to unsubscribe ?
  },
  updated() {
    this.isOverflown = this.$refs.chatBox.scrollHeight > this.$refs.chatBox.clientHeight;
    if (this.messages.length == 0) {
      this.closeChatBox()
    }
  },
  computed: {
    chatBoxClasses () {
      return { 
        'is-scroll': this.isOverflown,
        'is-open': this.open,
        'is-peek': this.peek,
        'is-ping': this.ping,
      }
    },
    unread(){
      return  this.messages.length - this.unreadCount
    },
    isOpen(){
      return this.open && this.show
    },
    isClose(){
      return !this.show
    },
    isPeeking(){
      return !this.open && this.show
    },
  },
  methods: {
    toggleOpen() {
      if (this.open) {
        this.closeChatBox()
      } else {
        if (this.messages.length == 0)
          this.$store.dispatch('chat/broadcast', this.defaultMessage );
        this.openChatBox()
      }
      this.removeTimeout()
    },
    blur(){
      if (!this.isCLose) this.closeChatBox()
    },
    focus(){
      if(this.$refs.chatBox) this.$refs.chatBox.focus()
    },
    openChatBox() {
      this.open = true
      this.show = true
      this.unreadCount = this.messages.length
    },
    closeChatBox() {
      this.show = false
      this.removeTimeout()
      this.unreadCount = this.messages.length
    },
    reset() {
      this.show = false
      this.open = false
      this.peek = false
      this.removeTimeout()
    },
    triggerPeek() {
      if (this.isOpen) return // don't peek if already open

      this.show = true
      this.peek = true
      this.peekDelay = setTimeout(() => {
        this.show = false
      }, 3000)
    },
    triggerPing() {
      this.ping = true
      setTimeout(() => {
        this.ping = false
      }, 3000)
    },
    removeTimeout() {
      clearTimeout(this.peekDelay)
    },
    dismiss(id){
      if (this.isPeeking) {
        this.show = false
        this.removeTimeout()
      }
    },
    remove(id){
      this.$store.dispatch('chat/removeMessage', id)
    }
  },
}
</script>

<style lang="scss">

.chat-box {
  @apply hidden absolute bottom-full ml-4 mb-4 right-4 min-w-[50vw] max-w-prose w-[90vw];

  &.is-peek {
    @apply block;
    .chat__message {
      @apply border-2 rounded-md drop-shadow-md;
      .close { @apply hidden }
      &:not(:last-child) {
        @apply hidden
      }
    }
  }

  &.is-open {
    @apply bg-white border border-yellow-200 shadow-lg rounded-md p-4 max-h-[60vh] overflow-y-scroll flex flex-col-reverse;
  }
  .chat__message {
    @apply border-brand-gray-400 bg-white border-l-2 p-2 rounded-r-md shadow-sm mb-2 last:mb-0 relative;
    &.info {
      @apply border-blue-500 bg-blue-100 text-blue-900
    }
    &.error {
      @apply border-red-500 bg-red-100 text-red-900
    }
    &.success {
      @apply border-green-500 bg-green-100 text-green-900
    }
    h1 { @apply mr-4 font-bold text-lg }
    .close {
      @apply cursor-pointer font-bold text-lg absolute right-0 top-0 mr-1 leading-none;
      &:hover {
        @apply text-red-500;
      }
    }
    p { @apply font-mono; }
  }

  &.fade-enter-active, &.fade-leave-active {
    @apply transition-all duration-300;
  }
  &.fade-enter, &.fade-leave-to {
    @apply opacity-0 transform translate-y-10;
  }
}

.is-ping .chat-badge {
  @apply before:animate-ping before:absolute before:inset-0 before:bg-red-500 before:rounded-full before:z-10;
}
.chat-badge {
  @apply absolute top-0 right-0 bg-red-500 text-white rounded-full z-20;
  font-size: 0.6em;
  line-height: 1rem;
  width: 1rem;
  height: 1rem;
  margin-right: 0.2rem;
  margin-top: 0.2rem;
}


.chat-btn {
  @apply cursor-pointer rounded-full bg-brand-gold p-1 w-full h-full;

  svg {
    @apply m-auto;
  }

  &.is-open,
  &:hover {
    @apply bg-blue-500;
  }
}
</style>