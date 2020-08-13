<template>
  <v-row justify="center">
    <v-dialog v-model="visible" persistent max-height="400" max-width="500">
      <v-card>
        <v-card-title
          class="headline">{{title}}
        </v-card-title>
        <v-card-text><span v-html="body"></span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-show="buttons.indexOf('Incorporar')>=0"
            color="green"
            dark
            autofocus
            @click="handleClick('Incorporar')">
            Incorporar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Aceptar')>=0"
            color="indigo darken-2"
            dark
            autofocus
            @click="handleClick('Aceptar')">
            Aceptar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Cancelar')>=0"
            color="grey"
            dark
            @click="handleClick('Cancelar')">
            Cancelar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Ignorar')>=0"
            color="blue"
            dark
            @click="handleClick('Ignorar')">
            Ignorar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Cerrar')>=0"
            color="black"
            dark
            @click="handleClick('Cerrar')">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

export default {
  props: {
    title: String,
    body: String,
    visible: Boolean,
    buttons: Array,
  },
  data: () => ({
  }),
  methods: {
    handleClick(op) {
      this.$emit('click', op);
    },
  },
};
</script>
