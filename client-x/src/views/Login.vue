<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs6 offset-xs3>
        <h1>Login</h1>

        <v-text-field
          label="Email"
          placeholder="Email"
          :value="loginEmail"
          @input="setLoginEmail">
        </v-text-field>

        <v-text-field
          label="Password"
          placeholder="Password"
          type="password"
          autocomplete="new-password"
          :value="loginPassword"
          @input="setLoginPassword">
        </v-text-field>

        <v-alert type="error" :value="loginError">
          {{loginError}}
        </v-alert>

        <v-btn color="pink" dark @click="login">
          <v-icon class="mr-2">fingerprint</v-icon>
          Login
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('authentication', [
      'loginEmail',
      'loginPassword',
      'loginUserId',
      'loginError'],
      [
        'sucursal',
        'sucursales',
        'sucursalFiscal',
        'notificaciones',
        'caja',
        'colorSucursal',
        'empresa',
        'operario',
        'level',
      ]),
  },
  methods: {
    ...mapMutations('authentication', [
      'setLoginEmail',
      'setLoginPassword',
      'setLoginUserId'],
      [
        'setSucursal',
        'setSucursales',
        'setSucursalFiscal',
        'setNotificaciones',
        'setCaja',
        'setColorSucursal',
        'setEmpresa',
        'setOperario',
        'setLevel',
      ]),
    ...mapActions('authentication', [
      'login',
    ]),
  },
};
</script>

<style>

</style>
