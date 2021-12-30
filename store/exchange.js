export const state = () => ({
  recipient: '',
  payee: '',
  details: {
    amount: '',
    title: '',
    description: '',
    brokerId: '',
  }
})

const detailsDefault = {
  amount: '',
  title: '',
  description: '',
  brokerId: '',
}

export const mutations = {
  SET_PAYEE(state, target) {
    state.target = target
  },
  SET_RECIPIENT(state, target) {
    state.target = target
  },
  SET_DETAILS(state, details) {
    state.details = {
      ...state.details,
      ...details
    }
  },
}

export const actions = {
  setPayee({ commit }, target) {
    commit('SET_PAYEE', target)
  },
  setRecipient({ commit }, target) {
    commit('SET_RECIPIENT', target)
  },
  clearTargets({ commit }) {
    commit('SET_PAYEE', '')
    commit('SET_RECIPIENT', '')
  },
  setDetails({ commit }, details) {
    commit('SET_DETAILS', details)
  },
  clearDetails({ commit }) {
    commit('SET_DETAILS', detailsDefault)
  },
  reset({ commit }) {
    commit('SET_PAYEE', '')
    commit('SET_RECIPIENT', '')
    commit('SET_DETAILS', detailsDefault)
  }
}

export const getters = {
  details: state => {
    return state.details
  }
}