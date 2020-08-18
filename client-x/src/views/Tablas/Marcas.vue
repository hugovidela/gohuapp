<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        dense
        :options.sync= "pagination"
        :server-items-length="totalItems"
        :loading="loading"
        :footer-props="footerProps"
        class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat :color="colorSucursal">
            <v-btn icon @click="closeForm">
              <v-icon color="white" dark>mdi-close-circle</v-icon>
            </v-btn>
            <template v-slot:extension>
              <v-btn
                fab color="cyan accent-3"
                @click="dialog = !dialog">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn
                fab color="green accent-3"
                @click='exportarAXLS'>
                <v-icon>mdi-file-excel</v-icon>
              </v-btn>
              <v-btn
                fab color="white accent-3"
                @click='exportarAPDF'>
                <v-icon>mdi-file-pdf</v-icon>
              </v-btn>
            </template>
            <v-toolbar-title class="body-1 white--text">Marcas de Artículos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="550px">
              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar flat dark :color="colorSucursal">
                  <v-btn icon @click="cancelar">
                    <v-icon color="white" dark>mdi-close-circle</v-icon>
                  </v-btn>
                  <span class="headdline">{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="teal accent-4" class="ma-2 white--text" @click="guardar">Guardar
                  </v-btn>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            ref="nombre"
                            :disabled="!(editedIndex===-1)"
                            :autofocus="(editedIndex===-1)"
                            v-model="editado.nombre"
                            label="Nombre"
                            required
                            :rules="nombreRules"
                            :counter="50"
                            :maxlength="50"
                            v-on:keydown.tab="buscoNombre">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2" sx="6" mx="4">
                          <v-switch
                            label="Activo"
                            v-model="editado.activo">
                          </v-switch>
                        </v-col>
                    </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-col cols="12" sm="12">  <!-- Barra de búsqueda  -->
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip :color="getColor(item.activo)" dark>{{ item.activo ? 'Sí' : 'No' }}</v-chip>
        </template>
        <template v-slot:item.accion="{ item }">
          <v-btn
            class="mr-2" fab dark x-small color="cyan"
            @click="editar(item)">
          <v-icon dark>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            class="mr-2" fab dark x-small color="error"
            @click="preguntoBorrar(item)">
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>
          <v-btn
            class="mr-2" fab x-small color="white"
            @click="activarDesactivar(item)">
            <v-icon dark>mdi-checkbox-marked-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
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
import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';
import SBar from './../Forms/snackbar.vue';
import Confirmacion from "./../Forms/confirmacion.vue"
import XLSX from 'xlsx'

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    modelo: 'marcas',
    itemActual: null,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    ////////////////////////////////////
    // PARA EL DATATABLE ///////////////
    ////////////////////////////////////
    items: [],
    totalItems: 0,
    loading: false,
    pagination: {
      page: 1,
    },
    footerProps: {'items-per-page-options': [9]},
    search: '', 
    headers: [
      {
        text: 'ID',
        align: 'left',
        sortable: false,
        value: 'id',
      },
      { text: 'NOMBRE', value:'nombre', sortable: false },
      { text: 'ACTIVO', value:'activo', sortable: false },
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    // FIN DEL DATATABLE ///////////////

    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    editedIndex: -1,
    editado: {
      id: '',
      nombre: '',
      activo: true,
    },
    defaultItem: {
      id: '',
      nombre: '',
      activo: true,
    },
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn']),
    ...mapState(['colorSucursal']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Marca' : 'Editar Marca';
    },
  },
  watch: {
    dialog (val) {
      val || this.cancelar();
    },
    pagination: {
      handler () {
        this.listarHTTP()
        .then(data => {
          this.items = data.items
          this.totalItems = data.total
        })
      },
      deep: true
    },
    search() {
      this.listarHTTP()
      .then(data => {
        this.items = data.items
        this.totalItems = data.total
      })
    }    
  },
  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      return this.listarHTTP()
    }
  },
  created () {
    // this.listarHTTP();
  },
  
  methods: {
    ...mapMutations(['alert','closeAlert']),
    closeForm(){
      router.push('/')
    },
    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = this.modelo
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },
    activarDesactivar(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
      HTTP().patch(`${this.modelo}/${item.id}`,{activo: valor}).then ((res) => {
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
    },
    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrar(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS')
          this.exportExcel()
      }
      this.msg.msgVisible = false;
    },
    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {
        color: color,
        text: mensaje,
        timeout: tiempo,
      });
    },
    getColor (activo) {
      return (activo === 1) ? 'green' : 'orange'
    },
    buscoNombre (event) {
      // who caused it? "event.target.id"
      const nom = event.target.value
      debugger
      return HTTP().get(`/${this.modelo}/exists/${nom}`)
        .then(({ data }) => {
          debugger
          if(data) {
//          this.mensaje('¡El nombre ingresado ya existe.!', 'black', 1500) 
            this.$store.commit("alert", {
              color:'black',
              text:'¡El nombre ingresado ya existe.!',
              timeout:1500}
            );
            this.$refs.nombre.focus()
          }
      });
    },
    /*
    listarHTTP:function() {
      return HTTP().get('/'+this.modelo)
        .then(({ data }) => {
          this.items = data;
      });
    },
    */
    listarHTTP () {
      let localThis = this
      this.loading = true
      return new Promise((resolve, reject) => {
          const { sortBy, descending, page, rowsPerPage } = this.pagination
          let items = this.getJsonData().then(
            function(response){
              items = response.data;
              const total = response.total
              setTimeout(() => {
                localThis.loading = false;
                resolve({
                  items,
                  total
                })
              }, 0)
          })
      })
    },
    getJsonData () {
      let s = this.search.length>0 ? this.search : 'all'
      return HTTP().get(`${this.modelo}/${this.pagination.page}/${this.pagination.itemsPerPage}/${s}`)
        .then(function(response){
          var result  = response.data;
          return result;
        }).catch(function (error) {
          console.log(error);
      })
    },

    altaHTTP:function() {
      return HTTP().post('/'+this.modelo, {
        nombre: this.nombre,
        activo: true,
        }).then(({ data }) => {
          this.listarHTTP();
        });
    },
    editarHTTP:function(data) {
      return HTTP().patch(`${this.modelo}/${data.id}`, data)
        .then(() => {
          this.listarHTTP();
        });       
    },
    borrarHTTP:function(id) {
      return HTTP().delete(`/${this.modelo}/${id}`)
        .then(() => {
          this.listarHTTP();
        });
    },
    editar (item) {
      this.editedIndex = this.items.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.editado = Object.assign({}, item);
      this.dialog = true;
    },
    preguntoBorrar (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+item.nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },
    exportarAPDF () {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Exportar a PDF'
      this.msg.msgBody = 'Desea exportar los datos a PDF'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a PDF'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },
    exportarAXLS () {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Exportar a XLS'
      this.msg.msgBody = 'Desea exportar los datos a XLS'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a XLS'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },
    borrar (item) {
      const index = this.items.indexOf(item);
      this.borrarHTTP(this.items[index].id);
      this.mensaje('¡Se eliminó el registro.!', 'black', 1500) 
    },
    cancelar() {
      this.dialog = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    guardar() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      this.nombre = this.editado.nombre;
      this.activo = this.editado.activo;
      if (this.editedIndex > -1) { // esta modificando
        this.id = this.editado.id;
        this.mensaje('¡Actualización Exitosa!', 'black', 1500) 
        this.editarHTTP(this.editado);
      } else {
        this.mensaje('¡Alta Exitosa!', 'blue', 1500) 
        this.altaHTTP();
      }
      this.cancelar();
    },
  },
};
</script>
