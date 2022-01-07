<template>
  <div class="chat-system">
    <transition name="fade">
      <aside class="chat-box" ref="chatBox" :class="chatBoxClasses" v-show="show">
        <div class="chat__messages">
          <div class="chat__message" :class="msg.type" v-for="(msg, idx) in messages" :key="idx" @click="dismiss(idx)">
            <div class="close" @click="remove(idx)">&times;</div>
            <h1 v-if="msg.title">{{ msg.title }}</h1>
            <div v-html="msg.body"></div>
          </div>
        </div>
      </aside>
    </transition>
    <button class="chat-btn rounded-full bg-yellow-500 px-4 w-full h-full" @click="toggleOpen">
      <slot>Help</slot>
    </button>
  </div>
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
      messages: [],
      inputLog: [],
      isOverflown: false,
      peekDelay: undefined,
      defaultMessage: {
        title: 'Hello!',
        type: 'info',
        body: "I'm a super dumb chat bot, I mostly keep a record of things (like errors) that happen. Eventually I'll be able to do more. If you have any issues please reach out to my creator <a href='mailto:webmaster@dhornbein.com' target='_blank'>Drew Hornbein</a>",
      }
    }
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
        'is-peek': !this.open,
      }
    },
    messageLength(){
      return this.messages.length
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
  watch: {
    messageLength(newVal, oldVal){
      if (newVal > oldVal) {
        this.peek()
      }
    }
  },
  methods: {
    toggleOpen() {
      if (this.isOpen) {
        this.closeChatBox()
      } else {
        if (this.messages.length == 0)
          this.$store.dispatch('chat/broadcast', this.defaultMessage );
        this.openChatBox()
      }
      this.removeTimeout()
    },
    openChatBox() {
      this.open = true
      this.show = true
    },
    closeChatBox() {
      this.show = false
      this.removeTimeout()
    },
    peek() {
      if (this.isOpen) return // don't peek if already open

      this.show = true
      this.open = false
      this.peekDelay = setTimeout(() => {
        this.show = false
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
  @apply hidden absolute bottom-full ml-4 mb-4 right-4 min-w-[50vw] max-w-prose;

  &.is-peek {
    @apply block w-full;
    .chat__message {
      @apply border-2 rounded-md drop-shadow-md;
      .close { @apply hidden }
      &:not(:last-child) {
        @apply hidden
      }
    }
  }

  &.is-open {
    @apply bg-white border border-yellow-400 shadow-lg rounded-md p-4 max-h-[60vh] overflow-y-scroll flex flex-col-reverse;
  }
  .chat__message {
    @apply border-gray-500 bg-white border-l-2 p-2 rounded-r-md shadow-sm mb-2 last:mb-0 relative;
    &.info {
      @apply border-blue-500 bg-blue-100 text-blue-900
    }
    &.error {
      @apply border-red-500 bg-red-100 text-red-900
    }
    &.success {
      @apply border-green-500 bg-green-100 text-green-900
    }
    h1 { @apply mr-4 }
    .close {
      @apply cursor-pointer font-bold text-lg absolute right-0 top-0 mr-1 leading-none;
      &:hover {
        @apply text-red-500;
      }
    }
    p { @apply font-mono; }
  }



  &.fade-enter-active, &.fade-leave-active {
    @apply block transition-all duration-300;
  }
  &.fade-enter, &.fade-leave-to {
    @apply opacity-0 transform translate-y-10;
  }
}
</style>