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
  getMemberByUsername: state => username => {
    return state.members.find(member => member.username == username)
  },
  getMemberById: state => id => {
    return state.members.find(member => member.id == id)
  },
  getMemberByUid: state => uid => {
    return state.members.find(member => member.uuid == uid)
  },
  getMemberByUsername: state => username => {
    return state.members.find(member => member.username == username)
  },
  getMemberIdByUUID: state => id => {
    return state.members.find(member => member.uuid == id).id
  },
  getMemberUsernameByUUID: state => id => {
    return state.members.find(member => member.uuid == id).username
  },
  getRelatedMembers: state => id => {
    const transactions = state.transactions.filter(transaction => {
      return transaction.payeeId == id || transaction.recipientId == id
    })
    let weightedTransactions = transactions.reduce((acc, transaction) => {
      let memberUuid = (transaction.payeeId == id) ? transaction.recipientId : transaction.payeeId
      let index = acc.findIndex(member => member.uuid == memberUuid)
      if (index === -1) {
        acc.push({
          uuid: memberUuid,
          weight: 1,
          date: Date.now() - (new Date(transaction.created).getTime())
        })
      } else {
        acc[index].weight += 1
        acc[index].date += Date.now() - (new Date(transaction.created).getTime())
      }
      return acc
    }, [])
    
    return weightedTransactions.sort((a, b) => {
      b.weight += (b.date > a.date) ? 1 : 0
      return b.weight - a.weight
    }).map(member => state.members.find(m => m.uuid == member.uuid))
  }
}