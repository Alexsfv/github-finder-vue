export default {
    namespaced: true,
    state: {
        value: '',
    },
    mutations: {
        setValue(state, payload) {
            state.value = payload
        }
    },
    actions: {
        setValue({commit}, payload) {
            commit('setValue', payload)
        }
    },
    getters: {
        getValue(state) {
            return state.value
        }
    }
}