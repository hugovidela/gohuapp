<template>
  <v-layout align-start>
    <v-flex>

      <!-- Modal del diálogo para Alta y Edicion -->
      <v-dialog v-model="dialog" max-width="800px" :fullscreen="true">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <!-- para el EDICION-->
          <v-card-title  class="cyan white--text">
            <span class="headline">{{ formTitle }}</span>
            <v-spacer></v-spacer>
            <span class="text--right">
              <v-btn
                color="blue-grey" class="ma-2 white--text"
                @click="cancelar">
                Cancelar
              </v-btn>
              <v-btn
                color="teal accent-4" class="ma-2 white--text" @click="guardar">Guardar
              </v-btn>
            </span>
          </v-card-title>
          <v-form ref="form">
            <v-card-text>
              <v-container>

                <v-tabs background-color="white" color="cyan">
                  <v-tab href="#general">
                    Datos Generales
                  </v-tab>
                  <v-tab-item value="general">

                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          ref="nombre"
                          autofocus
                          v-model="editado.username"
                          label="Razón Social"
                          required
                          :rules="usernameRules"
                          :counter="80"
                          :maxlength="80">
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          v-model="editado.email"
                          label="Correo Electrónico"
                          required
                          :rules="emailRules"
                          :counter="80"
                          :maxlength="80">
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row align="center">
                      <v-col cols="12" sm="12">
                        <v-select
                          v-model="rubValue"
                          :items="rubItems"
                          chips
                          label="Rubros a los cuales pertenece el usuario"
                          multiple
                          outlined
                        ></v-select>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="6" sx="6" mx="6">
                        <v-autocomplete
                          class="body-2"
                          v-model="editado.tercero_id"
                          :items="itemsTerceros"
                          :loading="isLoadingTerceros"
                          :search-input.sync="searchTerceros"
                          item-text="nombre"
                          item-value="id"
                          label="Tercero al cual esta ligado el usuario"
                          placeholder="Escriba para buscar"
                          prepend-icon="mdi-database-search">
                        </v-autocomplete>
                      </v-col>
                    </v-row>

                  </v-tab-item>

                  <v-tab href="#sucursales">
                    Sucursales
                  </v-tab>
                  <v-tab-item value="sucursales">
                    <v-data-table
                      :headers="headersSuc"
                      :items="suc"
                      dense
                      class="elevation-3">
                      <template v-slot:top>
                        <v-toolbar flat color="white">
                          <v-dialog v-model="dialogSuc" max-width="800px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                fab color="cyan accent-3"
                                @click="nuevaSucursal">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="headline">{{ formTitleSuc }}</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="9" sm="9" md="9">
                                      <v-text-field
                                        v-model="editadoSuc.nombre"
                                        label="Nombre"
                                        autofocus
                                        required
                                        :counter="40"
                                        :maxlength="40">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="3" sm="3" md="3">
                                      <v-text-field
                                        v-model="editadoSuc.abreviado"
                                        label="Abreviado"
                                        required
                                        :counter="10"
                                        :maxlength="10">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="2" sm="2" md="2">
                                      <v-text-field
                                        v-model="editadoSuc.fiscal"
                                        label="Fiscal"
                                        required
                                        :counter="4"
                                        :maxlength="4">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="5" sx="5" mx="5">
                                      <v-switch
                                        label="Activa Facturación Electrónica"
                                        v-model="editadoSuc.electronica">
                                      </v-switch>
                                    </v-col>
                                    <v-col cols="5" sx="5" mx="5">
                                      <v-switch
                                        label="Es Sucursal Demo"
                                        v-model="editadoSuc.sucursaldemo">
                                      </v-switch>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="7" sx="7" mx="7">

                                      <span dense class="headline">Depósitos</span>

                                      <v-data-table
                                        :headers="headersDep"
                                        :items="dep"
                                        dense
                                        class="elevation-3"
                                        hide-default-footer>
                                        <template v-slot:top>
                                          <v-toolbar flat color="white">
                                            <v-dialog v-model="dialogDep" max-width="450px">
                                              <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                  fab color="cyan accent-3"
                                                  @click="nuevoDeposito">
                                                  <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <!--
                                                <v-text-field
                                                  label="Depositos"
                                                  readonly="true"
                                                  solo
                                                  background-color="cyan accent-3"
                                                  dense>
                                                </v-text-field>
                                                -->
                                              </template>
                                              <v-card>
                                                <v-card-title>
                                                  <span
                                                    class="headline">{{ formTitleDep }}
                                                  </span>
                                                </v-card-title>
                                                <v-card-text>
                                                  <v-container>
                                                    <v-row>
                                                      <v-col cols="12" sm="12" md="12">
                                                        <v-text-field
                                                          v-model="editadoDep.nombre"
                                                          label="Nombre"
                                                          required
                                                          :counter="30"
                                                          :maxlength="30">
                                                        </v-text-field>
                                                      </v-col>
                                                    </v-row>
                                                  </v-container>
                                                </v-card-text>
                                                <v-card-actions>
                                                  <v-spacer></v-spacer>
                                                  <v-btn
                                                    color="blue darken-1"
                                                    text
                                                    @click="cancelarDep">
                                                    Cancelar
                                                  </v-btn>
                                                  <v-btn
                                                    color="blue darken-1"
                                                    text
                                                    @click="guardarDep(editadoDep)">
                                                    Guardar
                                                  </v-btn>
                                                </v-card-actions>
                                              </v-card>
                                            </v-dialog>
                                          </v-toolbar>
                                        </template>
                                        <template v-slot:item.activo="{ item }">
                                          <v-chip
                                            :color="getColor(item.activo)"
                                            dark>{{item.activo?'Sí':'No'}}
                                          </v-chip>
                                        </template>
                                        <template v-slot:item.accion="{item}">
                                          <v-btn
                                            class="mr-2" fab dark x-small color="cyan"
                                            @click="editarDep(item)">
                                            <v-icon dark>mdi-pencil</v-icon>
                                          </v-btn>
                                          <v-btn
                                            class="mr-2" fab x-small color="white"
                                            @click="activarDesactivarDep(item)">
                                            <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                          </v-btn>
                                          <!--
                                          <v-btn
                                            class="mr-2" fab dark x-small color="error"
                                            @click="preguntoBorrarDep(item)">
                                            <v-icon dark>mdi-delete</v-icon>
                                          </v-btn>
                                          -->
                                        </template>
                                      </v-data-table>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="cancelarSuc">
                                  Cancelar
                                </v-btn>
                                <v-btn
                                  color="blue darken-1" text @click="guardarSuc(editadoSuc)">
                                  Guardar
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-toolbar>
                      </template>
                      <template v-slot:item.electronica="{ item }">
                        <v-chip
                          :color="getColor(item.electronica)"
                          dark>{{item.electronica?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.activo="{ item }">
                        <v-chip
                          :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.sucursaldemo="{ item }">
                        <v-chip
                          :color="getColor(item.sucursaldemo)"
                          dark>{{item.sucursaldemo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.accion="{item}">
                        <v-btn
                          class="mr-2" fab dark x-small color="cyan"
                          @click="editarSuc(item)">
                          <v-icon dark>mdi-pencil</v-icon>
                        </v-btn>
<!--
                        <v-btn
                          class="mr-2" fab dark x-small color="error"
                          @click="preguntoBorrarSuc(item)">
                          <v-icon dark>mdi-delete</v-icon>
                        </v-btn>
-->
                        <v-btn
                          class="mr-2" fab x-small color="white"
                          @click="activarDesactivarSuc(item)">
                          <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-tab-item>

                  <v-tab href="#listas">
                    Listas de Precios
                  </v-tab>
                  <v-tab-item value="listas">

                    <v-data-table
                      :headers="headersLis"
                      :items="lis"
                      dense
                      class="elevation-3">
                      <template v-slot:top>
                        <v-toolbar flat color="white">
                          <v-dialog v-model="dialogLis" max-width="700px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                fab color="cyan accent-3"
                                @click="nuevaLista">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="headline">{{ formTitleLis }}</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field
                                        v-model="editadoLis.nombre"
                                        label="Nombre"
                                        autofocus
                                        required
                                        :counter="40"
                                        :maxlength="40">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="3" sm="3" md="3">
                                      <v-text-field
                                        v-model="editadoLis.porrem"
                                        label="% de Remarcación"
                                        required>
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="cancelarLis">
                                  Cancelar
                                </v-btn>
                                <v-btn
                                  color="blue darken-1" text @click="guardarLis(editadoLis)">
                                  Guardar
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-toolbar>
                      </template>
                      <template v-slot:item.activo="{ item }">
                        <v-chip
                          :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.accion="{item}">
                        <v-btn
                          class="mr-2" fab dark x-small color="cyan"
                          @click="editarLis(item)">
                          <v-icon dark>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mr-2" fab x-small color="white"
                          @click="activarDesactivarLis(item)">
                          <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                </v-tabs>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>

      <SBar></SBar>
      <Confirmacion v-model='msg.msgAccion'
        :title=this.msg.msgTitle
        :body=this.msg.msgBody
        :visible=this.msg.msgVisible
        :buttons=this.msg.msgButtons
        @click="msgRespuesta">
      </Confirmacion>
    </v-flex>
  </v-layout>
</template>

<script>

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations } from 'vuex';
import router from '../router';
import SBar from './Forms/snackbar.vue';
import Confirmacion from "./Forms/confirmacion.vue"

// import Register from ' ./views/Register';

export default {
  components: {
    SBar,
    Confirmacion,
  },

  data: () => ({
    modelo: 'user',
    searchRub: '',
    rubDisp: [],
    selected: [],
    usernameRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],      
    emailRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],      
    email: 
      value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
    rubItems: [],
    rubValue: [],
    rubObj: [],
    lis: [],
    suc: [],
    dep: [],
    headersLis: [
      { text: 'NOMBRE', value:'nombre'},
      { text: '% REM', value:'porrem'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersSuc: [
      { text: 'NOMBRE', value:'nombre'},
      { text: 'ABREV', value:'abreviado'},
      { text: 'SUC.', value:'fiscal'},
      { text: 'ELECTRONICA', value:'electronica'},
      { text: 'DEMO', value:'sucursaldemo'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersDep: [
      { text: 'NOMBRE', value:'nombre'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    editedIndexLis: -1,
    editedIndexSuc: -1,
    editedIndexDep: -1,

    loading: false,

    searchTerceros: '',     // para el cuadro de búsqueda de datatables
    dialog: true,
    dialogLis: false,
    dialogSuc: false,
    dialogDep: false,
    editedIndex: -1,
    editado: {
      id: null,
      username: null,
      email: null,
      tercero_id: null,
    },
    defaultItem: {
      id: null,
      username: null,
      email: null,
      tercero_id: null,
    },
    editadoLis: {
      id: null,
      activo: null,
      nombre: null,
      porrem: null,
      user_id: null
    },
    defaultItemLis: {
      id: null,
      activo: null,
      nombre: null,
      porrem: null,
      user_id: null
    },    
    editadoSuc: {
      abreviado: null,
      electronica: null,
      fiscal: null,
      iniactividad: null,
      nombre: null,
      sucursaldemo: null,
      user_id: null,
      activo: null,
      depositos: [],
    },
    defaultItemSuc: {
      abreviado: null,
      electronica: null,
      fiscal: null,
      iniactividad: null,
      nombre: null,
      sucursaldemo: null,
      user_id: null,
      activo: null,
      depositos: []
    },
    editadoDep: {
      nombre: null,
      activo: null,
    },
    defaultItemDep: {
      nombre: null,
      activo: null,
    },    
    descriptionLimit: 60,
    entriesTerceros: [],
    isLoadingTerceros: false,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapMutations(['alert','closeAlert']),
    formTitle () {
      return 'Mi Perfil';
    },
    formTitleLis () {
      return this.editedIndexLis === -1 ? 'Nueva Lista de Precios' : 'Editar Lista de Precios';
    },
    formTitleSuc () {
      return this.editedIndexSuc === -1 ? 'Nueva Sucursal' : 'Editar Sucursal';
    },
    formTitleDep () {
      return this.editedIndexDep === -1 ? 'Nuevo Depósito' : 'Editar Depósito';
    },
    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },    
  },
  watch: {
    /*
    dialogLis (val) {
      val || this.cancelarLis();
    },
    */
    searchTerceros (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      // Lazily load input items
      return HTTP().get('/terceros')
        .then(({ data }) => {
          this.entriesTerceros = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingTerceros = false))
    },

  },
  mounted() {
    if (!this.isLoggedIn) {
      return router.push('/login');
    }
    // debugger
    const a = HTTP().get('/user/'+this.userId)
      .then(({ data }) => {
        this.editado = data[0];
        this.value = [];
        this.lis = data[0].listas;
        this.suc = data[0].sucursales;
        this.rubValue = []
        data[0].rubros.forEach(element => {
          this.rubValue.push(element.nombre)
        });
      });
    const b = HTTP().get('/rubrosall')
      .then(({ data }) => {
        this.rubItems = [];
        this.rubObj = [];
        data.forEach(element => {
          this.rubItems.push(element.nombre)
          this.rubObj.push(element)
        })

        /*
        debugger
        for (let i=0; i<=this.rubValue.length-1; i++) {
          let found = false
          let a = this.rubValue[i]
          for (let j=0; j<=this.rubItems.length-1; j++) {
            let b = this.rubItems[j]
            if (a==b) {
              found = true
            }
          }
          if (found==false) {
            this.rubItems.push(this.rubValue[i])
            this.rubObj.push(this.rubValue[i])
          }
        }
      */
      })
  },
  methods: {
    cancelar() {
      this.dialog = false;
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },
    getColor (activo) {
      return (activo === 1) ? 'green' : 'orange'
    },
    cancelarLis() {
      this.dialogLis = false;
      this.editadoLis = Object.assign({}, this.defaultItemLis);
      this.editedIndexLis = -1;
    },
    cancelarSuc() {
      this.dialogSuc = false;
      this.editadoSuc = Object.assign({}, this.defaultItemSuc);
      this.editedIndexSuc = -1;
    },
    cancelarDep() {
      this.dialogDep = false;
      this.editadoDep = Object.assign({}, this.defaultItemDep);
      this.editedIndexDep = -1;
    },
    guardar() {
      /*
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      */
      this.editado.suc = this.suc;
      let aux = [];
      for(let i=0; i<=this.rubValue.length-1; i++ ) {
        for(let j=0; j<=this.rubObj.length-1; j++) {
          if(this.rubValue[i]===this.rubObj[j].nombre) {
            aux.push(this.rubObj[j])
            break
          }
        }
      }
      this.editado.rubros = aux;

      //this.mensaje('¡Actualización Exitosa!', 'black', 1500) 
      this.editarHTTP(this.editado);
      this.dialog = false;
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },

    editarHTTP:function(data) {
      return HTTP().patch(`${this.modelo}/${data.id}`, data)
        .then(() => {
          this.dialog = false;
      });
    },
    editarLis (item) {
      this.editadoLis = Object.assign({}, item);
      this.editedIndexLis = this.lis.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogLis = true;
    },
    editarSuc (item) {
      // ACA DEBO CARGAR EL ARREGLO DEP QUE ESTA DENTRO DE SUCURSALES.
      // debugger
      this.editadoSuc = Object.assign({}, item);
      this.dep = this.editadoSuc.depositos;
      this.editedIndexSuc = this.suc.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogSuc = true;
    },
    activarDesactivarSuc(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },
    activarDesactivarLis(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },
    activarDesactivarDep(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },
    editarDep (item) {
      this.editadoDep = Object.assign({}, item);
      this.editedIndexDep = this.dep.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogDep = true;
    },
    nuevaLista() {
      this.dialogLis = true;
      this.editadoLis = Object.assign({}, this.defaultItemLis);
    },
    nuevaSucursal() {
      debugger
      this.dialogSuc = true;
      this.editadoSuc = Object.assign({}, this.defaultItemSuc);
      this.dep = []
    },
    nuevoDeposito() {
      // debugger
      this.dialogDep = true;
      this.editadoDep = Object.assign({}, this.defaultItemDep);
    },
    guardarLis(item) {
      // debugger
      if (this.editedIndexLis > -1) { // esta modificando
        this.lis[this.editedIndexLis].nombre = this.editadoLis.nombre;
        this.lis[this.editedIndexLis].porrem = this.editadoLis.porrem;
        this.lis[this.editedIndexLis].user_id = this.userId;
      } else {
        this.lis.push({ 
          activo: 1,
          nombre: this.editadoLis.nombre,
          porrem: this.editadoLis.porrem,
          user_id: this.userId,
          id: 0
        })
      }
      this.dialogLis = false;
    },
    guardarSuc(item) {
      debugger
      if (this.editedIndexSuc > -1) { // esta modificando
        this.suc[this.editedIndexSuc].nombre = this.editadoSuc.nombre;
        this.suc[this.editedIndexSuc].abreviado = this.editadoSuc.abreviado;
        this.suc[this.editedIndexSuc].fiscal = this.editadoSuc.fiscal;
        this.suc[this.editedIndexSuc].electronica = this.editadoSuc.electronica
        this.suc[this.editedIndexSuc].sucursaldemo = this.editadoSuc.sucursaldemo
      } else {
        this.suc.push({ 
          activo: 1,
          abreviado: this.editadoSuc.abreviado,
          depositos: this.dep,
          electronica: this.editadoSuc.electronica,
          fiscal: this.editadoSuc.fiscal,
          id: 0,
          nombre: this.editadoSuc.nombre,
          sucursaldemo: this.editadoSuc.sucursaldemo,
          user_id: this.userId
        })
      }
      this.dialogSuc = false;
    },
    guardarDep(item) {
      debugger
      if (this.editedIndexDep > -1) { // esta modificando
        this.editadoSuc.depositos[this.editedIndexDep].nombre = this.editadoDep.nombre;
      } else {
        this.dep.push({
          activo: 1,
          id: 0,
          nombre: this.editadoDep.nombre,
          sucursal_id: this.editadoSuc.id
        })
      }
      this.dialogDep = false;
    },
    preguntoBorrarLis (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.editedIndexLis = this.lis.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.lis[this.editedIndexLis].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar lista de precios'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },
    preguntoBorrarDep (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.editedIndexDep = this.dep.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.dep[this.editedIndexDep].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar deposito'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },
    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar deposito') {
          this.borrarDeposito(this.itemActual)
        }
        /*
        } else if (this.msg.msgAccion=='borrar direccion') {
          this.borrarDireccion(this.itemActual)
        } else if (this.msg.msgAccion=='borrar contacto') {
          this.borrarContacto(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS')
          alert('exportando a XLS...')
        */
      }
      this.msg.msgVisible = false;
    },
    borrarDeposito (item) {
      const index = this.dep.indexOf(item);
      this.dep.splice(index, 1)
    },

  },
};
</script>
