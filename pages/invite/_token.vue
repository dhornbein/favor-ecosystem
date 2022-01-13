<template>
  <main class="flex flex-col justify-center">
    <h1 class="text-2xl my-4">Share your invite</h1>

    <BaseInput label="URL" type="text" readonly :value="tokenUrl" @focus="selectAll" />

    <!-- <div class="flex gap-2 justify-center my-2">
      <button class="btn " v-if="showCopy" @click="copyUrl">Copy</button>
      <button class="btn " v-if="showShare" @click="triggerShare">Share</button>
    </div> -->

    <!-- TODO share buttons -->
    <div class="p-3 flex-shrink text-center mb-6 max-h-[50vh]">
      <img 
        :src="tokenImgUrl"
        class="w-full h-auto max-w-[50vh] mx-auto"
        v-if="tokenImgUrl"
        alt="QR Code of the token"
      >
      <div class="w-full max-w-[50vh] max-h-full mx-auto aspect-square flex justify-center items-center text-brand-primary h-[80vw] border border-brand-primary" v-else>Loading...</div>
    </div>
  </main>
</template>

<script>
import QRCode from 'qrcode'

export default {
  layout: 'main',
  head: {
    title: 'Share Your Invite'
  },
  created() {
    const qrOptions = {
      color: {
        dark: '#601d46',
        light: '#fff'
      }
    }
    QRCode.toDataURL(this.tokenUrl, qrOptions)
    .then(url => {
      this.tokenImgUrl = url
    })
    .catch(err => {
      console.error(err)
    })
  },
  data() {
    return {
      tokenImgUrl: '',
    }
  },
  computed: {
    tokenUrl() {
      return `https://app.favor.solutions/join/${this.$route.params.token}`;
    },
    // showCopy() {
    //   return navigator && !!navigator.clipboard
    // },
    // showShare() {
    //   return !!navigator.share
    // },
  },
  methods: {
    selectAll(e) {
      e.target.select()
    },
    // copyUrl() {
    //   navigator.clipboard.writeText(this.tokenUrl).then(function() {
    //     this.$store.dispatch('chat/broadcast', {
    //       type: 'success',
    //       body: 'Copied to clipboard'
    //     })
    //   }, function(err) {
    //     this.$store.dispatch('chat/broadcast', {
    //       type: 'error',
    //       body: 'Failed to copy to clipboard'
    //     })
    //   });
    // },
    // triggerShare() {
    //   if (navigator.share) {
    //     navigator.share({
    //       title: 'Join Favor Solutions Network',
    //       url: this.tokenUrl
    //     }).then(() => {
    //       console.log('Thanks for sharing!');
    //     })
    //     .catch(console.error);
    //   }
    // }
  },
}
</script>