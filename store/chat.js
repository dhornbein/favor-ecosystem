export const state = () => ({
  messages: []
})

export const mutations = {
  ADD_MESSAGE(state, message) {
    state.messages.push(message)
  },
  REMOVE_MESSAGE(state, index) {
    state.messages.splice(index, 1)
  },
  REMOVE_ALL_MESSAGE(state,) {
    state.messages = []
  },
}

export const actions = {
  clearMessages({ commit }) {
    commit('REMOVE_ALL_MESSAGE')
  },
  removeMessage({ commit }, index) {
    commit('REMOVE_MESSAGE', index)
  },
  broadcast({ commit }, payload) {
    if (!payload.body && !payload.title)
      return;
    
    commit('ADD_MESSAGE', payload)
  },
  broadcastError({ commit }, payload) {
    if (!payload.body && !payload.title)
      return;
    payload.type = 'error'
    commit('ADD_MESSAGE', payload)
  },
  broadcastSuccess({ commit }, payload) {
    if (!payload.body && !payload.title)
      return;
    payload.type = 'success'
    commit('ADD_MESSAGE', payload)
  },
  broadcastResponse({ commit, dispatch }, { response, title, type, message, ...rest } ) {
    if (response.status >= 200 && response.status < 300 ) {
      commit('ADD_MESSAGE', {
        title: title ? title : 'Success!',
        type: type ? type : 'success',
        // TODO maybe the success message should always state what successfully happened?
        // success message might be a string or a simple boolean
        body: message ? message : response.data.success !== true ? response.data.success : null,
        ...rest
      })
    } else if (response.status >= 300){
      dispatch('broadcastErrorResponse', { response, title, type, message })
    }
  },
  broadcastErrorResponse({ commit, dispatch }, { response, title, type, message, ...rest }) {
    if (!response) {
      dispatch('broadcastError', {
        title: title ? title : 'Error!',
        type: type ? type : 'error',
        body: message ? message : 'An unknown error has occurred.',
        ...rest
      })
      return
    }
    let payload = {
      title: title ? title : `${response.status} Error: ${response.statusText}`,
      type: type ? type : 'error',
    }

    // api validation errors will always be 422
    if (response.status === 422 && response.data.error.length > 0) {
      message = message ? `${message}<br>` : ''
      message += `${response.data.error.length} validation errors:`
      
      // TODO can we hit the vee validator here to highlight errors?
      payload.body = response.data.error.reduce((acc, error) => {
        return `${acc}<br> - ${error.msg} (${error.param})`
      }, message)
      
    } else {
      payload.body = response.data
    }

    commit('ADD_MESSAGE', {
      ...rest,
      ...payload
    })
  }
}

export const getters = {
  messages: state => {
    return state.messages
  },
}