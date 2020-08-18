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
                @click="nuevoArticulo">
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

            <v-toolbar-title class="body-1 white--text">Mis Artículos</v-toolbar-title>
            <v-spacer></v-spacer>

            <!--  Modal del diálogo para Alta y Edicion    -->
            <v-dialog v-model="dialog" max-width="900px" max-height="300px" :fullscreen="true">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <!-- para el EDICION-->
                <v-toolbar flat dark :color="colorSucursal">
                  <v-btn icon @click="cancelar">
                    <v-icon color="white" dark>mdi-close-circle</v-icon>
                  </v-btn>
                  <span class="headdline">{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <div v-if="elArticuloEsMio || editedIndex===-1">
                    <v-btn
                      color="teal accent-4" class="ma-2 white--text" @click="guardar">Guardar
                    </v-btn>
                  </div>
                </v-toolbar>
                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            ref="codigo"
                            :disabled="!(editedIndex===-1)"
                            :autofocus="(editedIndex===-1)"
                            v-model="editado.codigo"
                            label="Codigo"
                            required
                            :rules="codigoRules"
                            :counter="15"
                            maxlength="15"
                            v-on:keydown.tab="buscoCodigo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="7" sm="7" md="7">
                          <v-text-field
                            ref="nombre"
                            v-model="editado.nombre"
                            :autofocus="(editedIndex===0)"
                            label="Nombre"
                            required
                            :rules="nombreRules"
                            :counter="80"
                            maxlength="80">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.creador.username"
                            label="Creador">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sx="1" mx="1" class="body-2">
                          <v-switch
                            label="Activo"
                            v-model="editado.activo">
                          </v-switch>
                        </v-col>
                      </v-row>

                      <v-tabs background-color="white" color="cyan">
                        <v-tab href="#general">
                          Datos Generales
                        </v-tab>
                        <v-tab-item value="general">

                          <v-row no-gutters>
                            <v-col cols="3">
                              <v-card class="pa-2" outlined tile>
                                <v-row>
                                  <v-col cols="12" sx="12" mx="12">
                                    <v-autocomplete
                                      class="body-2"
                                      v-model="editado.grupo_id"
                                      :items="itemsGrupos"
                                      :loading="isLoadingGrupos"
                                      :search-input.sync="searchGrupos"
                                      item-text="nombre"
                                      item-value="id"
                                      label="Grupo"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search">
                                    </v-autocomplete>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sx="12" mx="12">
                                    <v-autocomplete
                                      class="body-2"
                                      v-model="editado.marca_id"
                                      :items="itemsMarcas"
                                      :loading="isLoadingMarcas"
                                      :search-input.sync="searchMarcas"
                                      item-text="nombre"
                                      item-value="id"
                                      label="Marca"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search">
                                    </v-autocomplete>
                                  </v-col>
                                </v-row>
                                <v-row align="center">
                                  <v-col cols="12" sm="12">
                                    <v-select
                                      v-model="rubValue"
                                      :items="rubItems"
                                      chips
                                      label="Rubros a los cuales pertenece"
                                      multiple
                                      outlined
                                    ></v-select>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                            <v-col cols="3">
                              <v-card class="pa-2" outlined tile>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <barcode
                                      :tag="tag"
                                      :value="editado.codbar">
                                    </barcode>
                                    <v-text-field
                                      ref="nombre"
                                      v-model="editado.codbar"
                                      label="Código de Barra"
                                      required
                                      :counter="14"
                                      maxlength="14">
                                    </v-text-field>
                                    <v-btn
                                      color="blue-grey"
                                      class="ma-2 white--text"
                                      @click="cancelar">
                                      Crear código propio
                                    </v-btn>
                                    <v-switch
                                      label="Es un CodBar Original"
                                      v-model="editado.codbaroriginal">
                                    </v-switch>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                            <v-col cols="3">
                              <v-card class="pa-2" outlined tile>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-textarea
                                      v-model="editado.descripcion"
                                      class="caption"
                                      background-color="blue lighten-4"
                                      color="blue"
                                      label="Descripcion"
                                    ></v-textarea>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                            <v-col cols="3">
                              <v-card class="pa-2" outlined tile>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete
                                      class="body-2"
                                      v-model="editado.iva_id"
                                      :items="itemsAfipIVA"
                                      :loading="isLoadingAfipIVA"
                                      :search-input.sync="searchAfipIVA"
                                      item-text="nombre"
                                      item-value="id"
                                      label="IVA"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search">
                                    </v-autocomplete>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete
                                      class="body-2"
                                      v-model="editado.moneda_id"
                                      :items="itemsMoneda"
                                      :loading="isLoadingMoneda"
                                      :search-input.sync="searchMoneda"
                                      item-text="nombre"
                                      item-value="id"
                                      label="Moneda"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search">
                                    </v-autocomplete>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-tab-item>

                        <v-tab href="#comercializacion">
                          Compra / Venta / Stock
                        </v-tab>
                        <v-tab-item value="comercializacion">

                          <v-row>
                            <v-col cols="4" sx="4" mx="4" class="body-2">
                              <v-switch
                                label="Se compra"
                                v-model="editado.secompra">
                              </v-switch>
                            </v-col>
                            <v-col cols="4" sx="6" mx="4" class="body-2">
                              <v-switch
                                label="Se vende"
                                v-model="editado.sevende">
                              </v-switch>
                            </v-col>
                            <v-col cols="4" sx="6" mx="4" class="body-2">
                              <v-switch
                                label="Stock"
                                v-model="editado.stock">
                              </v-switch>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="3" sx="3" mx="3">
                              <v-autocomplete
                                class="body-2"
                                v-model="editado.um_compra_id"
                                :items="itemsUmCompras"
                                :loading="isLoadingUmCompras"
                                :search-input.sync="searchUmCompras"
                                item-text="nombre"
                                item-value="id"
                                label="Como se compra"
                                placeholder="Escriba para buscar"
                                prepend-icon="mdi-database-search">
                              </v-autocomplete>
                            </v-col>
                            <v-col cols="1" sm="1" md="1">
                              <v-text-field
                                class="body-2"
                                type="number"
                                v-model="editado.un_compra"
                                maxlength="15"
                                label="Un.Compra">
                              </v-text-field>
                            </v-col>
                            <v-col cols="3" sx="3" mx="3">
                              <v-autocomplete
                                class="body-2"
                                v-model="editado.um_venta_id"
                                :items="itemsUmVentas"
                                :loading="isLoadingUmVentas"
                                :search-input.sync="searchUmVentas"
                                item-text="nombre"
                                item-value="id"
                                label="Como se vende"
                                placeholder="Escriba para buscar"
                                prepend-icon="mdi-database-search">
                              </v-autocomplete>
                            </v-col>
                            <v-col cols="1" sm="1" md="1">
                              <v-text-field
                                class="body-2"
                                type="number"
                                v-model="editado.un_venta"
                                label="Un.Venta">
                              </v-text-field>
                            </v-col>
                            <v-col cols="3" sx="3" mx="3">
                              <v-autocomplete
                                class="body-2"
                                v-model="editado.um_stock_id"
                                :items="itemsUmStock"
                                :loading="isLoadingUmStock"
                                :search-input.sync="searchUmStock"
                                item-text="nombre"
                                item-value="id"
                                label="Como lleva stock"
                                placeholder="Escriba para buscar"
                                prepend-icon="mdi-database-search">
                              </v-autocomplete>
                            </v-col>
                            <v-col cols="1" sm="1" md="1">
                              <v-text-field
                                class="body-2"
                                type="number"
                                v-model="editado.un_stock"
                                label="Un.Stock">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="2" sm="2" md="2">
                              <v-btn
                                color="blue-grey"
                                class="ma-2 white--text"
                                @click="verStock">Ver Stocks
                              </v-btn>
                            </v-col>
                            <v-col cols="5" sm="5" md="5">
                              <v-data-table v-if="dialogStk==true"
                                :headers="headersStk"
                                :items="stocks"
                                dense
                                class="elevation-3"
                                hide-default-footer>
                              </v-data-table>
                            </v-col>
                          </v-row>
                        </v-tab-item>
                        <v-tab href="#precios">
                          Precios
                        </v-tab>
                        <v-tab-item value="precios">
                          <v-row>
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field
                                v-model="costo"
                                autofocus
                                label="Costo"
                                @change="costoArticulo()">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-data-table
                            :headers="headersLis"
                            :items="editado.precios"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">
                                <v-dialog v-model="dialogLis" max-width="400px">
                                  <v-card>
                                    <v-card-title>
                                      <span class="headline">Modificar Precio</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                              disabled
                                              v-model="editadoLis.lista.nombre"
                                              label="Nombre">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="6" sm="6" md="6">
                                            <v-text-field
                                              v-model="editadoLis.costo"
                                              label="Costo"
                                              disabled>
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="3" sm="3" md="3">
                                            <v-text-field
                                              v-model="editadoLis.porrem"
                                              autofocus
                                              label="% de Remarcación"
                                              required
                                              @change="porrem()">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="6" sm="6" md="6">
                                            <v-text-field
                                              v-model="editadoLis.precio"
                                              label="precio"
                                              required
                                              @change="precio()">
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
                            <template v-slot:item.editadoLis.costo="{ item }">
                              <span disable dark>{{ formatoImporte(item.editadoLis.costo) }}</span>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn
                                class="mr-2" fab dark x-small color="cyan"
                                @click="editarLis(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-tab-item>
                        <v-tab href="#caracteristicas">
                          Caracteristicas
                        </v-tab>
                        <v-tab-item value="caracteristicas">
                          <p>Caracteristicas</p>
                        </v-tab-item>

                        <v-tab href="#tags">
                          Tags
                        </v-tab>
                        <v-tab-item value="tags">
                          <v-row align="center">
                            <v-col cols="12" sm="12" md="12">
                              <v-select
                                v-model="tagValue"
                                :items="tagItems"
                                chips
                                label="Tags"
                                multiple
                                outlined
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-tab-item>

                        <v-tab href="#fotos">
                          Fotos
                        </v-tab>

                        <v-tab-item value="fotos">
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
                                fab
                                @click="agregarFoto">
                                <v-icon dense dark>mdi-content-save</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-container fluid>
                            <v-row justify="space-around">
                              <v-col cols="2" sm="2" md="2"
                                v-for="(foto, i) in fotos"
                                :key="foto.id">
                                <v-img :src="foto.foto" aspect-ratio="1.5"></v-img>
                                <v-btn
                                  class="mr-2" fab dark x-small color="error"
                                  @click="fotos.splice(i, 1)">
                                  <v-icon dark>mdi-delete</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-container>

                        </v-tab-item>

                      </v-tabs>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <!-- Barra de búsqueda  -->
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>
        <template v-slot:item.codigo="{ item }">
          <!--{{ item.codigo.substring( item.codigo.indexOf('@')+1, item.codigo.indexOf('$') ) }}-->
          {{ item.codigo.substring(0,item.codigo.indexOf('@')) }}
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip :color="getColor(item.activo)" dark>{{ item.activo==null ? 'Sí' : 'No' }}</v-chip>
        </template>
        <template v-slot:item.accion="{ item }">
          <v-btn
            class="mr-2" fab dark x-small color="cyan"
            @click="editar(item)">
            <v-icon>{{ item.userid==userId ? 'mdi-pencil': 'mdi-glasses' }}</v-icon>
          </v-btn>
          <v-btn
            v-show="habDel(item)"
            class="mr-2" fab dark x-small color="error"
            @click="preguntoBorrar(item)">
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>
          <v-btn
            class="mr-2" fab x-small dark color="purple darken-2"
            @click="duplicarArticulo(item)">
            <v-icon dark>mdi-content-duplicate</v-icon>
          </v-btn>
          <v-btn
            class="mr-2" fab x-small color="white"
            @click="activarDesactivar(item)">
            <v-icon dark>mdi-checkbox-marked-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <!-- template para el snackbar-->

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
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import VueBarcode from 'vue-barcode';
import SBar from './Forms/snackbar.vue';
import Confirmacion from './Forms/confirmacion.vue';

export default {
  components: {
    SBar,
    Confirmacion,
    'barcode': VueBarcode,
  },
  data: () => ({
    modelo: 'articulos',
    costo: 0,
    elArticuloEsMio: false,
    rubItems: [],
    marItems: [],
    rubValue: [],
    lisItems: [],
    //vinItems: [2],
    rubObj: [],
    tagItems: [],
    tagValue: [],
    tabObj: [],
    stocks: [],

    itemActual: null,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    codigoRules: [
      (v) => !!v || 'El código es requerido',
      (v) => v.length <= 15 || 'Ingrese hasta 15 caracteres'
    ],      
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 80 || 'Ingrese hasta 80 caracteres'
    ],
    tag: 'svg',
    optBarcode: {
      lineColor: '#ff7069',
      fontSize: 20,
      font: 'Courier',
      width: 2,
      height: 30,
      marginBottom: 30,
      format: 'MSI',
      background: '#ccffff'
    },
    fotos: [],
    nuevaFoto: '',
    verCargarFoto: false,
    // chips
    //loading: false,
    //searchTag: '',
    //selected: [],
    //tagsDisp: [],
    // end chips
    //searchRubros: '',   // para el cuadro de búsqueda de datatables
    searchGrupos: '',     // para el cuadro de búsqueda de datatables
    searchUmCompras: '',  // para el cuadro de busqueda de datatables
    searchUmVentas: '',   // para el cuadro de busqueda de datatables
    searchUmStock: '',    // para el cuadro de busqueda de datatables
    searchAfipIVA: '',    // para el cuadro de busqueda de datatables
    searchMarcas: '',     // para el cuadro de busqueda de datatables
    searchMoneda: '',     // para el cuadro de busqueda de datatables
    snackbar: false,      // para el mensaje del snackbar
    textSnack: 'texto',   // texto que se ve en el snackbar
    dialog: false,        // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogLis: false,     // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogStk: false,     // para que la ventana de dialogo o modal no aparezca automáticamente

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
      { text: 'CODIGO', value:'codigo', sortable: false, width: 110},
      { text: 'NOMBRE', value:'nombre', sortable: false},
      { text: 'CREADOR', value:'creador', sortable: false},
      { text: 'GRUPO', value:'nomgru', sortable: false},
      { text: 'MARCA', value:'nommar', sortable: false},
      { text: 'ACTIVO', value:'activo', sortable: false},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersLis: [
      { text: 'LISTA', value:'lista.nombre'},
      { text: 'COSTO', value:'costo'},
      { text: '% REM', value:'porrem'},
      { text: 'PRECIO', value: 'precio'},
      { text: 'FINAL', value: 'precioFinal'},
      { text: 'MODIFICADO', value: 'updated_at'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersStk: [
      { text: 'SUCUSRAL', value:'sucursal'},
      { text: 'DEPOSITO', value:'deposito'},
      { text: 'EXISTENCIA', value:'existencia'},
    ],
    headers_fotos: [
      { text: 'FOTO', value:'foto'},
    ],
    editedIndex: -1,
    editedIndexLis: -1,
    editado: {
      id: '',
      codigo: '',
      codbar: '',
      codbaroriginal: true,
      nombre: '',
      descripcion: '',
      grupo_id: null,
      marca_id: null,
      creador_id: null,
      activo: true,
      secompra: true,
      sevende: true,
      stock: true,
      um_compra_id: null,
      um_venta_id: null,
      um_stock_id: null,
      un_compra: null,
      un_venta: null,
      un_stock: null,
      iva_id: null,
      moneda_id: null,
      creador: '',
      fotos: [],
    },
    defaultItem: {
      id: '',
      codigo: '',
      codbar: '',
      codbaroriginal: true,
      nombre: '',
      descripcion: '',
      grupo_id: null,
      marca_id: null,
      creador_id: null,
      activo: true,
      secompra: true,
      sevende: true,
      stock: true,
      um_compra_id: 1,
      um_venta_id: 1,
      um_stock_id: 1,
      un_compra: 1,
      un_venta: 1,
      un_stock: 1,
      iva_id: 5,
      moneda_id: 51,
      creador: '',
      activo: true,
      fotos: [],
    },
    editadoLis: {
      articulo_id: null,
      comprobante_item_id: null,
      costo: null,
      created_at: null,
      id: null,
      lista: { 
        activo: false, 
        created_at: null, 
        fechaultact: null, 
        id: null, 
        nombre: null, 
        porrem: null, 
        updated_at: null, 
        user_id: null },
      lista_id: null,
      porrem: null,
      precio: null,
      precioFinal: null,
      updated_at: null,
    },
    descriptionLimit: 60,
    entriesRubros: [],
    entriesGrupos: [],
    entriesUmCompras: [],
    entriesUmVentas: [],
    entriesUmStock: [],
    entriesAfipIVA: [],
    entriesMarcas: [],
    entriesMoneda: [],
    isLoadingRubros: false,
    isLoadingMarcas: false,
    isLoadingGrupos: false,
    isLoadingUmCompras: false,
    isLoadingUmVentas: false,
    isLoadingUmStock: false,
    isLoadingAfipIVA: false,
    isLoadingMoneda: false,
  }),
  /*
  components: {
    'barcode': VueBarcode
  },
  */
  computed: {
    // Dependiendo si es Alta o Edición cambia el título del modal
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapState([
      'colorSucursal', 'articulosVinculados'
    ]),    


    formTitle () {
      // operadores condicionales "condición ? expr1 : expr2"
      // si <condicion> es true, devuelve <expr1>, de lo contrario devuelve <expr2>
      return this.editedIndex === -1 ? 'Nuevo Artículo' : 'Editar Artículo';
    },
    nombreLista () {
      // operadores condicionales "condición ? expr1 : expr2"
      // si <condicion> es true, devuelve <expr1>, de lo contrario devuelve <expr2>
      return this.editadoLis.lista.nombre;
    },
    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    itemsRubros () {
      return this.entriesRubros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },    
    itemsGrupos () {
      return this.entriesGrupos.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },    
    itemsUmCompras () {
      return this.entriesUmCompras.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },    
    itemsUmVentas () {
      return this.entriesUmVentas.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },
    itemsUmStock () {
      return this.entriesUmStock.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },
    itemsAfipIVA () {
      return this.entriesAfipIVA.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },
    itemsMarcas () {
      return this.entriesMarcas.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },
    itemsMoneda () {
      return this.entriesMoneda.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },
  },
  watch: {
    /*
    selected () {
      this.search = ''
    },
    dialog (val) {
      val || this.cancelar();
    },
    */
    searchGrupos (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingGrupos) return
      this.isLoadingGrupos = true
      // Lazily load input items
      return HTTP().get('/grupos')
        .then(({ data }) => {
          this.entriesGrupos = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingGrupos = false))
    },
    searchUmCompras (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingUmCompras) return
      this.isLoadingUmCompras = true
      // Lazily load input items
      return HTTP().get('/unidades')
        .then(({ data }) => {
          this.entriesUmCompras = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingUmCompras = false))
    },
    searchUmVentas (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingUmVentas) return
      this.isLoadingUmVentas = true
      // Lazily load input items
      return HTTP().get('/unidades')
        .then(({ data }) => {
          this.entriesUmVentas = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingUmVentas = false))
    },
    searchUmStock (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingUmStock) return
      this.isLoadingUmStock = true
      // Lazily load input items
      return HTTP().get('/unidades')
        .then(({ data }) => {
          this.entriesUmStock = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingUmStock = false))
    },
    searchAfipIVA (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingAfipIVA) return
      this.isLoadingAfipIVA = true
      // Lazily load input items
      return HTTP().get('/afipiva')
        .then(({ data }) => {
          this.entriesAfipIVA = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingAfipIVA = false))
    },
    searchMarcas (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingMarcas) return
      this.isLoadingMarcas = true
      // Lazily load input items
      return HTTP().get('/marcasbus')
        .then(({ data }) => {
          this.entriesMarcas = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingMarcas = false))
    },
    searchMoneda (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingMoneda) return
      this.isLoadingMoneda = true
      // Lazily load input items
      return HTTP().get('/afipmonedas')
        .then(({ data }) => {
          this.entriesMoneda = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingMoneda = false))
    },
    pagination: {
      handler () {
        this.listarHTTP()
        .then(data => {
          this.items = []
          for(let i=0; i<data.items.length; i++) {
            this.items.push(data.items[i])
          }
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
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      return HTTP().get('/tags')
        .then(({ data }) => {
          this.tagItems = [];
          this.tagObj = [];
          data.forEach(element => {
            this.tagItems.push(element.nombre)
            this.tagObj.push(element)
          })
          return HTTP().get('/usersrubros')
            .then(({ data }) => {
              this.rubItems = [];
              this.rubObj = [];
              data.forEach(element => {
                this.rubItems.push(element.rubro.nombre)
                this.rubObj.push(element.rubro)
              })
            });
          });
    };
  },
  created () {
    this.listarHTTP();
  },
  methods: {
    closeForm(){
      router.push('/')
    },
    habDel(item) {
      if (item.userid == this.userId) {
        return true
      } else {
        return false
      }
     },
    sayEditOrView(item) {
      if (item.userid == this.userId) {
        return 'mdi-pencil' 
      } else {
        return 'mdi-glasses'
      }
     },
    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },
    verStock() {
      this.dialogStk = true;
      const a = HTTP().get('/depositos')
        .then(({ data }) => {
          this.stocks = [];
          for (let i=0; i<=data[0].sucursales.length-1; i++) {
            for (let j=0; j<=data[0].sucursales[i].depositos.length-1; j++) {
              this.stocks.push({
                sucursal: data[0].sucursales[i].nombre,
                deposito: data[0].sucursales[i].depositos[j].nombre,
                deposito_id: data[0].sucursales[i].depositos[j].id,
                existencia: 0
              })
            }
          }
          const b = HTTP().get('/stocks/'+this.editado.id)
            .then(({ data }) => {
              for (let i=0; i<=data.length-1; i++) {
                for (let j=0; j<=this.stocks.length-1; j++) {
                  if (this.stocks[j].deposito_id===data[i].deposito_id) {
                    this.stocks[j].existencia = data[i].stock
                  }
                }
              }
          })
        }).catch((err)=>{
          console.log(err);
        })
    },
    costoArticulo() {
      for (let i=0; i<= this.editado.precios.length-1; i++) {
        this.editado.precios[i].costo = Number(this.costo)
        this.editado.precios[i].precio = this.roundTo(this.costo * (1+(this.editado.precios[i].porrem/100)),2)
        this.editado.precios[i].precioFinal = this.roundTo(this.editado.precios[i].precio * (1+(this.editado.iva.tasa/100)),2)
      }
    },
    porrem() {
      this.editadoLis.precio = this.roundTo(this.editadoLis.costo * (1+(this.editadoLis.porrem/100)),2)
      return this.editadoLis.porrem
    },
    precio() {
      this.editadoLis.porrem = this.roundTo(((this.editadoLis.precio / this.editadoLis.costo )-1)*100,2)
      return this.editadoLis.precio
    },
    nuevoArticulo() {
      this.editedIndex = -1;
      this.dialog = true;
      this.editado = Object.assign({}, this.defaultItem);
      this.editado.rubros = this.rubItems;  // ASIGNO AL ART LOS RUBROS AL QUE PERTENECE EL USUARIO
      this.rubValue = this.rubItems;
      this.editado.fotos = []
      this.stocks = []
      this.dialogStk = false;
      this.costo = 0;
      this.searchGrupos = '';

      // CARGO LAS LISTAS DE PRECIOS QUE TIENE DEFINIDA EL USUARIO
      const a = HTTP().get('/user/'+this.userId)
        .then(({ data }) => {
          this.lisItems = data[0].listas;
          this.editado.precios = []

          for (let i=0; i<=this.lisItems.length-1; i++) {
            this.editado.precios.push({
              articulo_id: '',
              comprobante_item_id: '',
              costo: 0,
              created_at: '',
              id: i,
              lista: this.lisItems[i],
              lista_id: this.lisItems[i].id,
              porrem: this.lisItems[i].porrem,
              precio: 0,
              updated_at: ''
            })
          }
          //this.lisItems = this.editado.precios;
        });
    },
    cargarFotos(sino) {
      this.verCargarFoto = sino;
    },
    agregarFoto() {
      this.fotos.push({articulo_id: this.editado.id, foto: this.nuevaFoto.name})
      this.verCargarFoto = false
    },
    activarDesactivar(item) {
      const valor = item.activo!=null ? 0 : 1;
      item.activo = valor
      return HTTP().patch(`${this.modelo+'activardesactivar'}/${item.id}`)
        .then ((res) => {
          item.activo = res.data ? null : 0
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
          alert('exportando a XLS...')
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
    // PROCEDIMIENTOS para el CRUD
    getColor (activo) {
      return (activo == null) ? 'green' : 'orange'
    },
    buscoCodigo (event) {
      // who caused it? "event.target.id"
    	const cod = event.target.value
      return HTTP().get(`/${this.modelo}/exists/${cod}`)
        .then(({ data }) => {
          if(data) {
            this.mensaje('¡El código ingresado ya existe.!', 'black', 1500) 
            this.$refs.codigo.focus()
          }
      });
    },    
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
      })    },
    getJsonData () {
      let s = this.search.length>0 ? this.search : 'all'
      let v = this.$store.state.articulosVinculados
      return HTTP().get(`userarticulos/${this.pagination.page}/9/${s}/${v}`)
        .then(function(response){
          var result  = response.data;
          return result;
        }).catch(function (error) {
          console.log(error);
      })
    },

    // Procedimiento GRABAR LO EDITADO.
    editarHTTP:function(data) {
      return HTTP().patch(`${this.modelo}/${data.id}`, data)
        .then(() => {
          this.listarHTTP()
          .then(data => {
            this.items = []
            for(let i=0; i<data.items.length; i++) {
              this.items.push(data.items[i])
            }
            this.totalItems = data.total
          })
//        this.listarHTTP();
        });
    },
    // Procedimiento BORRAR.
    borrarHTTP:function(id) {
      return HTTP().delete(`/${this.modelo}/${id}`)
        .then(() => {
          this.listarHTTP();
        });
    },
    duplicarArticulo:function(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editado = Object.assign({}, item);
      const codig = this.editado.codigo.substring( 0, this.editado.codigo.indexOf('@'));
      this.editado.codigo = codig+'bis'+this.userId;
      this.mensaje('¡Duplicación Exitosa!', 'blue', 1500) 
      this.altaHTTP();
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
    editar (item) {
      const a = HTTP().get('/articulo/'+item.id)
        .then(({ data }) => {
          this.editedIndex = this.items.indexOf(item);
          this.elArticuloEsMio = item.userid == this.userId
          this.editado = Object.assign({}, data[0]);
          this.editado.codigo = this.editado.codigo.substring(0, this.editado.codigo.indexOf('@'))
          this.dialog = true;

          // CARGO RUBROS, TAGS Y PRECIOS DEL ARTICULO
          this.rubValue = []
          this.tagValue = []
          this.stocks = []
          this.dialogStk = false;
          this.editado.rubros.forEach(element => {
            this.rubValue.push(element.nombre)
          })
          this.editado.tags.forEach(element => {
            this.tagValue.push(element.nombre)
          })
          this.fotos = this.editado.fotos;

          // CARGO LAS LISTAS DE PRECIOS QUE TIENE DEFINIDA EL USUARIO
          this.editado.precios = [];
          this.lisItems = [];
          let lisPre = [];
          let lisusr = this.userId;
          let precioCreador = 0;

          debugger
          if (this.userId!=data[0].creador_id) {
            const a = HTTP().get('/userprecios/'+data[0].creador_id+'/'+data[0].id)
            .then(({ data }) => {
              precioCreador = data
            })
          }

          const b = HTTP().get('/user/'+this.userId)
            .then(({ data }) => {
              let lis = data[0].listas
              for (let i = 0; i<=lis.length-1; i++) {
                //RECORRO TODAS LAS LISTAS DE PRECIOS 
                //PR CADA LISTA TENGO QUE IR A BUSCAR EL PRECIO
                let iLis = lis[i].id;
                let iArt = this.editado.id;
                const p = HTTP().get('/precio/'+iArt+'/'+iLis)
                  .then(({ data }) => {
                    debugger
                    let costo = 0 
                    let precio = 0
                    let precioFinal = 0
                    if (data.length > 0) {
                      costo = data[0].costo 
                      precio = data[0].precio
                      precioFinal = this.roundTo(precio*(1+(this.editado.iva.tasa/100)),2)
                      if (precioCreador != 0) {
                        costo = precioCreador
                        precio = this.roundTo(precioCreador*(1+(data[0].porrem/100)),2)
                        precioFinal = this.roundTo(precio*(1+(this.editado.iva.tasa/100)),2)
                      }
                      this.editado.precios.push({
                        articulo_id: iArt,
                        comprobante_item_id: data[0].comprobante_item_id,
                        costo: costo,
                        created_at: data[0].created_at,
                        id: data[0].id,
                        lista: lis[i],
                        lista_id: iLis,
                        porrem: data[0].porrem,
                        precio: precio,
                        precioFinal: precioFinal,
                        updated_at: data[0].updated_at
                      })
                      this.lisItems.push({
                        activo: lis[i].activo,
                        created_at: lis[i].created_at,
                        fechaultact: lis[i].fechaultact,
                        id: lis[i].id,
                        nombre: lis[i].nombre,
                        porrem: data[0].porrem,
                        updated_at: lis[i].updated_at,
                        user_id: lis[i].user_id,
                        precio: precio,
                        precioFinal: precioFinal,
                        costo: data[0].costo,
                      })
                      this.costo = data[0].costo;
                    } else {
                      debugger
                      costo = precioCreador
                      precio = precioCreador*(1+(lis[i].porrem/100))
                      precioFinal = precio*(1+(this.editado.iva.tasa/100))
                      this.editado.precios.push({
                        articulo_id: iArt,
                        comprobante_item_id: null,
                        costo: costo,
                        created_at: '',
                        id: 0,
                        lista: lis[i],
                        lista_id: iLis,
                        porrem: lis[i].porrem,
                        precio: precio,
                        precioFinal: precioFinal,
                        updated_at: ''
                      })
                      this.lisItems.push({
                        activo: lis[i].activo,
                        created_at: lis[i].created_at,
                        fechaultact: lis[i].fechaultact,
                        id: lis[i].id,
                        nombre: lis[i].nombre,
                        porrem: lis[i].porrem,
                        updated_at: '',
                        user_id: lis[i].user_id,
                        precio: precio,
                        precioFinal: precioFinal,
                        costo: costo,
                      })
                      //this.costo = 0;
                    }
                })
              }
          })
      })
    },
    editarLis (item) {
      this.editadoLis = Object.assign({}, item);
      this.editedIndexLis = this.editado.precios.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogLis = true;
    },
    borrar (item) {
      const index = this.items.indexOf(item);
      this.borrarHTTP(this.items[index].id);
      this.snackbar = true;
      this.textSnack = 'Se eliminó el registro.';
    },
    cancelar() {
      this.dialog = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    cancelarLis() {
      this.dialogLis = false;
      //this.editadoLis = Object.assign({}, this.defaultItemLis);
      this.editedIndexLis = -1;
    },
    guardar() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      this.editado.codigo = this.editado.codigo+'@'+this.userId;
      /*
      this.codigo = this.editado.codigo;
      this.codbar = this.editado.codbar;
      this.codbaroriginal = this.codbaroriginal;
      this.nombre = this.editado.nombre;
      this.descripcion = this.editado.descripcion;
      this.grupo_id = this.editado.grupo_id;
      this.marca_id = this.editado.marca_id;
      this.creador_id = this.userId;
      this.secompra = this.editado.secompra ? 1 : 0 ;
      this.sevende = this.editado.sevende ? 1 : 0;
      this.stock = this.editado.stock ? 1 : 0;
      this.moneda_id = this.editado.moneda_id;
      this.um_compra_id =  this.editado.um_compra_id;
      this.um_venta_id = this.editado.um_venta_id;
      this.um_stock_id = this.editado.um_stock_id;
      this.un_compra = Number(this.editado.un_compra);
      this.un_venta = Number(this.editado.un_venta);
      this.un_stock = Number(this.editado.un_stock);
      this.iva_id = this.editado.iva_id;
      this.activo = this.editado.activo ? 1 : 0;
      */

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

      aux = [];
      for(let i=0; i<=this.tagValue.length-1; i++ ) {
        for(let j=0; j<=this.tagObj.length-1; j++) {
          if(this.tagValue[i]===this.tagObj[j].nombre) {
            aux.push(this.tagObj[j])
            break
          }
        }
      }
      this.editado.tags = aux;
      this.fotos = this.editado.fotos;
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
    guardarLis(item) {
      this.editado.precios[this.editedIndexLis].costo = this.editadoLis.costo;
      this.editado.precios[this.editedIndexLis].porrem = this.editadoLis.porrem;
      this.editado.precios[this.editedIndexLis].precio = this.editadoLis.precio;
      this.dialogLis = false;
    },
    //Procedimiento Alta de Articulos.
    altaHTTP:function() {
      return HTTP().post('/'+this.modelo, {
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
        un_compra: Number(this.editado.un_compra),
        un_venta: Number(this.editado.un_venta),
        un_stock: Number(this.editado.un_stock),
        secompra: this.editado.secompra ? 1 : 0,
        sevende: this.editado.sevende ? 1 : 0,
        stock: this.editado.stock ? 1 : 0,
        iva_id: this.editado.iva_id,
        activo: this.editado.activo,
        rubros: this.editado.rubros,
        tags: this.editado.tags,
        fotos: this.editado.fotos,
        precios: this.editado.precios,
        moneda_id: this.editado.moneda_id,
        }).then(({ data }) => {
          this.listarHTTP();
      });
    },
  },

}; 
</script>
