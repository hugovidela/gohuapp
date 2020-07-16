<template>
  <v-layout align-start>
    <v-flex>
      <v-card>
        <v-card-title  class="cyan white--text">
          <span class="headline">Importar Artículos</span>
        </v-card-title>
        <v-form ref="form">
          <v-card-text>
            <v-container>
              <v-row>

                <v-col cols="1" sm="1" md="1">
                  <v-btn v-show="!verCargarFoto"
                    class="mr-2"
                    fab
                    x-small
                    color="cyan accent-3"
                    @click="cargarFotos(true)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="8" sm="8" md="8">
                  <v-file-input
                    v-show="verCargarFoto"
                    filled
                    dense
                    prepend-icon="mdi-camera"
                    v-model="nuevaFoto">
                    <v-icon>mdi-plus</v-icon>
                  </v-file-input>
                </v-col>
                <v-col cols="3" sm="3" md="3">
                  <v-btn v-show="verCargarFoto"
                    color="blue-grey"
                    class="ma-2 white--text"
                    x-small
                    fab
                    @click="cargarFotos(false)">
                    <v-icon dense dark>mdi-window-close</v-icon>
                  </v-btn>
                  <v-btn v-show="verCargarFoto"
                    color="teal accent-4"
                    class="ma-2 white--text"
                    x-small
                    fab>
                    <v-icon dense dark>mdi-content-save</v-icon>
                  </v-btn>
                </v-col>

                <div id="wrapper">
                  <input type="file" id="input-excel" />
                </div>
                {{ dataXls }}

                <input type="file" @change="openFile" multiple>
                <input type="file" @change="previewFiles" multiple>

              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

  /*
  debugger;
  document.getElementById("#input-excel").addEventListener("click", function() {
    var reader = new FileReader();
    reader.addEventListener('load',function () {
      document.getElementById('file').innerText = this.result;
    });
    reader.readAsText(document.querySelector('input').files[0]);
  });
  */

/* eslint-disable */
import { mapGetters, mapMutations } from 'vuex';
import router from '../router';
import XLSX from 'xlsx'

export default {
  data: () => ({
    items: [],
    fotos: [],
    nuevaFoto: '',
    xls: '',
    dataXls: 'Una masa',
    verCargarFoto: false,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn']),
    ...mapMutations(['alert','closeAlert']),
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    cargarFotos(sino) {
      this.verCargarFoto = sino;
    },
    previewFiles(event) {
      debugger
      console.log(event.target.files);
    },
    openFile(event) {

      debugger
      const fs = require('fs');

      const xlxs = require('xlsx');
      debugger
      const {readFile} = require('fs').promises;
      (async function (params) {
          debugger
          // Getting data
          const excelBuffer = await readFile('./SALDOS.xlsx');
          debugger
          // parsing data
          const result = xlxs.read(excelBuffer,{ type:'buffer', cellHTML:false, });
          console.log('TCL: result', result);
      })();

    },
  }

};

</script>
