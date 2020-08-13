<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        sort-by="id"
        dense
        class="elevation-3"
        :footer-props="footerProps">
        <template v-slot:top>
          <v-system-bar color="indigo darken-2" dark>
            <v-btn icon @click="closeForm">
              <v-icon color="white" dark>mdi-close-circle</v-icon>
            </v-btn>
          </v-system-bar>
          <v-toolbar flat color="indigo">

            <template v-slot:extension>
              <v-btn
                fab color="cyan accent-3"
                @click="nuevoTercero">
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

            <v-toolbar-title class="white--text">
              Mis {{ $store.state.formTercerosTitulo }}
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

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
                      color="blue-grey" class="ma-2 white--text" @click="cancelar">Cancelar
                    </v-btn>
                    <v-btn
                      color="teal accent-4" class="ma-2 white--text" @click="guardar">Guardar
                    </v-btn>
                  </span>
                </v-card-title>
                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <!--
                        <v-col cols="2" sx="2" mx="2">
                          <v-text-field
                            disabled
                            v-model="editado.id"
                            label="Codigo">
                          </v-text-field>
                        </v-col>
                        -->
                        <v-col cols="3" sx="3" mx="3">
                          <v-select
                            label="Tipo de Documento"
                            v-model="editado.documento_id"
                            :items="itemsDocumentos" item-value="id"
                            item-text="nombre"
                            autocomplete
                            return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="editado.cuit"
                            v-on:keydown.tab="buscoDocumento"
                            label="Numero"
                            required
                            :rules="cuitRules"
                            :counter="11"
                            :maxlength="11">
                          </v-text-field>
                        </v-col>
                        <v-col cols="7" sm="7" md="7">
                          <v-text-field
                            ref="nombre"
                            v-model="editado.nombre"
                            label="Apellidos y Nombres"
                            required
                            :rules="nombreRules"
                            :counter="50"
                            :maxlength="50"
                            v-on:keydown.tab="buscoNombre"
                            @keyup="escribiendoNombre">
                          </v-text-field>
                        </v-col>
                        <!--
                        <v-col cols="2" sx="2" mx="2">
                          <v-switch
                            label="Activo"
                            v-model="editado.activo">
                          </v-switch>
                        </v-col>
                        -->
                      </v-row>

                      <v-tabs key="pri" background-color="white" color="cyan" v-model="tabInicial">
                        <v-tab href="#general">
                          Datos Generales
                        </v-tab>
                        <v-tab-item value="general">
                          <v-row>
                            <v-col cols="6" sm="6" md="6">
                              <v-text-field
                                v-model="editado.razon_social"
                                label="Razón Social"
                                required
                                :rules="razon_socialRules"
                                :counter="80"
                                :maxlength="80">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="6" sx="6" mx="6">
                              <v-select
                                label="Cond.Fiscal"
                                v-model="editado.responsable_id"
                                :items="itemsResponsables"
                                item-value="id"
                                item-text="nombre"
                                autocomplete
                                return-object>
                              </v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="6" sm="6" md="6">
                              <v-textarea
                                v-model="editado.observaciones"
                                label="Observaciones"
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                                shaped
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-tab-item>

                        <v-tab href="#direccion">
                          direcciones
                        </v-tab>
                        <v-tab-item value="direccion">

                          <v-data-table
                            :headers="headersDir"
                            :items="dir"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">
                                <v-dialog v-model="dialogDir" max-width="700px">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      fab color="cyan accent-3"
                                      @click="nuevaDireccion">
                                      <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                  </template>
                                  <v-card>
                                    <v-card-title>
                                      <span class="headline">{{ formTitleDir }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="8" sm="8" md="8">
                                            <v-autocomplete
                                              ref="calle0"
                                              class="body-2"
                                              v-model="editadoDir.calle_id"
                                              :items="itemsCalles"
                                              :loading="isLoadingCalles"
                                              :search-input.sync="searchCalles"
                                              item-text="nombre"
                                              item-value="id"
                                              label="Calle"
                                              placeholder="Escriba para buscar"
                                              prepend-icon="mdi-database-search">
                                            </v-autocomplete>
                                          </v-col>
                                          <v-col cols="2" sm="2" md="2">
                                            <v-text-field
                                              v-model="editadoDir.numero"
                                              label="Altura"
                                              required
                                              :counter="6"
                                              :maxlength="6">
                                            </v-text-field>
                                          </v-col>
                                          <v-col cols="2" sm="2" md="2">
                                            <v-text-field
                                              v-model="editadoDir.pisodepto"
                                              label="Piso/Dpto"
                                              required
                                              :counter="8"
                                              :maxlength="8">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="8" sm="8" md="8">
                                            <v-autocomplete
                                              ref="postal"
                                              class="body-2"
                                              v-model="editadoDir.postal_id"
                                              :items="itemsPostales"
                                              :loading="isLoadingPostales"
                                              :search-input.sync="searchPostales"
                                              item-text="nombre"
                                              item-value="id"
                                              label="Ciudad"
                                              placeholder="Escriba para buscar"
                                              prepend-icon="mdi-database-search">
                                            </v-autocomplete>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="12" sx="12" mx="12">
                                            <p>Tipo de Dirección</p>
                                            <v-radio-group v-model="editadoDir.tipo" row>
                                              <v-radio label="Unica" value="U"></v-radio>
                                              <v-radio label="Particular" value="P"></v-radio>
                                              <v-radio label="Trabajo" value="T"></v-radio>
                                            </v-radio-group>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="6" sm="6" md="6">
                                            <v-autocomplete
                                              ref="calle1"
                                              class="body-2"
                                              v-model="editadoDir.entrecalle1_id"
                                              :items="itemsCalles1"
                                              :loading="isLoadingCalles1"
                                              :search-input.sync="searchCalles1"
                                              item-text="nombre"
                                              item-value="id"
                                              label="Calle"
                                              placeholder="Escriba para buscar"
                                              prepend-icon="mdi-database-search">
                                            </v-autocomplete>
                                          </v-col>
                                          <v-col cols="6" sm="6" md="6">
                                            <v-autocomplete
                                              ref="calle2"
                                              class="body-2"
                                              v-model="editadoDir.entrecalle2_id"
                                              :items="itemsCalles2"
                                              :loading="isLoadingCalles2"
                                              :search-input.sync="searchCalles2"
                                              item-text="nombre"
                                              item-value="id"
                                              label="Calle"
                                              placeholder="Escriba para buscar"
                                              prepend-icon="mdi-database-search">
                                            </v-autocomplete>
                                          </v-col>
                                        </v-row>
                                      </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn color="blue darken-1" text @click="cancelarDir">
                                        Cancelar
                                      </v-btn>
                                      <v-btn
                                        color="blue darken-1" text @click="guardarDir(editadoDir)">
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
                                @click="editarDir(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                class="mr-2" fab x-small color="white"
                                @click="activarDesactivarDir(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-tab-item>

                        <v-tab href="#contacto">
                          contactos
                        </v-tab>
                        <v-tab-item value="contacto">

                          <v-data-table
                            :headers="headersCon"
                            :items="con"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">
                                <v-dialog v-model="dialogCon" max-width="700px">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      fab color="cyan accent-3"
                                      @click="nuevoContacto">
                                      <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                  </template>
                                  <v-card>
                                    <v-card-title>
                                      <span class="headline">{{ formTitleCon }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-bottom-navigation
                                            :value="editadoCon.contacto_tipo_id-1"
                                            v-model="tipoContactoSelId"
                                            color="red">
                                            <v-btn v-for="item in contDisp"
                                              :key="item.icono"
                                              class="mr-2" fab dark small
                                              @click="seleccionoContacto(item)">
                                              <v-icon dark>{{item.icono}}</v-icon>
                                            </v-btn>
                                          </v-bottom-navigation>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                              v-model="editadoCon.observaciones"
                                              label="Observaciones"
                                              required
                                              :counter="60"
                                              :maxlength="60">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                      </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn color="blue darken-1" text @click="cancelarCon">
                                        Cancelar
                                      </v-btn>
                                      <v-btn
                                        color="blue darken-1" text @click="guardarCon(editadoCon)">
                                        Guardar
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-toolbar>
                            </template>
<!--
                            //// PARA VER COMO VIENE ITEM ////
                            <template v-slot:item.contactoTipo.icono="{ item }">
                              <p>{{item}}</p>
                            </template>
-->
<!--                            <template v-slot:item.contactoTipo.icono="{ item }">-->
                            <template v-slot:item.icono="{ item }">
                              <v-btn
                                class="mr-2" fab dark x-small color="grey-2">
                                <v-icon dark>{{item.icono}}</v-icon>
                              </v-btn>
                            </template>

                            <template v-slot:item.accion="{item}">
                              <v-btn
                                class="mr-2" fab dark x-small color="cyan"
                                @click="editarCon(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                class="mr-2" fab dark x-small color="error"
                                @click="preguntoBorrarCon(item)">
                                <v-icon dark>mdi-delete</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>

                        </v-tab-item>

                        <v-tab href="#mediosdepago">
                          Medios de Pago
                        </v-tab>
                        <v-tab-item value="mediosdepago">

                          <v-data-table
                            :headers="headersMedios"
                            :items="medios"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">
                                <v-dialog v-model="dialogMedio" max-width="900px">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      fab color="cyan accent-3"
                                      @click="dialogMedio = !dialogMedio">
                                      <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                  </template>
                                  <v-card>
                                    <v-card-title>
                                      <span class="headline">{{ formTitleMedio }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="5" sm="5" md="5" lg="5">
                                            <v-select
                                              ref="tipomediodepago"
                                              label="Medio de Pago"
                                              v-model="editadoMedio.mediodepago_id"
                                              :items="itemsMedios" item-value="id"
                                              item-text="nombre"
                                              autocomplete
                                              return-object>
                                            </v-select>
                                          </v-col>
                                          <v-col cols="2" sm="2" md="2">
                                            <v-text-field
                                              v-model="editadoMedio.dias_vencimiento"
                                              label="Dias de vencimiento"
                                              required
                                              type="number">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>

                                        <v-row>
                                          <v-col cols="4" sm="4" md="4">
                                            <v-select
                                              ref="banco"
                                              label="Banco"
                                              v-model="editadoMedio.banco_id"
                                              :items="itemsBancos" item-value="id"
                                              item-text="nombre"
                                              autocomplete
                                              return-object>
                                            </v-select>
                                          </v-col>
                                          <v-col cols="4" sm="4" md="4">
                                            <v-text-field
                                              v-model="editadoMedio.banco_cuenta"
                                              label="Nro de Cuenta"
                                              required
                                              :counter="20"
                                              :maxlength="20">
                                            </v-text-field>
                                          </v-col>
                                          <v-col cols="4" sm="4" md="4">
                                            <v-text-field
                                              v-model="editadoMedio.banco_cbu"
                                              label="CBU"
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
                                        @click="cancelarMedio">
                                        Cancelar
                                      </v-btn>
                                      <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="guardarMedio(editadoMedio)">
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
                                @click="editarMedio(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                class="mr-2" fab dark x-small color="error"
                                @click="preguntoBorrarMedio(item)">
                                <v-icon dark>mdi-delete</v-icon>
                              </v-btn>
                              <v-btn
                                class="mr-2" fab x-small color="white"
                                @click="activarDesactivarMedio(item)">
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
                                            <v-select
                                              ref="lista"
                                              label="Listas"
                                              v-model="editadoLis.user_lista_id"
                                              :items="itemsListas" item-value="id"
                                              item-text="nombre"
                                              autocomplete
                                              return-object>
                                            </v-select>
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
                              <!--
                              <v-btn
                                class="mr-2" fab dark x-small color="error"
                                @click="preguntoBorrarLis(item)">
                                <v-icon dark>mdi-delete</v-icon>
                              </v-btn>
                              -->
                            </template>
                          </v-data-table>

                        </v-tab-item>

                        <v-tab href="#impuestos">
                          impuestos
                        </v-tab>
                        <v-tab-item value="impuestos">
                          <p>Impuestos</p>
                        </v-tab-item>

                      </v-tabs>

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
          <v-chip
            :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
          </v-chip>
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

/* https://medium.com/js-dojo/how-to-build-a-reusable-vuejs-modal-component-fc8d7f3b4735 */

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations } from 'vuex';
import router from '../router';
import SBar from './Forms/snackbar.vue';
import Confirmacion from "./Forms/confirmacion.vue"

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    modelo: 'usersclientes',
    tipo: '', // Cliente, Proveedor, Librador y que otros?
    tabInicial: 'pri',
    terceroAIncorporar: '',
    itemActual: null,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nombreRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 50) || 'Ingrese hasta 50 caracteres',
    ],      
    razon_socialRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],
    cuitRules: [
      v => !!v || 'El cuit es requerido',
      v => (v && v.length <= 11) || 'Ingrese hasta 11 caracteres',
    ],
    searchCalles: '',         // para el cuadro de búsqueda de datatables
    searchCalles1: '',        // para el cuadro de búsqueda de datatables
    searchCalles2: '',        // para el cuadro de búsqueda de datatables
    searchPostales: '',       // para el cuadro de búsqueda de datatables
    searchContactos: '',      // para el cuadro de búsqueda de datatables
    searchMedios: '',         // para el cuadro de búsqueda de datatables
    searchBancos: '',         // para el cuadro de búsqueda de datatables
    searchListas: '',         // para el cuadro de búsqueda de datatables
    tipoContactoSel: '',      // icono del tipo de contacto seleccionado
    tipoContactoSelId: '',    // id del tipo de contacto seleccionado
    // chips
    loading: false,
    searchTag: '',
    selected: [],
    tercerosTipos: [],
    // tagsDisp: [],
    contDisp: [],
    //medioDisp: [],
    // end chips
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '',         // para el cuadro de búsqueda de datatables  
    dialog: false,      // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogDir: false,   
    dialogCon: false,   
    dialogLis: false,   
    dialogMedio: false, 
    // definimos los headers de la datatables
    items: [],
    lis: [],
    userLis: [],
    headers: [
      {
        text: 'ID',
        align: 'left',
        sortable: false,
        value: 'id',
      },
      { text: 'NOMBRE', value:'tercero.nombre'},
      { text: 'FISCAL', value:'tercero.responsable.abrev'},
      { text: 'DOC', value:'tercero.documento.nombre'},
      { text: 'NRO', value:'tercero.cuit'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersDir: [
      { text: 'CALLE', value:'calle0.nombre'},
      { text: 'ALTURA', value:'numero'},
      { text: 'PISODPT', value:'pisodepto'},
      { text: 'CIUDAD', value:'postal.nombre'},
      { text: 'COD.POSTAL', value:'postal.codigo'},
      { text: 'PROVINCIA', value:'postal.provincia.nombre'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersCon: [
      { text: 'ICONO', value:'icono'},
      { text: 'OBSERVACIONES', value:'observaciones'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersLis: [
      { text: 'NOMBRE', value:'lista.nombre'},
      { text: '% REM', value:'porrem'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersMedios: [
      { text: 'ABREV', value:'mediodepago.abrev'},
      { text: 'NOMBRE', value:'mediodepago.nombre'},
      { text: 'BANCO', value:'banco.nombre'},
      { text: 'CTA.BANCARIA', value:'banco_cuenta'},
      { text: 'CBU', value:'banco_cbu'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    editedIndex: -1,
    editedIndexDir: -1,
    editedIndexCon: -1,
    editedIndexLis: -1,
    editedIndexMedio: -1,
    dir: {
      id: null,
      calle_id: null,
      numero: null,
      pisodepto: null,
      tipo: null,
      postal_id: null,
      entrecalle1_id: null,
      entrecalle2_id: null,
      activo: null,
    },
    editadoDir: {
      id: null,
      calle_id: null,
      numero: null,
      pisodepto: null,
      tipo: null,
      postal_id: null,
      entrecalle1_id: null,
      entrecalle2_id: null,
      activo: null,
    },
    defaultItemDir: {
      id: null,
      calle_id: null,
      numero: null,
      pisodepto: null,
      tipo: null,
      postal_id: null,
      entrecalle1_id: null,
      entrecalle2_id: null,
      activo: null,
    },
    con: {
      contacto_tipo_id: null,
      icono: null,
      observaciones: null,
    },
    editadoCon: {
      contacto_tipo_id: null,
      icono: null,
      observaciones: null,
    },
    defaultItemCon: {
      contacto_tipo_id: null,
      icono: null,
      observaciones: null,
    },
    editadoLis: {
      activo: null,
      id: null,
      nombre: null,
      porrem: null,
      user_tercero_id: null,
      user_tista_id: null,
    },
    defaultItemLis: {
      activo: null,
      id: null,
      nombre: null,
      porrem: null,
      user_tercero_id: null,
      user_lista_id: null,
    },    
    medios: {id: null, 
      mediodepago_id: null,
      banco_id: null,
      tarjeta_id: null,
      tarjeta_numero: null,
      banco_cuenta: null,
      banco_cbu: null,
      dias_vencimiento: null,
      activo: true
    },
    editadoMedio: {
      id: null,
      mediodepago_id: null,
      banco_id: null,
      tarjeta_id: null,
      tarjeta_numero: null,
      banco_cuenta: null,
      banco_cbu: null,
      dias_vencimiento: null,
      activo: true,
    },
    defaultMedio: {
      id: null,
      mediodepago_id: null,
      banco_id: null,
      tarjeta_id: null,
      tarjeta_numero: null,
      banco_cuenta: null,
      banco_cbu: null,
      dias_vencimiento: null,
      activo: true,
    },
    editado: {
      id: null,
      nombre: null,
      razon_social: null,
      responsable_id: 5,
      documento_id: 25,
      cuit: null,
      observaciones: null,
      activo: true,
    },
    defaultItem: {
      id: null,
      nombre: null,
      razon_social: null,
      responsable_id: 5,
      documento_id: 25,
      cuit: null,
      observaciones: null,
      activo: true,
    },
    descriptionLimit: 60,
    entriesCalles: [],
    entriesCalles1: [],
    entriesCalles2: [],
    entriesPostales: [],
    entriesContactos: [],
    isLoadingCalles: false,
    isLoadingCalles1: false,
    isLoadingCalles2: false,
    isLoadingPostales: false,
    isLoadingContactos: false,

    itemsMedios: [],
    itemsBancos: [],
    itemsResponsables: [],
    itemsDocumentos: [],
    itemsListas: [],
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId' ]),
    ...mapMutations(['alert','closeAlert','setTerceros']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo '+this.tipo : 'Editar '+this.tipo;
    },
    formTitleDir () {
      return this.editedIndexDir === -1 ? 'Nueva Direccion' : 'Editar Direccion';
    },
    formTitleCon () {
      return this.editedIndexCon === -1 ? 'Nuevo Contacto' : 'Editar Contacto';
    },
    formTitleLis () {
      return this.editedIndexLis === -1 ? 'Asignar lista de precios' : 'Editar Lista de Precios';
    },
    formTitleMedio () {
      return this.editedIndexMedio === -1 ? 'Nuevo Medio de Pago' : 'Editar Medio de Pago';
    },
    itemsCalles () {
      return this.entriesCalles.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },
    itemsCalles1 () {
      return this.entriesCalles1.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },
    itemsCalles2 () {
      return this.entriesCalles2.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },
    itemsPostales () {
      return this.entriesPostales.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },
    itemsContactos () {
      return this.entriesContactos.map(entry => {
        const icono = entry.icono.length > this.descriptionLimit
          ? entry.icono.slice(0, this.descriptionLimit) + '...'
          : entry.icono
        return Object.assign({}, entry, { icono })
        })
      },

    // MANEJO DE CHIPS //
    /*
    allSelected () {
      return this.selected.length === this.tagsDisp.length
    },
    categories () {
      const search = this.searchTag.toLowerCase()
      if (!search) return this.tagsDisp
      return this.tagsDisp.filter(item => {
        const text = item.nombre.toLowerCase()
        return text.indexOf(search) > -1
      })
    },
    selections () {
      const selections = []
      for (const selection of this.selected) {
        selections.push(selection)
      }
      return selections
    },
    */
    // MANEJO DE CHIPS //

  },
  watch: {
    // ESTE WATCH ES PARA RE-INICIALIZAR EL MISMO FORMULARIO YA CARGADO
    '$route.path': function(val, oldVal){
      this.init_component();
    },
//  dialog (val) {
//    val || this.cancelar();
//  },
    dialogDir (val) {
      val || this.cancelarDir();
    },
    dialogCon (val) {
      val || this.cancelarCon();
    },
    dialogLis (val) {
      val || this.cancelarLis();
    },
    dialogMedio (val) {
      val || this.cancelarMedio();
    },
    searchCalles (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingCalles) return
      this.isLoadingCalles = true
      // Lazily load input items
      return HTTP().get('/calles')
        .then(({ data }) => {
          this.entriesCalles = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingCalles = false))
    },
    searchCalles1 (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingCalles1) return
      this.isLoadingCalles1 = true
      // Lazily load input items
      return HTTP().get('/calles')
        .then(({ data }) => {
          this.entriesCalles1 = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingCalles1 = false))
    },
    searchCalles2 (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingCalles2) return
      this.isLoadingCalles2 = true
      // Lazily load input items
      return HTTP().get('/calles')
        .then(({ data }) => {
          this.entriesCalles2 = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingCalles2 = false))
    },
    searchPostales (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingPostales) return
      this.isLoadingPostales = true
      // Lazily load input items
      return HTTP().get('/postales')
        .then(({ data }) => {
          this.entriesPostales = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingPostales = false))
    },
    searchContactos (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingContactos) return
      this.isLoadingContactos = true
      // Lazily load input items
      return HTTP().get('/contactostipos')
        .then(({ data }) => {
          this.entriesContactos = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingContactos = false))
    },
  },
  mounted () {
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      //cargo los tags disponibles
      const a = HTTP().get('/tercerostipos')
        .then(({ data }) => {
          this.tercerosTipos = data;
        });
      const b = HTTP().get('/contactostipos')
        .then(({ data }) => {
          this.contDisp = data;
        });
      const c = HTTP().get('/mediosdepagos')
        .then(({ data }) => {
          this.itemsMedios = data
        });
      const d = HTTP().get('/bancos')
        .then(({ data }) => {
          this.itemsBancos = data
        });
      const e = HTTP().get('/afipresponsables')
        .then(({ data }) => {
          this.itemsResponsables = data;
        })
      const f = HTTP().get('/afipdocumentos')
        .then(({ data }) => {
          this.itemsDocumentos = data;
        })
      debugger
      const g = HTTP().get('/user/'+this.userId)
        .then(({ data }) => {
          this.itemsListas = data[0].listas;
        })
    }
  },
  created () {
    this.init_component()
  },
  methods: {
    closeForm(){
      router.push('/')
    },
    init_component() {
      //debugger
      let a = this.$store.state.route.fullPath.substring(1,this.$store.state.route.fullPath.length)
      if (a==='usersclientes') {
        this.tipo='Cliente'
      } else if (a==='usersproveedores') {
        this.tipo='Proveedor'
      }
      // debugger
      this.modelo = a;
      this.listarHTTP();
    },
    seleccionoContacto(item) {
      this.tipoContactoSel = item.icono;
    },
    nuevoTercero() {
      this.tabInicial = 'pri';
      this.editedIndex = -1;
      this.editado = this.defaultItem;
      this.dialog = true;
      this.dir = [];
      this.con = [];
      this.medios = [];
    },
    nuevaDireccion() {
      this.dialogDir = true;
      this.editadoDir = this.defaultItemDir;
    },
    nuevoContacto() {
      this.dialogCon = true;
      this.editadoCon = this.defaultItemCon;
    },
    nuevaLista() {
      this.dialogLis = true;
      this.editadoLis = Object.assign({}, this.defaultItemLis);
    },
    escribiendoNombre() {
      if (this.editedIndex===-1) {
        this.editado.razon_social = this.editado.nombre
      }
    },
    activarDesactivar(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
      debugger
      HTTP().patch(`usertercero/${item.id}`,{activo: valor})
        .then ((res) => {
          debugger
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
      /*
      HTTP().patch(`${this.modelo}/${item.tercero.id}`,{activo: valor}).then ((res) => {
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
      */

    },
    activarDesactivarMedio(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },
    activarDesactivarLis(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },
    activarDesactivarDir(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },
    msgRespuesta(op) {
      if (op==='Aceptar' || op==='Incorporar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrar(this.itemActual)
        } else if (this.msg.msgAccion=='borrar direccion') {
          this.borrarDireccion(this.itemActual)
        } else if (this.msg.msgAccion=='borrar contacto') {
          this.borrarContacto(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          alert('exportando a XLS...')
        } else if (this.msg.msgAccion=='Incorporar cuenta') {

          let tip = '';
          if (this.tipo === 'Cliente') {
            tip = '1'
          } else if (this.tipo === 'Proveedor') {
            tip = '2'
          }

          // REALIZA LA INCORPORACION
          return HTTP().post('/terceroincorporar', {
            user_id: this.userId,
            tercero_id: this.terceroAIncorporar,
            tipo_id: tip
            }).then(({ data }) => {
              this.msg.msgVisible = false;
              this.cancelar();
              this.listarHTTP();
            });
        }

      } else if (op==='Cancelar') {
        if (this.msg.msgAccion=='incorporar cuenta') {
          this.cancelar();
        }
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
      const nom = event.target.value
      return HTTP().get(`/${this.modelo}/exists/${nom}`)
        .then(({ data }) => {
          if(data) {
            this.mensaje('¡El nombre ingresado ya existe.!', 'black', 1500) 
            this.$refs.codigo.focus()
          }
      });
    },
    listarHTTP:function() {
      debugger
      const a = HTTP().get('/'+this.modelo+'/true')
        .then(({ data }) => {
          debugger
          this.items = data;
      });
    },
    altaHTTP:function() {
      if (this.tipo === 'Cliente') {
        this.selected.push(this.tercerosTipos[0])
      } else if (this.tipo === 'Proveedor') {
        this.selected.push(this.tercerosTipos[1])
      }
      return HTTP().post('/'+this.modelo, {
        nombre: this.editado.nombre,
        razon_social: this.editado.razon_social,
        responsable_id: this.editado.responsable.id,
        documento_id: this.editado.documento.id,
        cuit: this.editado.cuit,
        observaciones: this.editado.observaciones,
        activo: true,
        tipos: this.selected,
        direcciones: this.dir,  
        contactos: this.con,
        medios: this.medios
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
      this.editado = Object.assign({}, item.tercero);
      this.usertereroid = item.tercero_id;
      this.dialog = true;
      this.selected = item.terceroTipos;

      //debugger
      this.lis = item.terceroListas;
      const a = HTTP().get('/direcciones/'+this.editado.id)
        .then(({ data }) => {
          this.dir = data;
        });
      const b = HTTP().get('/contactos/'+this.editado.id)
        .then(({ data }) => {
          this.con = [];
          for(let i=0; i<=data.length-1; i++) {
            this.con.push({
              contacto_tipo_id: data[i].contacto_tipo_id, 
              observaciones: data[i].observaciones,
              icono: data[i].contactoTipo.icono
            })
          }
        });
      const c = HTTP().get('/mediosdepago/'+item.id)
        .then(({ data }) => {
          this.medios = data[0].terceromediosdepago;
        });
      const d = HTTP().get('/user/'+this.userId)
        .then(({ data }) => {
          this.Userlis = data[0].listas;
        });
  
    },
    editarDir (item) {
      this.editadoDir = Object.assign({}, item);
      this.editedIndexDir = this.dir.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogDir = true;
    },
    editarCon (item) {
      this.editadoCon = Object.assign({}, item);
      this.editedIndexCon = this.con.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.tipoContactoSelId = this.editadoCon.contacto_tipo_id - 1;
      this.dialogCon = true;
    },
    editarLis (item) {
      // debugger
      this.editadoLis = Object.assign({}, item);
      this.editedIndexLis = this.lis.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogLis = true;
    },
    editarMedio (item) {
      //debugger
      this.editadoMedio = Object.assign({}, item);
      this.editedIndexMedio = this.medios.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogMedio = true;
    },
    preguntoBorrar (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+item.tercero.nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },
    preguntoBorrarCon (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.editedIndexCon = this.con.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.con[this.editedIndexCon].observaciones
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar contacto'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },
    preguntoBorrarMedio (item) {
      this.editedIndexMedio = this.medios.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.dir[this.editedIndexMedio].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },
    exportarAPDF () {
      this.msg.msgTitle = 'Exportar a PDF'
      this.msg.msgBody = 'Desea exportar los datos a PDF'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a PDF'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },
    exportarAXLS () {
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
    borrarDireccion (item) {
      const index = this.dir.indexOf(item);
      this.dir.splice(index, 1)
    },
    borrarContacto (item) {
      const index = this.con.indexOf(item);
      this.con.splice(index, 1)
    },
    cancelar() {
      this.dialog = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    cancelarDir() {
      this.dialogDir = false;
      this.editadoDir = Object.assign({}, this.defaultItemDir);
      this.editedIndexDir = -1;
    },
    cancelarLis() {
      this.dialogLis = false;
      this.editadoLis = Object.assign({}, this.defaultItemLis);
      this.editedIndexLis = -1;
    },
    cancelarCon() {
      this.dialogCon = false;
      this.editadoCon = Object.assign({}, this.defaultItemCon);
      this.editedIndexCon = -1;
    },
    cancelarMedio() {
      this.dialogMedio = false;
      this.editadoMedio = Object.assign({}, this.defaultItemMedio);
      this.editedIndexMedio = -1;
    },
    guardar() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      debugger
      this.nombre = this.editado.nombre;
      this.razon_social = this.editado.razon_social;
      this.responsable_id = this.editado.responsable_id.id;
      this.documento_id = this.editado.documento_id.id;
      this.cuit = this.editado.cuit;
      this.observaciones = this.editado.observaciones;
      this.activo = this.editado.activo;
      this.editado.responsable_id = this.editado.responsable_id.id;
      this.editado.documento_id = this.editado.documento_id.id;
      this.editado.tipos = this.selected;
      this.editado.direcciones = this.dir;
      this.editado.contactos = this.con;
      this.editado.medios = this.medios;
      debugger
      this.editado.listas = this.lis;
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
    guardarDir(item) {
      let dir = '';
      let dir0 = null;
      let dir1 = null;
      let dir2 = null;
      let promesa1 = new Promise((resolve, reject) => {
        if (this.$refs.calle0.selectedItem === null || this.$refs.calle0.selectedItem === undefined ) {
          dir = this.$refs.calle0.$options.propsData.searchInput;
          HTTP().post('/calles', {nombre: dir, activo: 1})
            .then(({ data }) => {
              dir0 = data
              resolve(true)
              })
        } else {
          dir0 = this.$refs.calle0.selectedItem
          resolve(true)
        }
      })
      let promesa2 = new Promise((resolve, reject) => {
        if (this.$refs.calle1.selectedItem === null || this.$refs.calle1.selectedItem === undefined ) {
          dir = this.$refs.calle1.$options.propsData.searchInput;
          if (dir !== null ) {
            HTTP().post('/calles', {nombre: dir, activo: 1})
              .then(({ data }) => {
                dir1 = data
                resolve(true)
              })
          } else {
            resolve(true)
          }
        } else {
          dir1 = this.$refs.calle1.selectedItem
          resolve(true)
        }
      })
      let promesa3 = new Promise((resolve, reject) => {
        if (this.$refs.calle2.selectedItem === null || this.$refs.calle2.selectedItem === undefined ) {
          dir = this.$refs.calle2.$options.propsData.searchInput;
          if (dir !== null) {
            HTTP().post('/calles', {nombre: dir, activo: 1})
              .then(({ data }) => {
                dir2 = data
                resolve(true)
              })
          } else {
            resolve(true)
          }
        } else {
          dir2 = this.$refs.calle2.selectedItem
          resolve(true)
        }
      })

      Promise.all([promesa1, promesa2, promesa3]).then((values) => {
        if (this.editedIndexDir > -1) { // esta modificando
          this.dir[this.editedIndexDir].calle0 = dir0;
          this.dir[this.editedIndexDir].calle1 = dir1;
          this.dir[this.editedIndexDir].calle2 = dir2;
          this.dir[this.editedIndexDir].postal = this.$refs.postal.selectedItem;
          this.dir[this.editedIndexDir].calle_id = dir0.id;
          this.dir[this.editedIndexDir].numero = this.editadoDir.numero;
          this.dir[this.editedIndexDir].pisodepto = this.editadoDir.pisodepto;
          this.dir[this.editedIndexDir].tipo = this.editadoDir.tipo;
          this.dir[this.editedIndexDir].postal_id = this.editadoDir.postal.id;
          this.dir[this.editedIndexDir].entrecalle1_id = dir1 !== null ? dir1.id : null;
          this.dir[this.editedIndexDir].entrecalle2_id = dir2 !== null ? dir2.id : null;
        } else {
          this.dir.push({ 
            id: 0,
            calle0: dir0,
            calle1: dir1,
            calle2: dir2,
            postal: this.$refs.postal.selectedItem,
            calle_id: dir0.id,
            numero: this.editadoDir.numero,
            pisodepto: this.editadoDir.pisodepto,
            tipo: this.editadoDir.tipo,
            postal_id: this.editadoDir.postal_id,
            entrecalle1_id: dir1 !== null ? dir1.id : null,
            entrecalle2_id: dir2 !== null ? dir2.id : null,
            activo: 1,
          })
        }
        this.cancelarDir();
      })
    },
    guardarCon(item) {
      if (this.editedIndexCon > -1) { // esta modificando
        this.con[this.editedIndexCon].contacto_tipo_id = this.tipoContactoSelId+1;
        this.con[this.editedIndexCon].icono = this.tipoContactoSel;
        this.con[this.editedIndexCon].observaciones = this.editadoCon.observaciones;
      } else {
        this.con.push({ 
          contacto_tipo_id: this.tipoContactoSelId+1,
          icono: this.tipoContactoSel,
          observaciones: this.editadoCon.observaciones,
        })
      }
      this.cancelarCon();
    },
    guardarLis(item) {
      debugger
      let mUserTerceroId = this.items[this.editedIndex].id;
      if (this.editedIndexLis > -1) { // esta modificando
        this.lis[this.editedIndexLis].nombre = this.editadoLis.user_lista_id;
        this.lis[this.editedIndexLis].porrem = this.editadoLis.porrem;
      } else {
        this.lis.push({ 
          activo: 1,
          lista: this.editadoLis.user_lista_id,
          porrem: this.editadoLis.porrem,
          nombre: this.editadoLis.user_lista_id,
          user_lista_id: this.editadoLis.user_lista_id.id,
          user_tercero_id: mUserTerceroId,
        })
      }
      this.dialogLis = false;
    },
    guardarMedio(item) {
      debugger
      let mDiasVenc = 0;
      if (this.editadoMedio.dias_vencimiento !== null && this.editadoMedio.dias_vencimiento !== undefined) {
        mDiasVenc = Number(this.editadoMedio.dias_vencimiento)
      }
      let mUserTerceroId = this.items[this.editedIndex].id;
      let mBanco = null;
      let mBancoId = null;
      let mBancoCuenta = null;
      let mBancoCbu = null;
      if (this.editadoMedio.banco_id !== null && this.editadoMedio.banco_id !== undefined) {
        mBancoId = this.editadoMedio.banco_id.id
        mBancoCuenta = this.editadoMedio.banco_cuenta
        mBancoCbu = this.editadoMedio.banco_cbu
        mBanco = this.editadoMedio.banco_id
      }
      let mTarjeta = null;
      if (this.editedIndexMedio > -1) { // esta modificando
        /* campos
        id:               '',   -> campo
        user_tercero_id:  '',   -> campo
        mediodepago_id    '',   -> campo  
        banco_id:         '',   -> campo
        tarjeta_id:       '',   -> campo
        tarjeta_numero:   '',   -> campo  
        banco_cuenta:     '',   -> campo
        banco_cbu:        '',   -> campo
        dias_vencimiento: '',   -> campo
        activo:           1     -> campo
        created_at:       '',   -> campo
        updated_at:       '',   -> campo
        banco:            {},   -> objeto
        mediodepago:      {},   -> objeto
        tarjeta:          {},   -> objeto
        fin campos */
        this.medios[this.editedIndexMedio].mediodepago = this.editadoMedio.mediodepago_id
        this.medios[this.editedIndexMedio].banco = this.editadoMedio.banco_id
        this.medios[this.editedIndexMedio].banco_cuenta = this.editadoMedio.banco_cuenta;
        this.medios[this.editedIndexMedio].banco_cbu = this.editadoMedio.banco_cbu;
        this.medios[this.editedIndexMedio].dias_vencimiento = mDiasVenc;
      } else {
        this.medios.push({ 
          id: null,
          user_tercero_id: mUserTerceroId,
          mediodepago_id: this.editadoMedio.mediodepago_id.id,
          banco_id: mBancoId,
          tarjeta_id: null,
          tarjeta_numero: null,
          banco_cuenta: mBancoCuenta,
          banco_cbu: mBancoCbu,
          dias_vencimiento: mDiasVenc,
          activo: 1,          
          created_at: null,
          updated_at: null,
          banco: mBanco,
          mediodepago: this.editadoMedio.mediodepago_id,
          tarjeta: null
        })
      }
      this.cancelarMedio();
    },
    buscoDocumento (event) {
      if (this.editedIndex===-1) {  // SOLO SI ES UNA ALTA, VER QUE PASA SI CAMBIO EL DOCUMENTO
        const doc = event.target.value;
        return HTTP().get(`/terceros/documento/${doc}`)
          .then(({ data }) => {
            if(data) {
              this.terceroAIncorporar = data.id
              this.msg.msgTitle = 'Esta cuenta ya existe '
              this.msg.msgBody = 'Esta cuenta ya Existe en la base de datos global. Desea incorporarla a la suya?'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'Incorporar cuenta'
              this.msg.msgButtons = ['Incorporar','Cancelar']
            }
        });
      }
    },
  },
};
</script>
