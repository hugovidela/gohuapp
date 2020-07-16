import createPersistedState from 'vuex-persistedstate';
// eslint-disable-next-line import/no-cycle
import Vue from 'vue';
import Vuex from 'vuex';
// eslint-disable-next-line import/no-cycle
import authentication from './authentication';
// eslint-disable-next-line import/no-cycle
import contacts from './contacts';
// eslint-disable-next-line import/no-cycle
import projects from './projects';
// eslint-disable-next-line import/no-cycle
import tasks from './tasks';
// eslint-disable-next-line import/no-cycle
// import marcas from './marcas';
// eslint-disable-next-line import/no-cycle
// import crudmarcas from './crudmarcas';
// eslint-disable-next-line import/no-cycle
// import browsemarcas from './browsemarcas';

Vue.use(Vuex);

export const strict = false;

export default new Vuex.Store({
  strict: true,
  state: {
    formTercerosTitulo: '',
    formTercerosPath: '',
    sucursal: '',
    sucursalFiscal: '',
    caja: '',
    baseUrl: '/api',
    snackbar: {
      visible: false,
      color: 'success',
      text: null,
      timeout: 1500,
      multiline: false,
    },
    message: {
      visible: false,
      title: null,
      body: null,
      response: null,
    },
  },
  modules: {
    authentication,
    contacts,
    projects,
    tasks,
  },
  mutations: {
    alert(state, payload) {
      state.snackbar.text = payload.text;
      state.snackbar.multiline = payload.text.length >= 50;
      // Si es mas de 50 caracteres definirlo como multilinea
//    if (payload.multiline) {
//      state.snackbar.multiline = payload.multiline;
//    }
      // Color para mensajes de error o éxito
      if (payload.color) {
        state.snackbar.color = payload.color;
      }
      // Tiempo de duración
      if (payload.timeout) {
        state.snackbar.timeout = payload.timeout;
      }
      state.snackbar.visible = true;
    },
    closeAlert(state) {
      state.snackbar.visible = false;
      state.snackbar.multiline = false;
      state.snackbar.text = null;
    },
    setTerceros(state, payload) {
      if (payload === 'C') {
        state.formTercerosTitulo = 'Clientes';
        state.formTercerosPath = 'usersclientes';
      } else if (payload === 'P') {
        state.formTercerosTitulo = 'Proveedores';
        state.formTercerosPath = 'usersproveedores';
      }
    },
    setSucursal(state, payload) {
      state.sucursal = payload;
    },
    setCaja(state, payload) {
      state.caja = payload;
    },
  },
  actions: {
  },
  getters: {
    sucursal: state => state.sucursal,
    caja: state => state.caja,
  },
  plugins: [
    createPersistedState(),
  ],
});
