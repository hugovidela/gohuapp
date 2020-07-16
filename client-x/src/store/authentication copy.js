/* eslint-disable import/no-named-as-default */
// eslint-disable-next-line import/no-named-as-default-member
import router from '../router';
// eslint-disable-next-line import/no-cycle
import HTTP from '../http';

export default {
  /* eslint-disable */
  namespaced: true,
  state: {
    registerUsername: 'example',
    registerEmail: 'example@gmail.com',
    registerPassword: '123456',
    registerError: null,
    loginEmail: '',
    loginPassword: '',
    loginUserId: '',
    loginError: null,
    token: null,
  },
  actions: {
    logout({ commit }) {
      commit('setToken', null);
      router.push('/login');
    },
    register({ commit, state }) {
      commit('setRegisterError', null);
      console.log('a');
      return HTTP().post('/auth/register', {
        username: state.registerUsername,
        email: state.registerEmail,
        password: state.registerPassword,
      })
        .then(({ data }) => {
          commit('setToken', data.token);
          // router.push({ name: 'Login' });
          router.push('/Login');
        })
        .catch((e) => {
          commit('setRegisterError', 'Ha ocurrido un error al crear la cuenta.');
        });
    },
    login({ commit, state }) {
      commit('setLoginError', null);
      commit('setRegisterError', null);

      return HTTP().post('/auth/login', {
        email: state.loginEmail,
        password: state.loginPassword,
      })
        .then(({ data }) => {
//        debugger
          commit('setToken', data.token);
          commit('setLoginUserId', data.id);
          router.push('/');
//        router.go('/');
          //let suc = data[0].sucursales[0].id
          //commit('setSucursal', data[0].sucursales[0].id)

          /*
          debugger
          let sucs = []
          return HTTP().get('/user/'+data.id)
            .then(({data}) => {
              debugger
              sucs = data[0].sucursales;
              commit('setSucursal', data[0].sucursales[0].id);
              router.push('/');
            })
          */
            
        })
        .catch(() => {
          commit('setLoginError', 'Ha ocurrido un error, verifique sus datos.');
        });
    },
  },
  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
    userName(state) {
      return state.loginEmail;
    },
    userId(state) {
      return state.loginUserId;
    },
    /*
    sucursalId(state) {
      return state.sucursal
    }
    */
  },
  mutations: {
    /*
    setSucursal(state, valor) {
      debugger
      state.sucursal = valor;
    },
    */
    setToken(state, token) {
      state.token = token;
    },
    setRegisterError(state, error) {
      state.registerError = error;
    },
    setRegisterUsername(state, username) {
      state.registerUsername = username;
    },
    setRegisterEmail(state, email) {
      state.registerEmail = email;
    },
    setRegisterPassword(state, password) {
      state.registerPassword = password;
    },
    setRegisterUserId(state, id) {
      state.registerUserId = id;
    },
    setLoginError(state, error) {
      state.loginError = error;
    },
    setLoginUsername(state, email) {
      state.loginEmail = email;
    },
    setLoginUserId(state, id) {
      state.loginUserId = id;
    },
    setLoginEmail(state, email) {
      state.loginEmail = email;
    },
    setLoginPassword(state, password) {
      state.loginPassword = password;
    },
  },
};
