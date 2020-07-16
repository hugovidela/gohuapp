<template>
  <v-app>
    <Toolbar/>
    <div id="app">
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import Toolbar from '@/components/Toolbar.vue';

export default {
  components: {
    Toolbar,
  },
};
</script>

<!--
<template>
  <v-app id="inspire">
    <Toolbar/>
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Sistema</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon :to="{name: 'Register'}">
        <v-icon>fingerprint</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>assignment_ind</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>
-->

<script>
  import Toolbar from '@/components/Toolbar.vue';
  export default {
    components: {
      Toolbar,
    },
    props: {
      source: String,
    },
    data: () => ({
      dialog: false,
      drawer: null,
      items: [],
    }),
    methods: {
      click(cual) {
//      return alert('hicieron click en'+cual)
      }
    },
  }
</script>





















<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
