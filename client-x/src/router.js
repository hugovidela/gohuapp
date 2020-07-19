import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Profile from './views/Profile.vue';
import Projects from './views/Projects.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Contacts from './views/Contacts.vue';
import Articulos from './views/Articulos.vue';
import Marcas from './views/Tablas/Marcas.vue';
import Rubros from './views/Tablas/Rubros.vue';
import Grupos from './views/Grupos.vue';
import Caracteristicas from './views/Tablas/Caracteristicas.vue';
import Unidades from './views/Unidades.vue';
import Tags from './views/Tablas/Tags.vue';
import ContactosTipos from './views/ContactosTipos.vue';
import MediosDePagos from './views/Tablas/MediosDePagos.vue';
import Paises from './views/Tablas/Paises.vue';
import Provincias from './views/Tablas/Provincias.vue';
import Bancos from './views/Tablas/Bancos.vue';
import Tarjetas from './views/Tablas/Tarjetas.vue';
import Postales from './views/Tablas/Postales.vue';
import Terceros from './views/Terceros.vue';
import AfipIVA from './views/Tablas/AfipIva.vue';
import AfipComprobantes from './views/Tablas/AfipComprobantes.vue';
import AfipMonedas from './views/Tablas/AfipMonedas.vue';
import AfipDocumentos from './views/Tablas/AfipDocumentos.vue';
import AfipResponsables from './views/Tablas/AfipResponsables.vue';
import AfipOperaciones from './views/Tablas/AfipOperaciones.vue';
import ImportarArticulos from './views/ImportarArticulos.vue';
import StocksInventarios from './views/Stocks/StocksInventarios.vue';
import Ventas from './views/Ventas.vue';
import Compras from './views/Compras.vue';
import StocksAjustes from './views/Stocks/StocksAjustes.vue';
import StocksTransferencias from './views/Stocks/StocksTransferencias.vue';
import TesoreriaCaja from './views/Tesoreria/TesoreriaCaja.vue';
import TesoreriaInformes from './views/Tesoreria/TesoreriaInformes.vue';
import StocksInformes from './views/Stocks/StocksInformes.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL, // base: 'http://127.0.0.1:3333',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/articulos',
      name: 'articulos',
      component: Articulos,
    },
    {
      path: '/rubros',
      name: 'rubros',
      component: Rubros,
    },
    {
      path: '/tablas/marcas',
      name: 'marcas',
      component: Marcas,
    },
    {
      path: '/grupos',
      name: 'grupos',
      component: Grupos,
    },
    {
      path: '/caracteristicas',
      name: 'caracteristicas',
      component: Caracteristicas,
    },
    {
      path: '/contactostipos',
      name: 'contactostipos',
      component: ContactosTipos,
    },
    {
      path: '/mediosdepagos',
      name: 'mediosdepagos',
      component: MediosDePagos,
    },
    {
      path: '/unidades',
      name: 'unidades',
      component: Unidades,
    },
    {
      path: '/tags',
      name: 'tags',
      component: Tags,
    },
    {
      path: '/paises',
      name: 'paises',
      component: Paises,
    },
    {
      path: '/provincias',
      name: 'provincias',
      component: Provincias,
    },
    {
      path: '/postales',
      name: 'postales',
      component: Postales,
    },
    {
      path: '/bancos',
      name: 'bancos',
      component: Bancos,
    },
    {
      path: '/tarjetas',
      name: 'tarjetas',
      component: Tarjetas,
    },
    {
      path: '/usersclientes',
      name: 'usersclientes',
      component: Terceros,
    },
    {
      path: '/usersproveedores',
      name: 'usersproveedores',
      component: Terceros,
    },
    {
      path: '/afipiva',
      name: 'afipiva',
      component: AfipIVA,
    },
    {
      path: '/afipoperaciones',
      name: 'afipoperaciones',
      component: AfipOperaciones,
    },
    {
      path: '/afipcomprobantes',
      name: 'afipcomprobantes',
      component: AfipComprobantes,
    },
    {
      path: '/afipdocumentos',
      name: 'afipdocumentos',
      component: AfipDocumentos,
    },
    {
      path: '/afipmonedas',
      name: 'afipmonedas',
      component: AfipMonedas,
    },
    {
      path: '/afipresponsables',
      name: 'afipresponsables',
      component: AfipResponsables,
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/imortararticulos',
      name: 'importararticulos',
      component: ImportarArticulos,
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: Ventas,
    },
    {
      path: '/compras',
      name: 'compras',
      component: Compras,
    },
    {
      path: '/stocksinventarios',
      name: 'stocksinventarios',
      component: StocksInventarios,
    },
    {
      path: '/stocksajustes',
      name: 'stocksajustes',
      component: StocksAjustes,
    },
    {
      path: '/stockstransferencias',
      name: 'stockstransferencias',
      component: StocksTransferencias,
    },
    {
      path: '/stocksinformes',
      name: 'stocksinformes',
      component: StocksInformes,
    },
    {
      path: '/tesoreriacaja',
      name: 'tesoreriacaja',
      component: TesoreriaCaja,
    },
    {
      path: '/tesoreriainformes',
      name: 'tesoreriainformes',
      component: TesoreriaInformes,
    },
  ],
});
