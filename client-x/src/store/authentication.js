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
          debugger
          commit('setToken', data.token);
          commit('setLoginUserId', data.id);
          let sucs = []
          
          return HTTP().get('/user/'+data.id)
            .then(({data}) => {
              debugger
              sucs = data[0].sucursales;
              commit('setSucursal', data[0].sucursales[0].id)
              commit('setSucursalFiscal', data[0].sucursales[0].fiscal)

              return HTTP().get('/userscaja')
              .then(({data}) => {
                debugger
                commit('setCaja', data[0].id);
                router.push('/');
                // OJO CON LOS USUARIOS QUE SE LOGEEN SIN SER USUARIOS CLIENTES DEL SISTEMA, NO USAN CAJA
              })
            })
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
    sucursal(state) {
      return state.sucursal
    },
    sucursalFiscal(state) {
      return state.sucursalFiscal
    },
    caja(state) {
      // debugger
      return state.caja
    }
  },
  mutations: {
    setSucursal(state, valor) {
      // debugger
      state.sucursal = valor;
    },
    setSucursalFiscal(state, valor) {
      // debugger
      state.sucursalFiscal = valor;
    },
    setCaja(state, valor) {
      // debugger
      state.caja = valor;
    },
    setToken(state, token) {
      // debugger
      state.token = token;
    },
    setRegisterError(state, error) {
      // debugger
      state.registerError = error;
    },
    setRegisterUsername(state, username) {
      // debugger
      state.registerUsername = username;
    },
    setRegisterEmail(state, email) {
      // debugger
      state.registerEmail = email;
    },
    setRegisterPassword(state, password) {
      // debugger
      state.registerPassword = password;
    },
    setRegisterUserId(state, id) {
      // debugger
      state.registerUserId = id;
    },
    setLoginError(state, error) {
      // debugger
      state.loginError = error;
    },
    setLoginUsername(state, email) {
      // debugger
      state.loginEmail = email;
    },
    setLoginUserId(state, id) {
      // debugger
      state.loginUserId = id;
    },
    setLoginEmail(state, email) {
      // debugger
      state.loginEmail = email;
    },
    setLoginPassword(state, password) {
      // debugger
      state.loginPassword = password;
    },
  },
};
