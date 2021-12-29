export const state = () => ({
  target: false,
  details: {
    recipientId: '',
    amount: '',
    title: '',
    description: '',
    brokerId: '',
    payeeId: '',
  }
})

export const mutations = {
  SET_TARGET(state, target) {
    state.target = target
  },
  SET_DETAILS(state, details) {
    state.search.details = {
      recipientId: details.recipientId,
      amount: details.amount,
      title: details.title,
      description: details.description,
      brokerId: details.brokerId,
      payeeId: details.payeeId,
    }
  },
}

export const actions = {
  setTarget({ commit }, target) {
    commit('SET_TARGET', target)
  },
  setDetails({ commit }, details) {
    commit('SET_DETAILS', details)
  },
}

export const getters = {
  details: state => {
    return state.details
  }
}