import Vue from 'vue'

let globals = {
  fee: 0.02,
  symbol: 'f',
  networkUsername: 'FSN'
}

export default ({ app }, inject) => {
  Vue.filter('favor', function (value) {
    if (isNaN(value)) return ''
    return parseFloat(value).toFixed(3)
  })
  inject('globals', Vue.observable(globals))
}