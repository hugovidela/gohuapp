<template>
  <v-layout align-start>
    <v-flex>
      <v-dialog v-model="dialog" :fullscreen="true">
        <template v-slot:activator="{ on }"></template>

        <v-toolbar flat dark :color="colorSucursal">
          <v-btn icon @click="closeForm">
            <v-icon color="white" dark>mdi-close-circle</v-icon>
          </v-btn>
          <span class="headdline">Actualización de Precios</span>
        </v-toolbar>

        <v-card>
          <!--
          <v-card-title class="cyan white--text" :color="colorSucursal">
            <span class="headdline">Actualización de Precios</span>
            <v-spacer></v-spacer>
            <span class="text--right">
              <v-btn
                color="blue-grey"
                class="ma-2 white--text"
                @click="closeForm">
                Cerrar
              </v-btn>
            </span>
          </v-card-title>
          -->

          <!--<form ref="form" enctype="multipart/form-data">-->
          <form method="POST" action="upload" enctype="multipart/form-data">
            <v-card-text>
              <v-container>

                <v-tabs background-color="white" color="cyan">
                  <v-tab href="#manual">
                    Cambios Manuales de Precios
                  </v-tab>
                  <v-tab-item value="manual">

                    <v-row>
                      <v-col cols="2" sm="2">
                        <v-select
                          v-model="rubro"
                          :items="rubItems"
                          item-value="id"
                          item-text="nombre"
                          label="Rubro..."
                          dense outlined return-object
                          @change="filtrar">
                        </v-select>
                      </v-col>
                      <v-col cols="2" sm="2">
                        <v-select
                          v-model="lista"
                          :items="lisItems"
                          item-value="id"
                          item-text="nombre"
                          label="Lista..."
                          dense outlined return-object
                          @change="filtrar">
                        </v-select>
                      </v-col>
                      <v-col cols="2" sm="2">
                        <v-select
                          v-model="marca"
                          :items="marItems"
                          item-value="id"
                          item-text="nombre"
                          label="Marca..."
                          dense outlined return-object
                          @change="filtrar">
                        </v-select>
                      </v-col>
                      <v-col cols="2" sm="2">
                        <v-select
                          v-model="grupo"
                          :items="gruItems"
                          item-value="id"
                          item-text="nombre"
                          label="Grupo..."
                          dense outlined return-object
                          @change="filtrar">
                        </v-select>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                  <v-tab href="#importacion">
                    Cambios de Precios por Importación
                  </v-tab>
                  <v-tab-item value="importacion">
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
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field
                          disabled
                          v-show="xlsCargado"
                          class="caption"
                          v-model="aModificarXls"
                          label="A Modificar">
                        </v-text-field>
                      </v-col>
                      <!--
                      <v-col cols="2" sm="2">
                        <v-select
                          v-model="queVer"
                          v-show="xlsCargado"
                          :items="verItems"
                          label="Que ver..."
                          dense outlined
                          @change="filtrar">
                        </v-select>
                      </v-col>
                      -->
                      <v-col cols="2" sm="2" md="2">
                        <v-btn
                          v-show="xlsCargado"
                          color="blue-grey"
                          class="ma-2 white--text"
                          @click="actualizarPrecios">
                          Actualizar Precios
                        </v-btn>
                      </v-col>

                    </v-row>
                  </v-tab-item>
                </v-tabs>

              </v-container>
            </v-card-text>
          </form>

          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            sort-by="codigo"
            dense
            class="elevation-3"
            :footer-props="footerProps">
            <template v-slot:top>
              <v-col cols="2" sm="2">  <!-- Barra de búsqueda  -->
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line hide-details>
                </v-text-field>
              </v-col>
            </template>
            <template v-slot:item.precio="{ item }">
              <span disable dark>${{ formatoImporte(item.precio) }}</span>
            </template>
            <template v-slot:item.miprecio="{ item }">
              <span disable dark>${{ formatoImporte(item.miprecio) }}</span>
            </template>
            <template v-slot:item.variacion="{ item }">
              <span disable dark>%{{ formatoImporte(item.variacion) }}</span>
            </template>
          </v-data-table>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';

export default {
  data: () => ({
    dialog: true,
    filtroListo: false,
    rubro: '',
    lista: '',
    marca: '',
    grupo: '',
    rubro_id: 0,
    lista_id: 0,
    //queVer: 0,
    nuevoXls: '',
    xlsCargado: '',
    registrosXls: 0,
    encontradosXls: 0,
    aModificarXls: 0,
    soloCambios: 0,
    rubItems: [],
    lisItems: [],
    marItems: [],
    gruItems: [],
    verItems: [],
    items: [],
    mios: [],
    footerProps: {'items-per-page-options': [9, 12, 15, 100, 500]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    items: [],
    headers: [
      { text: 'CODIGO', value: 'codigo', width: 110 },
      { text: 'NOMBRE', value:'nombre', width: 650 },
      { text: 'MI PRECIO', value:'miprecio', width: 150, align: 'right'},
      { text: 'PRECIO', value:'precio', width: 150, align: 'right'},
      { text: 'VARIACION', value:'variacion', width: 50, align: 'right'},
      { text: 'ESTADO', value:'estado', width: 50, align: 'right'},
    ],

  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'colorSucursal',
    ]),    
  },
  watch: {},

  mounted () {
    this.dialog = true;
    this.lisItems = []
    this.rubItems = []
    this.marItems = ['Todas']
    this.gruItems = ['Todos']
    this.verItems = ['Solo cambios', 'Todos']
    const a = HTTP().get('/user/'+this.userId)
      .then(({ data }) => {
        for (let i=0; i<=data[0].listas.length-1; i++) {
          this.lisItems.push(data[0].listas[i].nombre)
          this.lista_id = data[0].listas[i].id
        }
        this.lista = this.lisItems[0]
      const b = HTTP().get('/usersrubros')
        .then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            this.rubItems.push(data[i].rubro.nombre)
            this.rubro_id = data[0].rubro.id                    // ver, puede tener mas rubros
          }
          this.rubro = this.rubItems[0]
        const c = HTTP().get('/marcasbus')
          .then(({ data }) => {
            for (let i=0; i<=data.length-1; i++) {
              this.marItems.push(data[i].nombre)
            }
            this.marca = this.marItems[0]
          const d = HTTP().get('/grupos')
            .then(({ data }) => {
              for (let i=0; i<=data.length-1; i++) {
                this.gruItems.push(data[i].nombre)
              }
              this.grupo = this.gruItems[0]
              // this.queVer = this.verItems[0]
              // this.filtrar()
          });
        });
      });
    });
  },
  methods: {
    closeForm(){
      this.dialog = false;
      router.push('/')
    },
    filtrar() {
      debugger
      return HTTP().get(`/userarticulosprecios/${rubro}/${lista}/${marca}/${grupo}`)
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
        this.items.push({ codigo: r[0]+'@'+this.userId, nombre: r[1], grupo: r[2], marca: r[3], miprecio: 0, precio: r[4], variacion: 0, estado: 'N' })
      }
      this.registrosXls = sheet.length;
    },

    chequearArt() {
      this.mios = [];
      this.encontradosXls = 0;
      let tmp = []
      let preciosIguales = 0;
      debugger
      // ver de poner el rubro, por ahora van todos.
      let a = HTTP().get('/userarticulosmisprecios/'+this.lista_id)
        .then(({ data }) => {
          if (data) {
            debugger
            for (let i=0; i<=data.length-1; i++) {
              this.mios.push({ codigo: data[i].codigo, precio: data[i].costo })
            }
            // ORDENO items POR CODIGO
            this.items.sort(function (a, b) {
              if (a.codigo > b.codigo) { return 1 }
              if (a.codigo < b.codigo) { return -1 }
            return 0 })

            let cod1 = ''
            let cod2 = ''
            let pos1 = 0
            let pos2 = 0
            let lDone = true;

            // VER DE HACER UN APAREO, QUE VENGAN LAS DOS LISTAS ORDENADAS POR CODIGO PARA ELLO.
            debugger
            while (lDone) {
              cod1 = this.items[pos1].codigo 
              cod2 = this.mios[pos2].codigo 
              if (cod1 == cod2) {
                this.items[pos1].miprecio = this.mios[pos2].precio
                this.items[pos1].variacion = ((this.items[pos1].precio/this.items[pos1].miprecio)-1)*100
                if (this.items[pos1].variacion != 0) {
                  this.items[pos1].estado = 'M'
                } else {
                  preciosIguales ++
                  this.items[pos1].estado = 'X'
                }
                this.encontradosXls ++
                pos1++
                pos2++
              } else if ( cod1 > cod2 ) {
                if (pos2<this.mios.length-1) {
                  pos2++
                }
              } else if ( cod1 < cod2 ) {
                if (pos1<this.items.length-1) {
                  pos1++
                }
              }
              if (pos1==this.items.length-1 && pos2==this.mios.length-1) {
                lDone = false;
              }
            }
            this.aModificarXls = this.registrosXls - preciosIguales;
            for (let i=0; i<=this.items.length-1; i++) {
              if (this.items[i].estado!='X') {
                tmp.push(this.items[i])
              }
            }
            this.items = tmp;
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    async actualizarPrecios() {
      //ACA TIENE QUE CREAR UN ARCHIVO EXCEL CON LOS PRECIOS SELECCIONADOS
      //Y LUEGO ENVIARLO AL PROCESO DE ACTUALIZACION
      let arr = []
      for (let i=0; i<=this.items.length-1; i++) {
        if (this.items[i].estado!='X') {
          arr.push({ codigo: this.items[i].codigo , precio: this.items[i].precio } )
        }
      }
      let data = XLSX.utils.json_to_sheet(arr)
      const workbook = XLSX.utils.book_new()
      const filename = 'precios.xlsx'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      let f = XLSX.writeFile(workbook, filename)

      debugger
      let formData = new FormData();
      formData.append('file', f );

      await HTTP().post('/actualizaprecios', formData)
        .then(({ response }) => { 
          console.log('SUCCESS!!');
        })
    }
  }
}
</script>
