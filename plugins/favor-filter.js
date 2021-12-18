import Vue from 'vue'

export default () => {
  Vue.filter('favor', function (value) {
    if (isNaN(value)) return ''
    return parseFloat(value).toFixed(3)
  })
}