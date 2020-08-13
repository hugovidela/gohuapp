<template>
  <v-layout align-start>
    <v-flex>
      <v-card>
        <v-card-title  class="cyan white--text" :fullscreen="true">
          <span class="headline">Importar Artículos</span>
        </v-card-title>
        <v-form ref="form">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="3" sm="3" md="3">
                  <v-file-input
                    filled dense
                    prepend-icon="mdi-camera"
                    v-model="nuevoXls"
                    @change="cargarXls">
                    <v-icon>mdi-plus</v-icon>
                  </v-file-input>
                </v-col>
                <!--
                <v-col cols="1" sm="1" md="1">
                  <v-btn
                    color="teal accent-4"
                    class="ma-2 white--text"
                    x-small fab
                    @click="cargarXls">
                    <v-icon dense dark>mdi-content-save</v-icon>
                  </v-btn>
                </v-col>
                -->
                <v-col cols="2" sm="2">
                  <v-select
                    v-model="rubValue"
                    :items="rubItems"
                    dense
                    label="Rubro..."
                    outlined
                  ></v-select>
                </v-col>
                <!--
                <v-col cols="2" sm="2" md="2">
                  <v-btn
                    v-show="xlsCargado"
                    color="blue-grey" class="ma-2 white--text"
                    @click="cargarXls">
                    Chequear
                  </v-btn>
                </v-col>
                -->
                <v-col cols="1" sm="1" md="1">
                  <v-text-field
                    disabled
                    v-show="xlsCargado"
                    class="caption"
                    v-model="registrosXls"
                    label="Registros">
                  </v-text-field>
                </v-col>
                <v-col cols="1" sm="1" md="1">
                  <v-text-field
                    disabled
                    v-show="xlsCargado"
                    class="caption"
                    v-model="encontradosXls"
                    label="Encontrados">
                  </v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2">
                  <v-btn
                    v-show="xlsCargado"
                    color="blue-grey" class="ma-2 white--text" @click="importarArt">
                    Importar
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>

        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          sort-by="codigo"
          dense
          class="elevation-3"
          :footer-props="footerProps">
          <template v-slot:top>
            <!--
            <v-system-bar color="indigo darken-2" dark>
            </v-system-bar>
            -->
            <!--
            <v-toolbar flat color="indigo">
              <template v-slot:extension>
              </template>
              <v-toolbar-title
                class="white--text">Artículos de la Lista de Precios
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
            -->
            <v-col cols="2" sm="2">  <!-- Barra de búsqueda  -->
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar"
                single-line hide-details>
              </v-text-field>
            </v-col>

          </template>
          <!--
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
          -->
        </v-data-table>

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
import HTTP from '../http';
import { mapGetters, mapMutations } from 'vuex';
import router from '../router';
import XLSX from 'xlsx'

export default {
  data: () => ({
    items: [],
    mios: [],
    rubItems: [],
    rubValue: [],
    nuevoXls: '',
    xls: '',
    dataXls: '',
    xlsCargado: false,
    registrosXls: 0,
    encontradosXls: 0,
    importado: 0,

    editado: {
      codigo: '',
      codbar: '',
      nombre: '',
      grupo_id: 1,
      marca_id: 1,
      creador_id: null,
      padre_id: null,
      um_compra_id: 1,
      um_venta_id: 1,
      um_stock_id: 1,
      secompra: 1,
      sevende: 1,
      stock: 1,
      iva_id: 5,
      activo: 1,
      un_compra: 1,
      un_venta: 1,
      un_stock: 1,
      descripcion: '',
      codbaroriginal: '',
      moneda_id: 51,
      fotos: [],
      rubros: [],
      tags: [],
      precios: []
    },
    lisItems: [],
    editadoMain: [],

    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    items: [],
    headers: [
      {
        text: 'CODIGO',
        align: 'left',
        sortable: true,
        value: 'codigo',
      },
      { text: 'NOMBRE', value:'nombre'},
      { text: 'GRUPO', value:'grupo'},
      { text: 'MARCA', value:'marca'},
      { text: 'PRECIO', value:'precio'},
      { text: 'ESTADO', value:'estado'},
//    { text: 'ACTIVO', value:'activo'},
//    { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    editedIndex: -1,

  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
  },
  watch: {
  },
  mounted () {
    const a = HTTP().get('/user/'+this.userId)
      .then(({ data }) => {
        this.lisItems = data[0].listas;
      })
    const b = HTTP().get('/usersrubros')
      .then(({ data }) => {
        this.rubItems = [];
        data.forEach(element => {
          this.rubItems.push(element.rubro.nombre)
        })
      });
  },
  methods: {

    chequearArt() {
      this.mios = [];
      this.encontradosXls = 0;
      // ver de poner el rubro, por ahora van todos.
      let a = HTTP().get('/userarticulosimp')
        .then(({ data }) => {
          if (data) {
            for (let i=0; i<=data.length-1; i++) {
              this.mios.push({ codigo: data[i].articulo.codigo })
            }
            for (let i=0; i<=this.items.length-1; i++) {
              let cod1 = this.items[i].codigo
              for (let j=0; j<=this.mios.length-1; j++) {
                let cod2 = this.mios[j].codigo
                //alert(cod1+' '+cod2)
                if (this.items[i].codigo==this.mios[j].codigo) {
                  this.items[i].estado = 'M'
                  this.encontradosXls ++
                  break
                }
              }
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    importarArt() {

      let rubItems = [{activo: 1, created_at: '', id: 1, nombre: 'Ferreteria', privado: 0, created_at: '', user_id: null}]
      this.importado = 0;

      for (let i=0; i<=this.items.length-1; i++) {
        if (this.items[i].estado=='N') {
          this.editado.codigo = this.items[i].codigo;
          this.editado.nombre = this.items[i].nombre;
          this.editado.rubros = rubItems;
          this.editado.precios = []
          for (let j=0; j<=this.lisItems.length-1; j++) {
            this.editado.precios.push({
              articulo_id: '',
              comprobante_item_id: '',
              costo: this.items[i].precio,
              created_at: '',
              id: j,
              lista: this.lisItems[j],
              lista_id: this.lisItems[j].id,
              porrem: this.lisItems[j].porrem,
              precio: this.items[i].precio*(1+(this.lisItems[j].porrem/100)),
              updated_at: ''
           })
          }
          this.altaHTTP()
        }
      }
    },

    altaHTTP:function() {
      let a = HTTP().post('/articulos', {
        codigo: this.editado.codigo,
        codbar: this.editado.codbar,
        codbaroriginal: this.editado.codbaroriginal,
        nombre: this.editado.nombre,
        descripcion: this.editado.descripcion,
        grupo_id: this.editado.grupo_id,
        marca_id: this.editado.marca_id,
        creador_id: this.userId,
        um_compra_id: this.editado.um_compra_id,
        um_venta_id: this.editado.um_venta_id,
        um_stock_id: this.editado.um_stock_id,
        un_compra: this.editado.un_compra,
        un_venta: this.editado.un_venta,
        un_stock: this.editado.un_stock,
        secompra: this.editado.secompra,
        sevende: this.editado.sevende,
        stock: this.editado.stock,
        iva_id: this.editado.iva_id,
        activo: this.editado.activo,
        rubros: this.editado.rubros,
        tags: [],
        fotos: [],
        precios: this.editado.precios,
        moneda_id: this.editado.moneda_id,
        })
        .then(({ data }) => {
          //debugger
          this.importado ++
        })
        .catch((e) => {
          console.log(e)
        })
    },

    cargarXls() {
      debugger
      if (this.nuevoXls.name != undefined) {
        try {
          this.xlsCargado = true;
          let file = this.nuevoXls;
          let reader = new FileReader();
          reader.onload = async function (e) {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: "array" });
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let sheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            let dataset = await this.parseFileContent(sheet);
          }.bind(this);
          reader.readAsArrayBuffer(file);
          debugger
          this.chequearArt()
        } catch (exception) {
        }
      } else {
        this.xlsCargado = false;
      }
    },
    parseFileContent(sheet) {
      this.items = []
      let cod, des, pre = ''
      for (let i=0; i<=sheet.length-1; i++) {
        let r = sheet[i]
        this.items.push({ codigo: r[0]+'@'+r[2]+'#'+r[3]+'$.', nombre: r[1], grupo: r[2], marca: r[3], precio: r[4], estado: 'N' })
      }
      this.registrosXls = sheet.length;
    },

  }
};

</script>
