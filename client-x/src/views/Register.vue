<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs6 offset-xs3>
        <h1>Register</h1>
         <v-form
            ref="form" v-model="valid" lazy-validation>
            <v-text-field
              :rules="usernameRules"
              label="Username"
              :value="registerUsername"
              @input="setRegisterUsername"
              clearable
              counter
              maxlength="20"
              required>
            </v-text-field>
            <v-text-field
              :rules="emailRules"
              label="E-mail"
              required
              clearable
              counter
              :value="registerEmail"
              @input="setRegisterEmail">
            </v-text-field>
            <v-text-field
              :append-icon="show ? 'visibility' : 'visibility_off'"
              :rules="[passRules.required, passRules.min]"
              :type="show ? 'text' : 'password'"
              label="Password"
              hint="At least 8 characters"
              counter
              required
              clearable
              @click:append="show = !show"
              :value="registerPassword"
              @input="setRegisterPassword">
            </v-text-field>

            <v-alert type="error" :value="registerError">
              {{registerError}}
            </v-alert>

            <v-btn
              color="pink"
              dark
              @click="register"
              :disabled="!valid">
              <v-icon class="mr-2">account_circle</v-icon>
              Register
            </v-btn>
        </v-form>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  /* eslint-disable */
  data: () => ({
    valid: true,
    show: false,
    passRules: {
      required: value => !!value || 'Requerido',
      min: v => v.length >= 8 || 'Míninmo 8 caracters',
    },
    usernameRules: [
      v => !!v || 'El nopmbre es requerido',
      v => (v && v.length <= 10) || 'Hasta 10 caraceres',
    ],
    emailRules: [
      v => !!v || 'E-mail es requerido',
      v => /.+@.+\..+/.test(v) || 'E-mail debe ser válido',
    ],
  }),

  computed: {
    ...mapState('authentication', [
      'registerUsername',
      'registerEmail',
      'registerPassword',
      'registerUserId',
      'registerError',
    ]),
  },

  methods: {
    ...mapMutations('authentication', [
      'setRegisterUsername',
      'setRegisterEmail',
      'setRegisterPassword',
      'setRegisterUserId',
    ]),
    ...mapActions('authentication', [
      'register',
    ]),
    // validate() {
    //   if (this.$refs.form.validate()) {
    //     this.snackbar = true;
    //     /* eslint-disable */
    //     alert('pk');
    //   }
    // },
  },
};
</script>

<style>

</style>
