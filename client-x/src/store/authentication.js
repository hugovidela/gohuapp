/* eslint-disable import/no-named-as-default */
// eslint-disable-next-line import/no-named-as-default-member
import {
  mapMutations, mapState,
} from 'vuex';
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
  computed: {

    // EN REALIDAD, CUANDO SE LOGUEA UN USUARIO, DEBERIA CARGAR EN UN OBJETO
    // TODOS SUS DATOS DE UNA SOLA VEZ Y LISTO. PERO ESO CUANDO LO NECESITE.

    ...mapState(
      [
        'sucursal',
        'sucursales',
        'sucursalFiscal',
        'notificaciones',
        'caja',
        'articulosVinculados',
        'tipo',
        'colorSucursal',
        'empresa',
        'responsable',
        'cuit',
        'operario',
        'level',
        'activo',
      ]),
  },
  methods: {
    ...mapMutations(
      [
        'setSucursal',
        'setSucursales',
        'setSucursalFiscal',
        'setNotificaciones',
        'setCaja',
        'setArticulosVinculados',
        'setTipo',
        'setColorSucursal',
        'setEmpresa',
        'setResponsable',
        'setCuit',
        'setOperario',
        'setLevel',
        'setActivo',
      ]),
    
  },
  actions: {
    logout({ commit }) {
      commit('setToken', null );
      commit('setSucursal', null, { root: true })
      commit('setSucursales', null, { root: true })
      commit('setSucursalFiscal', null, { root: true })
      commit('setArticulosVinculados', null, { root: true })
      commit('setNotificaciones', null, { root: true })
      commit('setNotificacionesgohu', null, { root: true })
      commit('setEmpresa', null, { root: true })
      commit('setResponsable', null, { root: true })
      commit('setCuit', null, { root: true })
      commit('setOperario', null, { root: true })
      router.push('/login');
    },
    register({ commit, state }) {
      commit('setRegisterError', null);
      return HTTP().post('/auth/register', {
        username: state.registerUsername,
        email: state.registerEmail,
        password: state.registerPassword,
      })
        .then(({ data }) => {
          commit('setToken', data.token);
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
        uid: null,
      })

        .then(({ data }) => {
          
          commit('setToken', data.token);
          commit('setLoginUserId', data.id);
          commit('setEmpresa', null, { root: true })
          commit('setOperario', null, { root: true })
          commit('setLevel', data.level, { root: true })
          commit('setResponsable', null, { root: true })
          commit('setCuit', null, { root: true })
          commit('setActivo', data.activo, { root: true })
          commit('setNotificaciones', null, { root: true })
          commit('setNotificacionesgohu', null, { root: true })
        
          // AGREGO LOS ARTICULOS VINCULADOS AL STORE
          // NO HAGO RETURN ACA, VER SI DA PROBLEMAS
          const vinItems = []
          vinItems.push(data.id)
          debugger
          const a = HTTP().get('/articulosvinculos')
          .then(({ data }) => {
            data.forEach(element => {
              vinItems.push(element.user_id_hasta)
            })
            commit('setArticulosVinculados', vinItems, { root: true });
          })
        
          return HTTP().get('/user/'+data.id)
  
            .then(({data}) => {

              // Veo si el usuario ya definio su tercero
              if (data[0].tercero != null) {
                commit('setResponsable', data[0].tercero.responsable.id, { root: true })
                commit('setCuit', data[0].tercero.cuit, { root: true })
              }

              if (data[0].user_id) {  // ES UN USUARIO ( OPERARIO ) DE OTRO USUARIO
                commit('setOperario', data[0].username)
                
                return HTTP().get('/empresa/'+data[0].user_id) // ME LOGUEO CON EL USUARIO PRINCIPAL

                  .then(({data}) => {
                    
                    //debugger
                    commit('setToken', null);
                    let usr = data                // GUARDO LOS DATOS DEL USUARIO EMPRESA
                    let email = data[0].email
                    let uid = data[0].id
                    
                    return HTTP().post('/auth/login', {email: email, password: null, uid: uid })
                      
                      .then(({ data }) => {
                        
                        debugger
                        commit('setToken', data.token);
                        commit('setLoginUserId', data.id);
                        commit('setEmpresa', usr[0].username , { root: true })
                        commit('setLoginUserId', usr[0].id , { root: true });
                        
                        if (usr[0].sucursales.length>0) {
                          debugger
                          commit('setSucursal', usr[0].sucursales[0].id , { root: true })
                          commit('setSucursales', usr[0].sucursales , { root: true })
                          commit('setColorSucursal', usr[0].sucursales[0].color , { root: true })
                          commit('setSucursalFiscal', usr[0].sucursales[0].fiscal , { root: true })
                          debugger
                          commit('setTipo', usr[0].tipo , { root: true })
                          
                          return HTTP().get('/userscaja')
                            
                            .then(({data}) => {
                              commit('setCaja', usr[0].id, { root: true } );
                              router.push('/');
                              // OJO CON LOS USUARIOS QUE SE LOGEEN SIN SER USUARIOS CLIENTES DEL SISTEMA, NO USAN CAJA
                            })
                            .catch(() => {
                              commit('setLoginError', 'Ha ocurrido un error, verifique sus datos 1.');
                            });
        
                        } else {
                          debugger
                          commit('setSucursal', null , { root: true })
                          commit('setColorSucursal', null , { root: true })
                          commit('setSucursales', [] , { root: true })
                          commit('setSucursalFiscal', null , { root: true })
                          commit('setCaja', null), { root: true };
                          router.push('/');
                        }
                    })
                })
                .catch(() => {
                  commit('setLoginError', 'Ha ocurrido un error, verifique sus datos 2.');
                });
        
              } else {

                commit('setEmpresa', data[0].username, { root: true })
                commit('setOperario', 'Administrador', { root: true })
                if (data[0].sucursales.length>0) {

                  commit('setSucursal', data[0].sucursales[0].id, { root: true })
                  commit('setSucursales', data[0].sucursales, { root: true })
                  commit('setColorSucursal', data[0].sucursales[0].color, { root: true })
                  commit('setSucursalFiscal', data[0].sucursales[0].fiscal, { root: true })
                  commit('setTipo', data[0].tipo , { root: true })
                 
                  return HTTP().get('/userscaja')
                    .then(({data}) => {
                      debugger
                      console.log(data[0].id)
                      commit('setCaja', data[0].id, { root: true });
                      router.push('/');
                      // OJO CON LOS USUARIOS QUE SE LOGEEN SIN SER USUARIOS CLIENTES DEL SISTEMA, NO USAN CAJA
                    })

                    .catch(() => {
                      commit('setLoginError', 'Ha ocurrido un error, verifique sus datos 3.');
                    });

                } else {

                  commit('setSucursal', null, { root: true })
                  commit('setColorSucursal', null, { root: true })
                  commit('setSucursales', [], { root: true })
                  commit('setSucursalFiscal', null, { root: true })
                  commit('setCaja', null, { root: true } );
                  router.push('/');
                }
              }
            })
            .catch(() => {
              commit('setLoginError', 'Ha ocurrido un error, verifique sus datos 4.');
            });
        })
        .catch(() => {
          commit('setLoginError', 'Ha ocurrido un error, verifique sus datos 5.');
        });
    },
  },
  getters: {
    isLoggedIn(state) {
      //debugger
      return !!state.token;
    },
    userName(state) {
      return state.loginEmail;
    },
    userId(state) {
      return state.loginUserId;
    },
  },
  mutations: {
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
