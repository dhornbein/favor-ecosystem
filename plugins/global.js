import Vue from 'vue'

/**
 * Global variables for the application
 */
let globals = {
  fee: 0.02, // Network fee
  symbol: 'f', // Currency symbol
  networkUsername: 'FSN', // special username for the network
  networkUid: '942b2515-3f16-42d8-869f-1e3af4d51117' // special uid for the network
}

export default ({ app }, inject) => {

  /**
   * 'favor' filter that takes a number and returns a float with 3 decimals
   * @param {number} number
   * @return {string} formatted number 123.000
   */
  Vue.filter('favor', function (value) {
    if (isNaN(value)) return ''
    return parseFloat(value).toFixed(3)
  })

  inject('globals', Vue.observable(globals))
}