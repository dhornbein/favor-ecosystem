export const state = () => ({
  members: [],
  transactions: [],
  loaded: {
    members: false,
    transactions: false
  }
})

export const mutations = {
  SET_MEMBERS(state, members) {
    state.members = members
    state.loaded.members = true
  },
  SET_TRANSACTIONS(state, transactions) {
    state.transactions = transactions
    state.loaded.transactions = true
  },
}

export const actions = {
  async getAllMembersOnce({ dispatch, state }) {
    if (!state.loaded.members) {
      await dispatch('getAllMembers')
    }
  },
  async getAllMembers({ commit }) {
    let { data: members } = await this.$http.$get('/api/members')
    commit('SET_MEMBERS', members)
  },
  async getAllTransactionsOnce({ dispatch, state }) {
    if (!state.loaded.transactions) {
      await dispatch('getAllTransactions')
    }
  },
  async getAllTransactions({ commit }) {
    await this.$http.$get('/api/transactions').then(({ data: transactions }) => {
      commit('SET_TRANSACTIONS', transactions)
    })
  }
}

export const getters = {
  getTransactionsByMemberUUID: state => id => {
    return state.transactions.filter(transaction => {
      return transaction.payeeId == id || transaction.recipientId == id
    })
  },
  getMemberById: state => id => {
    return state.members.find(member => member.id == id)
  },
  getMemberIdByUUID: state => id => {
    return state.members.find(member => member.uuid == id).id
  },
  getMemberUsernameByUUID: state => id => {
    return state.members.find(member => member.uuid == id).username
  }
}