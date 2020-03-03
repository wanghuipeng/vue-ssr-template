import api from 'src/api'

const state = {
    userProfile: {}
}

const getters = {
    getUserProfile: state => state.userProfile
}

const mutations = {
    USER_PROFILE: (state, userProfile) => {
        state.userProfile = userProfile
    }
}

const actions = {
    getUserProfile({ state, commit }) {
        return api.get('/code/dict.js').then((response) => {
            console.log(111, response)
            commit('USER_PROFILE', response)
        }).catch((error) => {
            console.log(error)
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}