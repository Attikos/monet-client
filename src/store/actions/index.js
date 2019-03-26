import { URL_API, API_PATH } from '@/utils/config';
import axios from 'axios'

window.axios = axios;

axios.defaults.headers = {
    // 'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With' : 'XMLHttpRequest',
    // 'crossDomain'      : true,
    // 'credentials' : 'same-origin',
    // 'Content-Type'     : 'application/x-www-form-urlencoded',`
}

axios.defaults.baseURL = URL_API
axios.defaults.withCredentials = true


export default {
    createUser({ commit }, user) {
        return axios.post('register', user );
    },

    authenticate({ commit, dispatch }, user) {
        return new Promise( async (resolve, reject) => {
            try {
                let { data } = await axios.post('signin', user );

                commit('SET_AUTH_STATE', true);
                commit('SET_USER', { email : data.email });

                await dispatch('fetchData');

                resolve();
            }
            catch( err ) {
                console.log('action', err);

                if ( err.response && err.response.status === 401 ) {
                    commit('SET_AUTH_STATE', false);
                }

                reject( err );
            };

        });
    },

    logout({ commit, dispatch }) {
        return new Promise( async (resolve, reject) => {

            try {
                await axios.post('logout');

                commit('SET_AUTH_STATE', false);
                commit('LOGOUT');

                resolve();

            }
            catch( err ) { reject( err ) };

        });
    },

    // createTransaction({ commit }, transaction) {
    //     commit('CREATE_TRANSACTION', transaction );

    //     return axios.post('create_transaction', transaction );
    // },

    createTransaction: async ( { commit }, transaction ) => {
        let { data } = await axios.post('create_transaction', transaction);

        commit( 'CREATE_TRANSACTION', data );
    },

    fetchData: async ( { commit, state } ) => {
        let { data } = await axios.post('transaction_list');

        commit( 'FETCH_DATA', data );
    },
};
