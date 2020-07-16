<template>
  <v-card flat tile>
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
  data: () => ({
      drawer: null,
    }),
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
