import en from 'vuetify/src/locale/en.ts';
import es from 'vuetify/src/locale/es.ts';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  },
  lang: {
    locales: { en, es },
    current: 'es',
  },
});
