export const state = () => ({
  details: {
    recipientUid: '',
    payeeUid: '',
    amount: '',
    title: '',
    description: '',
    brokerUid: '',
  },
  receipt: {}
})

const detailsDefault = {
  recipientUid: '',
  payeeUid: '',
  amount: '',
  title: '',
  description: '',
  brokerUid: '',
}

export const mutations = {
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
  },
  receipt: state => {
    return state.receipt
  }
}