/* eslint-disable */
import HTTP from '../http';
import Vue from 'vue';

export default {
  namespaced: true,
  marcas: [],
  state: {
    newMarcaNombre: null,
  },
  actions: {
    saveMarca({ commit }, marca) {
      return HTTP().patch(`marcas/${marca.id}`, marca)
        .then(() => {
          commit('unsetEditMode', marca);
        });
    },
    deleteMarca({ commit }, marca) {
      return HTTP().delete(`/marcas/${marca.id}`)
        .then(() => {
          commit('removeMarca', marca);
        });
    },
    fetchMarcas({ commit }) {
      return HTTP().get('/marcas')
        .then(({ data }) => {
          commit('setMarcas', data);
        });
    },
    createMarca({ commit, state }) {
      return HTTP().post('/marcas', {
        nombre: state.newMarcaNombre,
        activo: true,
      })
        .then(({ data }) => {
          commit('appendMarca', data);
          commit('setNewMarcaNombre', null);
        });
    },
  },
  getters: {
  },
  mutations: {
    setNewMarcaNombre(state, nombre) {
      state.newMarcaNombre = nombre;
    },
    appendMarca(state, marca) {
      state.marcas.push(marca);
    },
    setMarcas(state, marcas) {
      state.marcas = marcas;
    },
    setMarcaNombre(state, { marca, nombre }) {
      marca.nombre = nombre;
    },
    setEditMode(state, marca) {
      Vue.set(marca, 'lEditMode', true);
    },
    unsetEditMode(state, marca) {
      Vue.set(marca, 'lEditMode', false);
    },
    removeMarca(state, marca) {
      state.marcas.splice(state.marcas.indexOf(marca), 1);
    },
  },
};
