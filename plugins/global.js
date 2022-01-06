import Vue from 'vue'

let globals = {
  fee: 0.02,
  symbol: 'f',
  networkUsername: 'FSN',
  networkUid: '942b2515-3f16-42d8-869f-1e3af4d51117'
}

export default ({ app }, inject) => {
  Vue.filter('favor', function (value) {
    if (isNaN(value)) return ''
    return parseFloat(value).toFixed(3)
  })
  inject('globals', Vue.observable(globals))
}