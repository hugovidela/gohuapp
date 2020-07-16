<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="unidades"
        dense
        item-key="nombre"
        group-by="tipo"
        class="elevation-1"
        >
        <template v-slot:item.nombre="{ item }">{{ item.nombre.toUpperCase() }}</template>
        <template v-slot:item.unidad_id="{ item }">{{ busco_padre(item.unidad_id) }}</template>
        <template v-slot:top>
          <v-system-bar color="indigo darken-2" dark></v-system-bar>
          <v-toolbar dense color="indigo">
            <template v-slot:extension>
              <v-btn
                fab color="cyan accent-2" bottom left absolute @click="dialog = !dialog">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-toolbar-title class="white--text">Unidades de Medida</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
              <v-card-title  class="cyan white--text">
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="6" sm="6" md="4">
                        <v-autocomplete
                          label="Tipo de Unidad"
                          v-model="editado.tipo"
                          autofocus
                          :items="tipos"
                          item-text="Tipo">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="6" sm="6" md="4">
                        <v-text-field
                           label="Nombre" v-model="editado.nombre">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6" sm="6" md="4">
                        <v-autocomplete
                          label="Unidad Padre"
                          v-model="editado.unidad_id"
                          :items="padres"
                          :filter="customFilter"
                          item-text="nombre">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="6" sm="6" md="4">
                        <v-text-field
                          label="Coeficiente" v-model="editado.coeficiente" >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6" sx="6" mx="4">
                        <v-switch
                          label="Activo"
                          v-model="editado.activo">
                        </v-switch>
                      </v-col>
                  </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue-grey"
                    class="ma-2 white--text"
                    @click="cancelar">
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="teal accent-4"
                    class="ma-2 white--text"
                    @click="guardar">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip :color="getColor(item.activo)" dark>{{ item.activo }}</v-chip>
        </template>
        <template v-slot:item.accion="{ item }">
          <v-btn class="mr-2" fab dark x-small color="cyan" @click="editar(item)">
          <v-icon dark>mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="mr-2" size="36" fab dark x-small color="error" @click="borrar(item)">
          <v-icon dark>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <!--
      <template>
        <v-data-table
          :headers="headers"
          :items="unidades"
          item-key="id"
          group-by="tipo"
          class="elevation-1"
          show-group-by
        ></v-data-table>
      </template>
      -->
      <template>
          <div class="text-center ma-2">
          <v-snackbar
            v-model="snackbar"
            timeout:1000>
            {{ textSnack }}
            <v-btn color="info" text @click="snackbar = false">Cerrar</v-btn>
          </v-snackbar>
          </div>
      </template>
    </v-flex>
  </v-layout>
</template>

<script>
/* eslint-disable */
import HTTP from '../http';
import { mapGetters } from 'vuex';
import router from '../router';

export default {
  data: () => ({
      footerProps: {'items-per-page-options': [6, 9, 12, 15, 100]},
      search: '', // para el cuadro de búsqueda de datatables  
      snackbar: false, // para el mensaje del snackbar   
      textSnack: 'texto snackbar', // texto que se ve en el snackbar 
      dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
      // definimos los headers de la datatables
      unidades: [],
      padres: [],
      tipos: ['Masa','Volumen','Longitud','Capacidad','Tiempo','Propia' ],
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'id',
        },
        { text: 'NOMBRE', value:'nombre', sortable: false},
        { text: 'TIPO', value: 'tipo', sortable: false},
        { text: 'UNIDAD', value: 'unidad_id', sortable: false},
        { text: 'COEFICIENTE', value:'coeficiente', sortable: false},
        { text: 'ACTIVO', value:'activo', sortable: false},
        { text: 'ACCIONES', value: 'accion', sortable: false },
      ],
      editedIndex: -1,
      editado: {
        id: '',
        nombre: '',
        tipo: '',
        unidad_id: 0,
        coeficiente: 0,
        activo: false,
      },
      defaultItem: {
        id: '',
        nombre: '',
        tipo: '',
        unidad_id: 0,
        coeficiente: 0,
        activo: false,
      },
    }),
    computed: {
      // Dependiendo si es Alta o Edición cambia el título del modal
      ...mapGetters('authentication', ['isLoggedIn']),
      formTitle () {
        // operadores condicionales "condición ? expr1 : expr2"
        // si <condicion> es true, devuelve <expr1>, de lo contrario devuelve <expr2>
        return this.editedIndex === -1 ? 'Nueva Unidad de Medida' : 'Editar Unidad de Medida';
      },
    },
    watch: {
      dialog (val) {
        val || this.cancelar();
      },
    },
    mounted () {
      if (!this.isLoggedIn) {
        return router.push('/login');
      } else {
        this.listarUnidades();
      }
    },
    methods: {
      busco_padre (pid) {
        if (pid!==null) {
          return this.buscar_arr('id', pid, 'nombre');
         }
      },
      buscar_arr(column, value, ret) {
        for (var i=0; i<this.padres.length; i++) {
            var object = this.padres[i];
            if (column in object && object[column] === value) {
              return object[ret];
            }
          }
          return null;
      },
      // PROCEDIMIENTOS para el CRUD
      // Procedimiento Listar Unidades
      customFilter (item, queryText, itemText) {
        const textOne = item.name.toLowerCase()
        const textTwo = item.abbr.toLowerCase()
        const searchText = queryText.toLowerCase()
        return textOne.indexOf(searchText) > -1 ||
          textTwo.indexOf(searchText) > -1
      },      
      getColor (activo) {
        if (activo === 1) return 'red'
        else if (activo === 0) return 'orange'
        else return 'green'
      },
      listarUnidades:function() {
        return HTTP().get('/unidades')
          .then(({ data }) => {
            this.unidades = data;
            this.padres = data;
        });         
      },
      //Procedimiento de Alta
      altaUnidad:function() {
        const pos = this.buscar_arr('nombre', this.editado.unidad_id, 'id')
        return HTTP().post('/unidades', {
          nombre: this.nombre,
          tipo: this.tipo,
          unidad_id: pos,
          coeficiente: this.coeficiente,
          activo: true,
          }).then(({ data }) => {
            this.listarUnidades();
            this.nombre = '',
            this.tipo = '',
            this.unidad_id = 0,
            this.coeficiente = 0,
            this.activo = false
          });
      },
      // Procedimiento EDITAR.
      editarUnidad:function(data) {
        return HTTP().patch(`unidades/${data.id}`, data)
          .then(() => {
            this.listarUnidades();
          });       
      },
      // Procedimiento BORRAR.
      borrarUnidad:function(id) {
        return HTTP().delete(`/unidades/${id}`)
          .then(() => {
            this.listarUnidades();
          });
      },
      editar (item) {
        this.editedIndex = this.unidades.indexOf(item);
        this.editado = Object.assign({}, item);
        this.dialog = true;
      },
      borrar (item) {
        const index = this.unidades.indexOf(item);
        var r = confirm('¿Está seguro de borrar el registro?');
        if (r === true) {
          this.borrarUnidad(this.unidades[index].id);
          this.snackbar = true;
          this.textSnack = 'Se eliminó el registro.';
        } else {
          this.snackbar = true;
          this.textSnack = 'Operación cancelada.';
        }
      },
      cancelar() {
        this.dialog = false;
        this.editado = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      },
      guardar() {
        if (this.editedIndex > -1) {
            // Guarda en caso de Edición
            this.id = this.editado.id;
            this.nombre = this.editado.nombre;
            const pos = this.buscar_arr('nombre', this.editado.unidad_id)
            this.unidad_id = pos;
            this.editado.unidad_id = pos;
            this.coeficiente = this.editado.coeficiente;
            this.tipo = this.editado.tipo;
            this.activo = this.editado.activo;
            this.snackbar = true;
            this.textSnack = '¡Actualización Exitosa!';
            this.editarUnidad(this.editado);
        } else if (this.editado.nombre === '' || this.editado.activo === null) {
              // Guarda el registro en caso de Alta
              this.snackbar = true;
              this.textSnack = 'Datos incompletos.';
            } else {
              this.nombre = this.editado.nombre;
              const pos = this.buscar_arr('nombre', this.editado.unidad_id)
              this.unidad_id = pos;
              this.coeficiente = this.editado.coeficiente;
              this.tipo = this.editado.tipo;
              this.activo = true;
              this.snackbar = true;
              this.textSnack = '¡Alta exitosa!';
              this.altaUnidad();
            }
        this.cancelar();
      },
    }
};
</script>
