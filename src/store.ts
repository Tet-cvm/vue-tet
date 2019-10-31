import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user_icon: '',
        user_name: '',
    },
    mutations: {
        set_user_icon(state, icon){
            state.user_icon = icon;
        },
        set_user_name(state, name) {
            state.user_name = name;
        }

    },
    actions: {

    }
})
