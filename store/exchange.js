export const state = () => ({
  details: {
    recipientId: '',
    payeeId: '',
    amount: '',
    title: '',
    description: '',
    brokerId: '',
  },
  receipt: {}
})

const detailsDefault = {
  recipientId: '',
  payeeId: '',
  amount: '',
  title: '',
  description: '',
  brokerId: '',
}

export const mutations = {
  SET_PAYEE(state, target) {
    state.details.payeeId = target
  },
  SET_RECIPIENT(state, target) {
    state.details.recipientId = target
  },
  SET_DETAILS(state, details) {
    state.details = {
      ...state.details,
      ...details
    }
  },
  SET_RECEIPT(state, payload) {
    state.receipt = payload
  },
}

export const actions = {
  clearTargets({ commit }) {
    commit('SET_PAYEE', '')
    commit('SET_RECIPIENT', '')
  },
  setDetails({ commit }, details) {
    commit('SET_DETAILS', details)
  },
  reset({ commit }) {
    commit('SET_DETAILS', detailsDefault)
  },
  receipt({ commit }, payload) {
    commit('SET_RECEIPT', payload)
  }
}

export const getters = {
  details: state => {
    return state.details
  }
}