<template>
  <v-card flat tile>

    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app v-if="isLoggedIn">
      <v-list dense>
        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
            <v-list-item-title>Ventas</v-list-item-title>
          </template>
          <v-list-item link :to="{name: 'articulos'}">
            <v-list-item-title>
              <v-icon>shopping_cart</v-icon>
              Central de Ventas
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
            <v-list-item-title>Compras</v-list-item-title>
          </template>
          <v-list-item link :to="{name: 'articulos'}">
            <v-list-item-title>
              <v-icon>shopping_cart</v-icon>
              Central de Compras
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
            <v-list-item-title>Almacén</v-list-item-title>
          </template>
          <v-list-item link :to="{name: 'articulos'}">
            <v-list-item-title>
              <v-icon>shopping_cart</v-icon>
              Articulos
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'caracteristicas'}">
            <v-list-item-title>
              <v-icon>search</v-icon>
              Caracteristicas
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'grupos'}">
            <v-list-item-title>
              <v-icon>group_work</v-icon>
              Grupos
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'marcas'}">
            <v-list-item-title>
              <v-icon>verified_user</v-icon>
              Marcas
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="pink" dark fixed>
      <v-toolbar-title class="mr-4">Sistema</v-toolbar-title>
      <v-toolbar-items>
        <v-btn class="text-capitalize" text to="/projects" v-if="isLoggedIn">
          <v-icon class="mr-2">playlist_add_check</v-icon>
          Projects
        </v-btn>
        <v-btn class="text-capitalize" text to="/contacts" v-if="isLoggedIn">
          <v-icon class="mr-2">contact_phone</v-icon>
          Contacts
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down"> 
        <v-btn class="text-capitalize" text to="/register" v-if="!isLoggedIn">
          <v-icon class="mr-2">account_box</v-icon>
          Registrarse
        </v-btn>
        <v-btn class="text-capitalize" text to="/login" v-if="!isLoggedIn">
          <v-icon class="mr-2">fingerprint</v-icon>
          Ingresar
        </v-btn>
        <v-btn class="text-capitalize" text v-if="isLoggedIn" @click="logout">
          <v-icon class="mr-2">exit_to_app</v-icon>
          Salir
        </v-btn>
      </v-toolbar-items>
      <!-- <v-btn icon>
        <v-icon>delete</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>exit_to_app</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>fingerprint</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>account_box</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>list</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-exit</v-icon>
      </v-btn> -->
    </v-toolbar>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters('authentication', [
      'isLoggedIn',
    ]),
  },
  methods: {
    ...mapActions('authentication', [
      'logout',
    ]),
  },
};
</script>

<style>

</style>
