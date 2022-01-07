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
  ADD_TRANSACTION(state, transaction) {
    state.transactions.push(transaction)
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
  },
  addTransaction({ commit }, transaction) {
    commit('ADD_TRANSACTION', transaction)
  }
}

export const getters = {
  getTransactionsByUid: state => uid => {
    return state.transactions.find(transaction => {
      return transaction.uid == uid
    })
  },
  getTransactionsByMemberUid: state => uid => {
    return state.transactions.filter(transaction => {
      return transaction.payeeUid == uid || transaction.recipientUid == uid
    })
  },
  getMemberById: state => id => {
    return state.members.find(member => member.id == id)
  },
  getMemberByUid: state => uid => {
    return state.members.find(member => member.uid == uid)
  },
  getMemberByUsername: state => username => {
    return state.members.find(member => member.username == username)
  },
  getRelatedMembers: state => uid => {
    const transactions = state.transactions.filter(transaction => {
      return transaction.payeeUid == uid || transaction.recipientUid == uid
    })
    let weightedTransactions = transactions.reduce((acc, transaction) => {
      let memberUid = (transaction.payeeUid == uid) ? transaction.recipientUid : transaction.payeeUid
      let index = acc.findIndex(member => member.uid == memberUid)
      let datetime = Date.now() - (new Date(transaction.created).getTime())
      if (index === -1) {
        acc.push({
          uid: memberUid,
          weight: 1,
          date: datetime
        })
      } else {
        acc[index].weight += 1
        acc[index].date += datetime
      }
      return acc
    }, [])
    
    return weightedTransactions.sort((a, b) => {
      b.weight += (b.date > a.date) ? 1 : 0
      return b.weight - a.weight
    }).map(member => state.members.find(m => m.uid == member.uid))
  }
}