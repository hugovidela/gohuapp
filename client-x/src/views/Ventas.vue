<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="elevation-3"
        :footer-props="footerProps">

        <template v-slot:top>
          <v-toolbar flat :color="colorSucursal">
            <v-btn icon @click="closeForm">
              <v-icon color="white" dark>mdi-close-circle</v-icon>
            </v-btn>
            <template v-slot:extension>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="cyan accent-3" :class="tl"
                    @click="nuevo('fac')" v-on="on">Fac
                  </v-btn>
                </template>
                <span>Nueva Factura</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="cyan accent-3" :class="tl"
                    @click="nuevo('ndc')" v-on="on">Ndc
                  </v-btn>
                </template>
                <span>Nueva Nota de Crédito</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="cyan accent-3" :class="tl"
                    @click="nuevo('ndd')" v-on="on">Ndd
                  </v-btn>
                </template>
                <span>Nueva Nota de Débito</span>
              </v-tooltip>
              <!--
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="lime accent-1" :class="tl"
                    @click="nuevo('rem')" v-on="on">Rem
                  </v-btn>
                </template>
                <span>Remito</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="lime accent-1" :class="tl"
                    @click="nuevo('remfac')" v-on="on">Rem/F
                  </v-btn>
                </template>
                <span>Generar Remito sobre una Factura</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="lime accent-1" :class="tl"
                    @click="nuevo('facrem')" v-on="on">Fac/R
                  </v-btn>
                </template>
                <span>Facturar un Remito</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="indigo lighten-3" :class="tl"
                    @click="nuevo('pre')" v-on="on">Pre
                  </v-btn>
                </template>
                <span>Nuevo Presupuesto</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="indigo lighten-3" :class="tl"
                    @click="nuevo('facpre')" v-on="on">Fac/P
                  </v-btn>
                </template>
                <span>Facturar un Presupuesto</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="deep-orange lighten-2" :class="tl"
                    @click="nuevo('ped')" v-on="on">ped
                  </v-btn>
                </template>
                <span>Nuevo Pedido</span>
              </v-tooltip>
              -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="deep-orange lighten-2" :class="tl"
                    @click="nuevo('facped')" v-on="on">Fac/P
                  </v-btn>
                </template>
                <span>Facturar un Pedido</span>
              </v-tooltip>
              <!--
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="deep-purple accent-1" :class="tl"
                    @click="nuevo('not')" v-on="on">Notas
                  </v-btn>
                </template>
                <span>Anotador de Ventas</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="deep-purple accent-1" :class="tl"
                    @click="nuevo('facnot')" v-on="on">Fac/N
                  </v-btn>
                </template>
                <span>Facturar Anotaciones de Ventas</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="green accent-3" :class="tl"
                    @click="nuevo('rec')" v-on="on">Rec
                  </v-btn>
                </template>
                <span>Nuevo Recibo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="green accent-1" :class="tl"
                    @click="nuevo('ndcfac')" v-on="on">Ndc/F
                  </v-btn>
                </template>
                <span>Aplicar Nota de Crédito a Factura</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="green accent-1" :class="tl"
                    @click="nuevo('facndc')" v-on="on">Fac/C
                  </v-btn>
                </template>
                <span>Aplicar Factura a Nota de Crédito</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="green accent-1" :class="tl"
                    @click="nuevo('nddfac')" v-on="on">Ndd/F
                  </v-btn>
                </template>
                <span>Aplicar Nota de Débito a Factura</span>
              </v-tooltip>
              <v-btn
                fab color="white accent-3"
                @click='exportarAXLS'>
                <v-icon>mdi-file-excel</v-icon>
              </v-btn>
              <v-btn
                fab color="white accent-3"
                @click='exportarAPDF'>
                <v-icon>mdi-file-pdf</v-icon>
              </v-btn>
              -->
            </template>
            <v-toolbar-title
              class="white--text" @click="listarHTTP($store.state.sucursal)" v-model="sucursal">
              Central de Ventas - sucursal ({{ sucursal }}) - caja ({{ caja }})
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="550px" :fullscreen="true">
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
                        <v-col v-show="basadoEnCpr==false" cols="6" sm="6" md="6">
                          <v-autocomplete
                            v-model="editado.tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTerceros"
                            :search-input.sync="searchTerceros"
                            item-text="nombre"
                            item-value="id"
                            autofocus
                            label="Cliente"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search">
                          </v-autocomplete>
                        </v-col>
                        <v-col v-show="basadoEnCpr==true" cols="6" sm="6" md="6">
                          <v-text-field
                            disabled
                            v-model="editado.nombre"
                            label="Cliente">
                          </v-text-field>
                        </v-col>

                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            disabled
                            class="subtitle-1"
                            v-model="editado.letra"
                            label="Letra">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.responsableAbrev"
                            label="Cond.Fiscal">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.documento"
                            label="Documento">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.documentoNumero"
                            label="Numero">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-select
                            class="body-2" label="Depósito" v-model="editado.deposito_id"
                            :items="depItems" item-value="id" item-text="nombre" return-object>
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sm="6" md="6">
                          <v-select
                            label='Direccion'
                            v-model="editado.direccion_id"
                            :items="dirItems"
                            item-value="id"
                            :item-text="dirItems=>
                              `
                              ${dirItems.calle0.nombre} -
                              ${dirItems.numero} (
                              ${dirItems.postal.nombre} ) -
                              ${dirItems.postal.provincia.nombre} -
                              ${dirItems.postal.provincia.pais.nombre}
                              `">
                            <!--return-object>-->
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <!--
                          <v-switch
                            label="Cuenta Corriente"
                            v-model="ctacte"
                            @change="efectivo=!ctacte"
                            :disabled="!habcte">
                          </v-switch>
                          -->
                          <!--
                          <v-select
                            label="Medio de Pago" v-model="editado.medio_id"
                            :items="medItems" item-value="id" item-text="nombre" return-object>
                          </v-select>
                          -->
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-select
                            label="Moneda" v-model="editado.moneda_id"
                            :items="monItems" item-value="id" item-text="nombre" return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-select
                            label="Lista de Precio" v-model="editado.lista_id"
                            :items="lisItems" item-value="id" item-text="nombre" return-object>
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <span dense class="headline">Items</span>
                          <v-data-table
                            :headers="headersArt"
                            :items="articulos"
                            dense
                            class="elevation-3"
                            hide-default-footer>
                            <template v-slot:top>
                              <v-dialog v-model="dialogArt" max-width="900px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    fab color="cyan accent-3"
                                    x-small
                                    @click="nuevoArt">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                </template>
                                <v-card>
                                  <v-card-title>
                                    <span
                                      class="headline">{{ formTitleArt }}
                                    </span>
                                  </v-card-title>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            autofocus
                                            label="Codigo"
                                            v-model="editadoArt.codigo"
                                            class = "inputField input-name p-3 styled-input">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            label="Codigo de Barra"
                                            class="caption"
                                            v-model="editadoArt.codbar">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="10" sm="10" md="10">
                                          <v-autocomplete
                                            v-model="editadoArt.articulo_id"
                                            :items="itemsArticulos"
                                            :loading="isLoadingArticulos"
                                            :search-input.sync="searchArticulos"
                                            item-text="nombre"
                                            item-value="id"
                                            autofocus
                                            label="Articulo"
                                            placeholder="Escriba para buscar"
                                            prepend-icon="mdi-database-search">
                                          </v-autocomplete>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            label="Stock"
                                            disabled class="caption"
                                            v-model="editadoArt.stock">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="4" sm="4" md="4">
                                          <v-select
                                            class="body-2" label="Depósito"
                                            v-model="editadoArt.deposito_id"
                                            :items="depItems" item-value="id" item-text="nombre"
                                            return-object>
                                          </v-select>
                                        </v-col>
                                        <v-col cols="4" sm="4" md="4">
                                          <v-text-field
                                            label="Unidad"
                                            disabled class="caption"
                                            v-model="editadoArt.unidadNombre">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            label="Moneda"
                                            disabled class="caption"
                                            v-model="editadoArt.monedaNombre">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            label="IVA"
                                            disabled class="caption"
                                            v-model="editadoArt.ivaNombre">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            v-model="editadoArt.cantidad"
                                            class="text--left"
                                            label="Cantidad"
                                            @change="cantidadItem()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            v-model="editadoArt.precio"
                                            label="Precio">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="1" sm="1" md="1">
                                          <v-text-field
                                            v-model="editadoArt.tasadescuento"
                                            label="%Desc."
                                            @change="tasaDescuento()">>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            v-model="editadoArt.importedescuento"
                                            label="Imp.Descuento"
                                            @change="importeDescuento()">>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            v-model="editadoArt.total"
                                            label="TOTAL">
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
                                      @click="cancelarArt">
                                      Cancelar
                                    </v-btn>
                                    <v-btn
                                      color="blue darken-1"
                                      text
                                      @click="guardarArt(editadoArt)">
                                      Guardar
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
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
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            dense outlined
                            v-model="editado.tasadescuento"
                            @change="calculos()"
                            label="%Desc.">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="editado.importedescuento"
                            @change="calculos()"
                            label="Descuento">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="editado.gravado"
                            label="Gravado">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="editado.exento"
                            label="Exento">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="editado.iva"
                            label="IVA">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="editado.total"
                            label="TOTAL">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <!--
                      <v-row v-if="!ctacte">
                        <v-col cols="4" sm="4">
                          <v-switch
                            label="Es una operacion en Efectivo"
                            v-model="efectivo">
                          </v-switch>
                        </v-col>
                      </v-row>
                      -->
                      <!--<v-row v-if="!efectivo && !ctacte">-->

                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <span dense class="headline">Valores</span>

                          <v-row>
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field
                                dense outlined
                                v-model="valEfectivo"
                                label="Efectivo"
                                @change="calculosValores('E')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field
                                dense outlined
                                :disabled="!ctacte"
                                v-model="valCtaCte"
                                label="Cta.Cte."
                                @change="calculosValores('C')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field
                                dense outlined
                                v-model="valValores"
                                label="Valores"
                                @change="calculosValores('V')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2">
                            </v-col>
                            <v-col cols="2" sm="2" md="2">
                            </v-col>
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field
                                disabled dense outlined
                                v-model="valDiferencia"
                                label="Diferencia"
                                @change="calculos()">
                              </v-text-field>
                            </v-col>
                          </v-row>

                          <v-data-table
                            :headers="headersMed"
                            :items="valores"
                            dense
                            class="elevation-3"
                            hide-default-footer>
                            <template v-slot:top>
                              <v-dialog v-model="dialogMed" max-width="900px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    x-small fab color="cyan accent-3"
                                    @click="nuevoMed">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                </template>
                                <v-card>
                                  <v-card-title>
                                    <span
                                      class="headline">{{ formTitleMed }}
                                    </span>
                                  </v-card-title>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            v-model="editadoMed.forpag_id"
                                            label="Forma de Pago">
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
                                      @click="cancelarMed">
                                      Cancelar
                                    </v-btn>
                                    <v-btn
                                      color="blue darken-1"
                                      text
                                      @click="guardarMed(editadoMed)">
                                      Guardar
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
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
                                @click="editarMed(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                class="mr-2" fab x-small color="white"
                                @click="borrarMed(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

            <!--// PROCESAMIENTO DE PEDIDOS // -->
            <v-dialog v-model="dialogPed" max-width="550px" :fullscreen="true">
              <template v-slot:activator="{}"></template>
              <v-card>
                <v-card-title  class="cyan white--text">
                  <span class="headline">Articulos del Pedido: {{ editado.cpr }}</span>
                  <v-spacer></v-spacer>
                  <span class="text--right">
                    <v-btn
                      color="blue-grey" class="ma-2 white--text" @click="cancelarPed">Cancelar
                    </v-btn>
                    <v-btn
                      color="teal accent-4" class="ma-2 white--text" @click="guardarPed">Procesar
                    </v-btn>
                  </span>
                </v-card-title>

                <v-form ref="art">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <span dense class="headline">Items</span>
                          <v-data-table
                            :headers="headersPed"
                            :items="artPed"
                            dense
                            class="elevation-3"
                            hide-default-footer>
                            <template v-slot:top>
                              <v-dialog v-model="dialogEditArt" max-width="900px">

                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    fab color="cyan accent-3"
                                    x-small
                                    @click="nuevoArt">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                </template>

                                <!--
                                <v-card>
                                  <v-card-title>
                                    <span class="headline">{{ formTitleArt }}</span>
                                  </v-card-title>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            autofocus
                                            label="Codigo"
                                            v-model="editadoArt.codigo"
                                            class = "inputField input-name p-3 styled-input">
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
                                      @click="cancelarEditArt">
                                      Cancelar
                                    </v-btn>
                                    <v-btn
                                      color="blue darken-1"
                                      text
                                      @click="guardarEditArt(editadoArt)">
                                      Guardar
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                                -->
                              </v-dialog>
                            </template>
                            <template v-slot:item.estado="{ item }">
                              <v-chip
                                class="caption"
                                :color="getEstadoPed(item.estado,'c')" dark>
                                {{ getEstadoPed(item.estado,'e') }}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn
                                class="mr-2" fab x-small color="white"
                                @click="borrarArt(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!--// FIN DEL PROCESAMIENTO DE PEDIDOS // -->

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
        <template v-slot:item.fecha="{ item }">
          <span disable dark>{{ formatoFecha(item.fecha) }}</span>
        </template>
        <template v-slot:item.total="{ item }">
          <span disable dark>{{ formatoImporte(item.total) }}</span>
        </template>
        <template v-slot:item.pendientes[0].pendiente="{ item }">
          <span
            disable
            dark>
              {{ formatoImporte(item.pendientes[0] ? item.pendientes[0].pendiente : 0) }}
          </span>
        </template>
        <template v-slot:item.accion="{ item }">
          <v-btn
            class="mr-2" fab x-small color="white"
            @click="print(item)">
            <v-icon dark>mdi-printer</v-icon>
          </v-btn>
          <v-btn v-show="item.cpr.substring(0,3)=='PED' && item.estado=='P'"
            class="mr-2" fab x-small color="white"
            @click="chequearArt(item)">
            <v-icon dark>mdi-playlist-check</v-icon>
          </v-btn>
          <v-btn v-show="item.cpr.substring(0,3)=='PED' && item.estado=='P'"
            class="mr-2" fab x-small color="white"
            @click="nuevo(item)">
            <v-icon dark>mdi-file-document</v-icon>
          </v-btn>
          <v-btn v-if="cobrar(item)"
            class="mr-2" fab x-small color="white"
            @click="print(item)">
            <v-icon dark>mdi-sticker-emoji</v-icon>
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
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import Confirmacion from "./Forms/confirmacion.vue"
import XLSX from 'xlsx'
import jsPDF from 'jspdf'

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    basadoEnCpr: false,      // si el comprobante actual esta basado en otro comprobante. ( fac/ped, rem/fac, etc)
    notificaEnBaseAOtro: [], // arreglo para realizar la notificacion de comprobantes.
    notificaOriginal: [],    // cuando es notificaEnBaseAOtro, debo marcar el comprobante padre.
    cfUser: '',
  //sucursal: '',
    coef: 1,  // para signar los comprobantes + o -
    modelo: 'ventas',
    ctacte: false,
    formTitle: '',
    formTitleArt: '',
    formTitleMed: '',
    itemActual: null,
    tl: "text-lowercase",
    medFijos: [],
    lisItems: [],
    depItems: [],
    uniItems: [],
    monItems: [],
    ivaItems: [],
    ivaTasas: [],
    dirItems: [],
    medItems: [],
    lisValue: [],
    dirValue: [],
    medValue: [],
    lisObj: [],
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
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '',           // para el cuadro de búsqueda de datatables
    searchTerceros: '',   // para el cuadro de búsqueda de datatables
    searchArticulos: '',  // para el cuadro de búsqueda de datatables
    dialog: false,        // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogArt: false,     // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogMed: false,      // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogPed: false,      // para que la ventana de dialogo o modal no aparezca automáticamente
    items: [],
    articulos: [],
    artPed: [],
    valores: [],
    pendientes: [],

    valEfectivo: 0,
    valCtaCte: 0,
    valValores: 0,
    valDiferencia: 0,

    // definimos los headers de la datatables
    headers: [
      {
        text: 'ID',
        align: 'left',
        sortable: false,
        value: 'id',
        width: 80,
      },
      { text: 'FECHA', value:'fecha', width: 90},
      { text: 'COMPROBANTE', value:'cpr', width: 173},
      { text: 'CLIENTE', value:'tercero.nombre', width: 200},
      { text: 'TOTAL', value:'total', align: 'end', width: 120},
      { text: 'PENDIENTE', value:'pendientes[0].pendiente', align: 'end', width: 120},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersArt: [
      { text: 'CODIGO', value:'codigo'},
      { text: 'DESCRIPCION', value:'nombre'},
      { text: 'CTT', value:'cantidad'},
      { text: 'PRECIO', value:'precio'},
      { text: '%DES', value:'tasadescuento'},
      { text: 'DES', value:'importedescuento'},
      { text: 'TOTAL', value:'total'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersPed: [
      { text: 'CODIGO', value:'codigo'},
      { text: 'DESCRIPCION', value:'nombre'},
      { text: 'Ctt.Ped.', value:'cttped'},
      { text: 'Stock', value:'stock'},
      { text: 'Ctt.Ent.', value:'cttent'},
      { text: 'Nuevo Stock', value:'nuevostock'},
      { text: 'Estado', value:'estado'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersMed: [
      { text: 'FORPAG', value:'forpag_id'},
      { text: 'NRO.VALOR', value:'nrovalor'},
      { text: 'BANCO', value:'banco_id'},
      { text: 'FECHA', value:'fecha'},
      { text: 'LIBRADOR', value:'librador_id'},
      { text: 'CUENTA', value:'cuenta_id'},
      { text: 'TOTAL', value:'total'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    editedIndex: -1,
    editedIndexArt: -1,
    editedIndexMed: -1,
    editado: {
      id: '',
      tercero_id: '',
      comprobante_id: '',
      cpr: '',
      lista_id: '',
      deposito_id: '',
      medio_id: '',
      moneda_id: 51,
      direccion_id: '',
      documento_id: '',
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
      tasadescuento: 0,
      importedescuento: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      total: 0,
    },
    defaultItem: {
      id: '',
      tercero_id: '',
      comprobante_id: '',
      cpr: '',
      lista_id: '',
      deposito_id: '',
      medio_id: '',
      moneda_id: 51,
      direccion_id: '',
      documento_id: '',
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
      tasadescuento: 0,
      importedescuento: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      total: 0,
    },
    editadoArt: {
      articulo_id: '',
      codigo: '',
      codbar: '',
      nombre: '',
      deposito_id: '',
      unidad_id: '',
      unidadNombre: '',
      moneda_id: '',
      monedaNombre: '',
      iva_id: '',
      ivaNombre: '',
      cantidad: 1,
      stock: 0,
      costo: 0,
      precio: 0,
      preciooriginal: 0,
      tasadescuento: 0,
      importedescuento: 0,
      total: 0,
      texto: '',
      vencimiento: '',
    },
    defaultItemArt: {
      articulo_id: '',
      codigo: '',
      codbar: '',
      nombre: '',
      deposito_id: '',
      unidad_id: '',
      unidadNombre: '',
      moneda_id: '',
      monedaNombre: '',
      iva_id: '',
      ivaNombre: '',
      cantidad: 1,
      stock: 0,
      costo: 0,
      precio: 0,
      preciooriginal: 0,
      tasadescuento: 0,
      importedescuento: 0,
      total: 0,
      texto: '',
      vencimiento: '',
    },
    editadoMed: {
      forpag_id: '',
      numerovalor: '',
    },
    defaultItemMed: {
      forpag_id: '',
      numerovalor: '',
    },
    descriptionLimit: 80,
    entriesTerceros: [],
    entriesArticulos: [],
    entriesMedios: [],
    tercerosUserId: [],
    isLoadingTerceros: false,
    isLoadingArticulos: false,
    isLoadingMedios: false,
    search: null,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
      'sucursal',
      'sucursales',
      'sucursalFiscal',
      'notificaciones',
      'caja',
      'articulosViculados',
      'colorSucursal',
      'empresa',
      'responsable',
      'cuit',
      'operario',
      'level',
    ]),    

    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },
    itemsArticulos () {
      return this.entriesArticulos.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },
    itemsMedios () {
      return this.entriesMedios.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      }

  },
  watch: {
    /*
    dialog (val) {
      val || this.cancelar();
    },
    */
    '$store.state.sucursal' () {
      let xxx = this.sucursal
      this.listarHTTP(this.sucursal)
    },
    searchTerceros (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      // Lazily load input items
      return HTTP().get('/usersclientes/false')
        .then(({ data }) => {
          this.entriesTerceros = []
          this.tercerosUserId = []
          for (let i=0; i<= data.length-1; i++) {
            this.entriesTerceros.push(data[i].tercero)
            this.tercerosUserId.push(data[i].id)
          }
          if (val !== null && val !== '') {
            let ipos = 0
            for (let i=0; i<=this.entriesTerceros.length-1; i++) {
              if (this.editado.tercero_id === this.entriesTerceros[i].id) {
                ipos = i
                break
              }
            }
            let valor = this.tercerosUserId[ipos]
            let entro = false;
            //debugger
            return HTTP().get('/tercero/'+valor)
              .then(({ data }) => {
                this.medItems = [];
                this.lisObj = [];
                let rid = data[0].tercero.responsable.id
                if (this.responsable===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO ( VIENE DEL STORE )
                  if(rid===1 || rid===2 || rid===9 || rid===11) {
                    this.editado.letra = 'A'
                  } else {
                    this.editado.letra = 'B'
                  }
                } else if (this.responsable===6) { //EL USUARIO ES MONOTRIBUTISTA ( VIENE DEL STORE )
                    this.editado.letra = 'C'
                }

                this.editado.documento = data[0].tercero.documento.nombre;
                this.editado.documento_id = data[0].tercero.documento.id;
                this.editado.documentoNumero = data[0].tercero.cuit;
                this.editado.responsableAbrev = data[0].tercero.responsable.abrev;

//              debugger
                /*
                if (data[0].tercero.direcciones.length > 0) {
                  data[0].tercero.direcciones.forEach(e => {
                    this.dirItems.push(e)
                    this.depItems.push(data[0].sucursales[psuc].depositos[i])
//                  this.dirItems.push(e.calle0.nombre+' '+e.numero+' ('+e.postal.codigo+') '+e.postal.nombre+' - '+e.postal.provincia.nombre+' - '+e.postal.provincia.pais.nombre)
                  })
                  this.editado.direccion_id = this.dirItems[0].id
                }
                */
               this.dirItems = []
               for (let i=0; i<= data[0].tercero.direcciones.length-1; i++) {
                  this.dirItems.push(data[0].tercero.direcciones[i])
                }
                this.editado.direccion_id = this.dirItems[0].id

                this.ctacte = false
                for (let i=0; i<=this.medFijos.length-1; i++) {
                  this.medItems.push(this.medFijos[i].nombre)
                }
                if (data[0].terceromediosdepago.length > 0) {
                  data[0].terceromediosdepago.forEach(e => {
                    this.medItems.push(e.mediodepago.nombre)
                    if (e.mediodepago.id == 4) {
                      this.ctacte = true
                    }
                  })
                }
                this.editado.medio_id = this.medItems[0]
                this.editado.lista_id = this.lisItems[0].id
                this.editado.deposito_id = this.depItems[0].id
                //debugger
                

                // debugger
                if (data[0].terceroListas.length > 0) {
                  data[0].terceroListas.forEach(element => {
                    entro = true
                    this.lisItems.push(element.lista)
                    this.lisObj.push(element.lista)
                  })
                }
                // debugger
                this.editado.lista_id = this.lisItems[0].id
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingTerceros = false))
    },
    searchArticulos (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingArticulos) return
      this.isLoadingArticulos = true
      // Lazily load input items
      let v = this.$store.state.articulosVinculados
      //debugger

      return HTTP().post('/userarticulosfac', { search: val, vinculos: v} )
      //return HTTP().get('/userarticulosfac/'+val+'/'+v)         // /userarticulos
        .then(({ data }) => {
          this.entriesArticulos = []
          data.forEach(e => {
            this.entriesArticulos.push(e)
          })
          //debugger
          console.log('paso...')
          if (val !== null && val !== '') {
            let ipos = 0
            for (let i=0; i<=this.entriesArticulos.length-1; i++) {
              if (this.editadoArt.articulo_id === this.entriesArticulos[i].id) {
                ipos = i
                break
              }
            }

            this.editadoArt.codigo = this.entriesArticulos[ipos].codigo;
            this.editadoArt.nombre = this.entriesArticulos[ipos].nombre;
            this.editadoArt.codbar = this.entriesArticulos[ipos].codbar;
  
            let iArt = this.entriesArticulos[ipos].id
            let iLis = this.editado.lista_id
            //debugger
            return HTTP().get('/precio/'+iArt+'/'+iLis)
              .then(({ data }) => {
                
                this.editadoArt.precio = data[0].precio
                this.editadoArt.total = data[0].precio
                this.editadoArt.tasadesuento = 0
                this.editadoArt.importedescuento = 0
                
  //            this.uniItems = this.entriesArticulos[ipos].umventa;
  //            this.monItems = this.entriesArticulos[ipos].moneda;
  //            this.ivaItems = this.entriesArticulos[ipos].iva;
  
                this.editadoArt.deposito_id = this.depItems[0].id
  
                //debugger
                this.editadoArt.unidad_id = this.entriesArticulos[ipos].unimedid
                this.editadoArt.moneda_id = this.entriesArticulos[ipos].monedaid
                this.editadoArt.iva_id = this.entriesArticulos[ipos].ivaid
                this.editadoArt.monedaNombre = this.entriesArticulos[ipos].simbolo
                this.editadoArt.unidadNombre = this.entriesArticulos[ipos].unimed
                this.editadoArt.ivaNombre = this.entriesArticulos[ipos].tasa
  
  //              this.editadoArt.unidad_id = this.uniItems.id
  //              this.editadoArt.unidadNombre = this.uniItems.nombre
  //              this.editadoArt.moneda_id = this.monItems.id
  //              this.editadoArt.monedaNombre = this.monItems.simbolo
  //              this.editadoArt.iva_id = this.ivaItems.id
  //              this.editadoArt.ivaNombre = this.ivaItems.nombre
  
                //debugger
                let iDep = this.editadoArt.deposito_id
                
                return HTTP().get('/stock/'+iArt+'/'+iDep)
                  .then(({ data }) => {
                    if(data) {
                      this.editadoArt.stock = data
                    } else {
                      this.editadoArt.stock = 0
                    }
                })
            })
          }

        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingArticulos = false))
    },
    searchMedios (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingMedios) return
      this.isLoadingMedios = true
      // Lazily load input items
      return HTTP().get('/medios')
        .then(({ data }) => {
          this.entriesMedios = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingMedios = false))
    },

  },
  mounted () {
    //this.$events.listen('testEvent', eventData => console.log(eventData));
    this.$store.commit('closeAlert')
    moment.locale('es');
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      //debugger
      return this.listarHTTP(this.sucursal)
//    return this.listarHTTP(this.$store.state.sucursal)
    }
  },
  created () {
    const a = HTTP().get('/mediosdepagosfijos')
      .then(({ data }) => {
        this.medFijos = []
        for (let i=0; i<=data.length-1; i++) {
          this.medFijos.push(data[i])
        }
    });
    const b = HTTP().get('/afipiva')
      .then(({ data }) => {
        this.ivaTasas = []
        for (let i=0; i<=data.length-1; i++) {
          this.ivaTasas.push(data[i])
        }
    });
    // debugger
    const c = HTTP().get('/afipmonedas')
      .then(({ data }) => {
        this.monItems = data
    });

    // BUSCO LOS DEPOSITOS HABILITADOS EN LA SUCURSAL
    const d = HTTP().get('/user/'+this.userId)
      .then(({ data }) => {
        // debugger
        //TENGO EL ID DE LA SUCURSAL DE LA BD EN 'sucursal' 
        //pero necesito la posicion que ocupa dentro
        //de la matriz data[0].sucursales
        // busco el Id de la sucursal en la matriz
        let psuc = 0
        for (let i=0; i<=data[0].sucursales.length-1; i++) {
          if (data[0].sucursales[i].id===this.sucursal) {
            psuc = i;
            break;
          }
        }
        for (let i=0; i<= data[0].sucursales[psuc].depositos.length-1; i++) {
          this.depItems.push(data[0].sucursales[psuc].depositos[i])
        }
        for (let i=0; i<= data[0].listas.length-1; i++) {
          this.lisItems.push(data[0].listas[i])
          //this.lisItems.push(data[0].listas[i].nombre)
        }
    });

  },
  methods: {
    ...mapMutations([
      'alert',
      'closeAlert',
      'setSucursal',
      'setSucursales',
      'setSucursalFiscal',
      'setNotificaciones',
      'setCaja',
      'setArticulosVinculados',
      'setColorSucursal',
      'setEmpresa',
      'setOperario',
      'setLevel',
    ]),
    closeForm(){
      router.push('/')
    },
    cobrar(item) {
      if (!item.pendientes[0]) return false
      if (item.pendientes[0].pendiente>0) {
        return true
      } else {
        return false
      }
    }, 
    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        const negativeSign = amount < 0 ? "-" : "";
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
      } catch (e) {
        console.log(e)
      }
    },
    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },
    buscoPrecio(idArt, idLis) {
      return HTTP().get('/precios/'+idArt+'/'+idLis)
        .then(({ data }) => {
          // debugger
          return data.precio
      })
    },
    cantidadItem() {
      this.editadoArt.stock = this.editadoArt.cantidad
      this.editadoArt.total = this.roundTo((Number(this.editadoArt.cantidad)*Number(this.editadoArt.precio)),2)
      return this.editadoArt.total
    },
    tasaDescuento() {
      // debugger
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.precio)
      let tde = Number(this.editadoArt.tasadescuento)
      let ide = this.roundTo((ctt*pre),2)*(tde/100)
      this.editadoArt.importedescuento = ide
      this.editadoArt.total = this.roundTo(((ctt*pre)-ide),2)
      return this.editadoArt.total
    },
    tasaDescuentoGlobal() {
      // debugger
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.precio)
      let tde = Number(this.editado.tasadescuento)
      let ide = this.roundTo((ctt*pre),2)*(tde/100)
      this.editadoArt.importedescuento = ide
      this.editadoArt.total = this.roundTo(((ctt*pre)-ide),2)
      return this.editadoArt.total
    },
    importeDescuento() {
      // debugger
      let tde = this.roundTo((Number(this.editadoArt.importedescuento)/Number(this.editadoArt.total))*100,2)
      let tot = this.roundTo(Number(this.editadoArt.total)-Number(this.editadoArt.importedescuento),2)
      this.editadoArt.tasadescuento = tde
      this.editadoArt.total = tot
      return this.editadoArt.total
    },
    nuevo(que) {
      debugger
      
      // SI "que" VIENE CON DATOS, ES PORQUE ESTOY HACIENDO UN COMPROBANTE BASADO EN OTRO

      this.dialog = true;
      this.basadoEnCpr = false;         // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
      this.notificaEnBaseAOtro = [];    // LIMPIO NOTIFICACIONES PARA NO TENER PROBLEMAS
      this.notificaOriginal = [];

      this.searchTerceros = '';
      this.searchArticulos = '';
      this.isLoadingTerceros = false;

      this.valEfectivo = 0;
      this.valCtaCte = 0;
      this.valValores = 0;
      this.valDiferencia = 0;

      /*
      // BUSCO LOS DEPOSITOS HABILITADOS EN LA SUCURSAL
      const b = HTTP().get('/user/'+this.userId)
        .then(({ data }) => {
          // debugger
          
          //TENGO EL ID DE LA SUCURSAL DE LA BD EN 'sucursal' 
          //pero necesito la posicion que ocupa dentro
          //de la matriz data[0].sucursales
          // busco el Id de la sucursal en la matriz
          let psuc = 0
          for (let i=0; i<=data[0].sucursales.length-1; i++) {
            if (data[0].sucursales[i].id===this.sucursal) {
              psuc = i;
              break;
            }
          }
          for (let i=0; i<= data[0].sucursales[psuc].depositos.length-1; i++) {
            this.depItems.push(data[0].sucursales[psuc].depositos[i])
          }
          for (let i=0; i<= data[0].listas.length-1; i++) {
            this.lisItems.push(data[0].listas[i])
//          this.lisItems.push(data[0].listas[i].nombre)
          }
          // debugger
          this.editado.lista_id = this.lisItems[0].id
          this.editado.deposito_id = this.depItems[0].id
          this.cfUser = Number(data[0].tercero.responsable.codigo)
      });
      */

      this.formTitleArt = 'Nuevo Item';
      this.formTitleMed = 'Nuevo Valor';
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editado = Object.assign({}, this.defaultItem);
      if (que === 'fac') {
        this.formTitle = 'Nueva Factura - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.editado.cpr = 'FAC';
        this.coef = 1;
      } else if (que === 'ndc') {
        this.formTitle = 'Nueva Nota de Crédito Sucursal - ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.editado.cpr = 'NDC';
        this.coef = -1;
      } else if (que === 'ndd') {
        this.formTitle = 'Nueva Nota de Débito - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.editado.cpr = 'NDD';
        this.coef = 1;
      } else if (que === 'rem') {
        this.formTitle = 'Nuevo Remito'
      } else if (que === 'remfac') {
        this.formTitle = 'Generar Remito sobre una Factura'
      } else if (que === 'facrem') {
        this.formTitle = 'Facturar un Remito'
      } else if (que === 'pre') {
        this.formTitle = 'Nuevo Presupuesto'
      } else if (que === 'facpre') {
        this.formTitle = 'Facturar un Presupuesto'
      } else if (que === 'ped') {
        this.formTitle = 'Nuevo Pedido'
      } else if (que === 'facped') {
        this.formTitle = 'Facturar un Pedido'
      } else if (que === 'not') {
        this.formTitle = 'Anotador de Ventas'
      } else if (que === 'facnot') {
        this.formTitle = 'Facturar Anotaciones de Ventas'
      } else if (que === 'rec') {
        this.formTitle = 'Nuevo Recibo'
      } else if (que === 'ndcfac') {
        this.formTitle = 'Aplicar Nota de Crédito a Factura'
      } else if (que === 'facndc') {
        this.formTitle = 'Aplicar Factura a Nota de Crédito'
      } else if (que === 'nddfac') {
        this.formTitle = 'Aplicar Nota de Débito a Factura'
      } else if (que.cpr.substring(0,3)=='PED') {

        this.formTitle = 'Facturar el Pedido '+que.cpr+' - ('+que.tercero.nombre+')'
        this.searchTerceros = ''
        this.isLoadingTerceros = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
        this.basadoEnCpr = true;   // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
        this.editado.tercero_id = que.tercero_id;
        this.editado.nombre = que.tercero.nombre;
        this.editado.responsableAbrev = que.tercero.responsable.abrev;
        this.editado.documento = que.tercero.documento.nombre
        this.editado.documentoNumero = que.tercero.cuit
        this.editado.moneda_id = que.moneda_id
        let rid = que.tercero.responsable.id
        this.cfUser = Number(que.tercero.responsable.codigo)

        this.editado.cpr = 'FAC';
        if (this.cfUser===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO
          if(rid===1 || rid===2 || rid===9 || rid===11) {
            this.editado.letra = 'A'
          } else {
            this.editado.letra = 'B'
          }
        } else if (this.cfUser===6) { //EL USUARIO ES MONOTRIBUTISTA
            this.editado.letra = 'C'
        }
        this.dirItems.push(que.tercero.direcciones[0])
        this.editado.direccion_id = this.dirItems[0].id
        this.editado.deposito_id = this.depItems[0].id
        this.editado.lista_id = this.lisItems[0].id

        //Cargo los articulos del pepdido
        this.articulos = [];
        for (let i=0; i<=que.items.length-1; i++) {
          this.articulos.push({ 
            articulo_id: que.items[i].articulo_id,
            codigo: que.items[i].articulo.codigo.substring(0,que.items[i].articulo.codigo.indexOf('@')),
            nombre: que.items[i].articulo.nombre,
            deposito_id: this.editado.deposito_id,
            unidad_id: que.items[i].articulo.um_venta_id,
            moneda_id: que.items[i].articulo.um_moneda_id,
            iva_id: que.items[i].articulo.iva_id,
            cantidad: que.items[i].cantidad,
            stock: que.items[i].cantidad,
            costo: que.items[i].costo,
            precio: que.items[i].precio,
            preciooriginal: que.items[i].precio,
            tasadescuento: que.items[i].tasadescuento,
            importedescuento: que.items[i].importedescuento,
            total: que.items[i].total,
            texto: que.items[i].texto,
            vencimiento: que.items[i].vencimiento
          })
        }

        // Como es EnBaseAOtro, dejo listo el array para luego notificarlo
        this.notificaEnBaseAOtro = [{
          user_id_desde: this.userId,
          user_id_hasta: que.tercero_id,
          comprobante_id: 0, // En la API debe grabar el venta.id del nuevo comprobante 
          tipo: 'F',
          detalles: 'Pedido Facturado',
          estado: 'P'
        }]
        // Como es EnBaseAOtro, debo marcar el comprobnate padre indicando que ya esta procesado
        this.notificaOriginal = [{
          comprobante_id: que.id,
          estado: 'F'
        }]

        this.calculos()
      }
    },
    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = this.modelo
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },
    print(item) {
      this.editedIndex = this.items.indexOf(item)
      if (this.editedIndex > -1) { // esta modificando
        // var doc = new jsPDF('p', 'pt', 'letter');

        debugger
        var doc = new jsPDF();

        doc.setFontStyle("bold");
        doc.setFontSize(20);
        doc.text ( 'GOHUApp S.A.', 15, 30 )
        doc.setFontSize(9);
        doc.text ( 'Razón Social:', 15, 47 )
        doc.text ( 'Domicilio Comercial:', 15, 53 )
        doc.text ( 'Condicion frente al IVA:', 15, 59 )

        doc.setFontSize(14);
        doc.text ( 'ORIGINAL', 93, 16 )

        doc.setFontSize(16);
        doc.text ( 'FACTURA', 120, 27 )

        doc.setFontSize(36);
        doc.text ( this.items[this.editedIndex].cpr.substring(4,5), 100.5, 32 )

        doc.setFontSize(9);
        doc.text ( 'Punto de Venta', 120, 35 )
        doc.text ( 'Comp. Nro', 157, 35 )
        doc.text ( 'Fecha de Emisión:', 120, 41 )
        doc.text ( 'CUIT', 120, 47 )
        doc.text ( 'Ingresos Brutos', 120, 53 )
        doc.text ( 'Fecha de Inicio de Actividades', 120, 59 )

        doc.setFontStyle("normal");
        doc.text ( moment(String(this.items[this.editedIndex].fecha)).format('L'), 148, 41 )
        doc.text ( this.items[this.editedIndex].cpr.substring(6,10), 145, 35 )
        doc.text ( this.items[this.editedIndex].cpr.substring(11,19), 175, 35 )
        doc.text ( this.items[this.editedIndex].tercero.cuit, 129, 47 )
        doc.text ( 'NO', 146, 53 )
        doc.text ( '01/01/2000', 168, 59 )

        doc.setFontStyle("bold");
        doc.text ( 'Vencimiento del Comprobante', 15, 72 )

        doc.text ( 'CUIT', 15, 83 )
        doc.text ( 'Condicion de IVA', 15, 89 )
        doc.text ( 'Condicion de Venta', 15, 95 )

        doc.text ( 'Apellido y Nombre Razón Social', 90, 83 )
        doc.text ( 'Domicilio', 90, 89 )

        // pie
        doc.text ( 'Subtotal', 155, 245 )
        doc.text ( '%Descuento', 155, 251 )
        doc.text ( 'Importe Des', 155, 257 )
        doc.text ( 'Gravado', 155, 263 )
        doc.text ( 'Exento', 155, 269 )
        doc.text ( 'IVA', 155, 275 )
        doc.text ( 'TOTAL', 155, 281 )

        doc.setFontStyle("normal");
        doc.text ( this.items[this.editedIndex].tercero.cuit, 24, 83 )
        doc.text ( this.items[this.editedIndex].tercero.nombre, 141, 83 )
        doc.text ( this.items[this.editedIndex].tercero.responsable.nombre, 43, 89 )
        doc.text ( 'CONTADO', 46, 95 )
        debugger
        doc.text ( this.items[this.editedIndex].tercero.direcciones[0].calle0.nombre+' '+
                   this.items[this.editedIndex].tercero.direcciones[0].numero+ ' (' +
                   this.items[this.editedIndex].tercero.direcciones[0].postal.codigo+ '-' +
                   this.items[this.editedIndex].tercero.direcciones[0].postal.nombre+ ')-' +
                   this.items[this.editedIndex].tercero.direcciones[0].postal.provincia.nombre+ '-' +
                   this.items[this.editedIndex].tercero.direcciones[0].postal.provincia.pais.nombre, 106, 89 )

        doc.rect(  10,  10, 190,  10);     // segundo rectangulo
        doc.rect(  10,  20, 190,  45);     // primer rectangulo
        doc.rect(  97,  20,  16,  20);     // rectangulo de la letra
        doc.line( 105,40.1, 105,  65);     // linea vertical 1
        doc.rect(  10,  66, 190,  10);     // segundo rectangulo
        doc.rect(  10,  77, 190,  25);     // segundo rectangulo
        doc.rect(  10, 240, 190,  45);     // rectangulo al pie

        doc.setFontStyle("normal");
        doc.setFontSize(8);
        doc.rect(  10, 103,  20,   7);     // codigo
        doc.text ( 'Codigo', 12.5, 107.5 )
        doc.rect(  31, 103,  50,   7);     // Descripcion
        doc.text ( 'Descripción', 33.5, 107.5 )
        doc.rect(  82, 103,  20,   7);     // Cantidad
        doc.text ( 'Cantidad', 85.5, 107.5 )
        doc.rect( 103, 103,  15,   7);     // U.Medida
        doc.text ( 'U.M.', 104.5, 107.5 )
        doc.rect( 119, 103,  20,   7);     // Precio
        doc.text ( 'Precio Unit.', 121.5, 107.5 )
        doc.rect( 140, 103,  10,   7);     // % Bonif
        doc.text ( '%Bonif.', 140.5, 107.5 )
        doc.rect( 151, 103,  20,   7);     // Imp.Bonif
        doc.text ( '$Bonif.', 152.5, 107.5 )
        doc.rect( 172, 103,  28,   7);     // TOTAL
        doc.text ( 'TOTAL', 174.5, 107.5 )
        doc.setLineWidth(0.1);

        /*
        doc.addFont('Tahoma', 'Tahoma', 'normal');
        doc.setFont("Tahoma");
        doc.setFontType("normal");
        doc.setFontSize(8);
        */

        let f = 114;
        /*
        doc.text ( '012345678901 012345678901234567890123456789012 012345679012 0123456789 0123456780123 012345 0123456789012 012345678901234567', 10.5, f )
        f += 5;
        doc.text ( 'aaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaa aaaaaaaaaa aaaaaaaaaaaaa aaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaaaaaaa', 10.5, f )
        f += 5;
        doc.text ( 'MMMMMMMMMMMM mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm mmmmmmmmmmmm mmmmmmmmmm mmmmmmmmmmmmm mmmmmm mmmmmmmmmmmmm mmmmmmmmmmmmmmmmmm', 10.5, f )
        f += 5;
        */

        for (let i = 0; i<=this.items[this.editedIndex].items.length-1; i++) {
          doc.text (this.items[this.editedIndex].items[i].articulo.codigo, 10.5, f )
          doc.text (this.items[this.editedIndex].items[i].articulo.nombre.substring(0,38), 31, f )
          doc.text (this.formatMoney(this.items[this.editedIndex].items[i].cantidad), 91, f)
          doc.text (this.formatMoney(this.items[this.editedIndex].items[i].precio), 125, f)
          doc.text (this.formatMoney(this.items[this.editedIndex].items[i].tasadescuento), 145, f)
          doc.text (this.formatMoney(this.items[this.editedIndex].items[i].importedescuento), 155, f)
          doc.text (this.formatMoney(this.items[this.editedIndex].items[i].total), 185, f)
          f += 5.5
        }

        doc.text (this.formatMoney(this.items[this.editedIndex].gravado), 180, 245)
        doc.text (this.formatMoney(this.items[this.editedIndex].tasadescuento), 180, 251)
        doc.text (this.formatMoney(this.items[this.editedIndex].importedescuento), 180, 257)
        doc.text (this.formatMoney(this.items[this.editedIndex].gravado), 180, 263)
        doc.text (this.formatMoney(this.items[this.editedIndex].exento), 180, 269)
        doc.text (this.formatMoney(this.items[this.editedIndex].iva), 180, 275)

        doc.setFontStyle("bold");
        doc.text (this.formatMoney(this.items[this.editedIndex].total), 180, 281)

        doc.output ('dataurlnewwindow');
      }
    },

    chequearArt(item){
      this.itemActual = item; // para luego laburar con el cuando seleccione articlos en pedidos
      this.artPed = []
      // Cargo en artPed cada unos de los items que me piden
      for (let i=0; i<=item.items.length-1; i++) {
        this.artPed.push({
          articulo_id: item.items[i].articulo.id,
          codigo: item.items[i].articulo.codigo,
          nombre: item.items[i].articulo.nombre,
          cttped: item.items[i].cantidad,
          stock: 0,
          cttent: 0,
          nuevostock: 0,
          estado: 'K'
        })
      }
      // Veo los stocks, no se como hacer con el tema sucursales, puede ser general o por cada una
      // Por ahi lo que conviene hacer es mostrar los stoks solo de los depositos de la sucursal
      // actual y trabajar con ellos, que el pedido salga igual si no hay
      // Si maneja demo y tiene stock ahi que luego hagan transferencias y listo.
      for (let i=0; i<=this.artPed.length-1; i++) {
        let iArt = this.artPed[i].articulo_id
        let iDep = this.depItems[0].id
        const k = HTTP().get('/stock/'+iArt+'/'+iDep)
          .then(({ data }) => {
            if(data) {
              this.artPed[i].stock = data
              if (this.artPed[i].stock >= this.artPed[i].cttped) {
                this.artPed[i].cttent = this.artPed[i].cttped
                this.artPed[i].estado = 'T'
              } else {
                this.artPed[i].cttent = data
                this.artPed[i].estado = 'P'
              }
            } else {
              this.artPed[i].stock = 0
              this.artPed[i].estado = 'N'
            }
            this.artPed[i].nuevostock = this.artPed[i].stock - this.artPed[i].cttent
        })
      }
      //debugger
      this.dialogPed = true;

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
    getEstadoPed (estado, accion) {
      let c = ''
      let e = ''
      if (estado==='T') {
        e = 'total'
        c = 'green'
      } else if (estado==='P') {
        e = 'Parcial'
        c = 'blue'
      } else if (estado==='N') {
        e = 'Parcial'
        c = 'red'
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },
    formatoImporte(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    formatoFecha(value) {
      return moment(String(value)).format('L')
    },
    listarHTTP:function(suc) {
      return HTTP().get('/'+this.modelo+'/'+suc)
        .then(({ data }) => {
          this.items = data;
      });
    },
    altaHTTP:function() {
      //debugger
      let pf = moment().format('YYYYMM');
      let s = this.sucursalFiscal

      if (this.editado.cpr=='FAC') {
        if (this.editado.letra=='A') { this.editado.comprobante_id = 1} 
        else if (this.editado.letra=='B') { this.editado.comprobante_id = 6 } 
        else if (this.editado.letra=='C') { this.editado.comprobante_id = 14 }
      } else if (this.editado.cpr=='NDD') {
        if (this.editado.letra=='A') { this.editado.comprobante_id = 2 } 
        else if (this.editado.letra=='B') { this.editado.comprobante_id = 7 } 
        else if (this.editado.letra=='C') { this.editado.comprobante_id = 15 }
      } else if (this.editado.cpr=='NDC') {
        if (this.editado.letra=='A') { this.editado.comprobante_id = 3 } 
        else if (this.editado.letra=='B') { this.editado.comprobante_id = 8 } 
        else if (this.editado.letra=='C') { this.editado.comprobante_id = 16 }
      }

      return HTTP().post('/ventas', {
        fecha: moment().format('YYYY-MM-DD'),
        perfiscal: pf,
        cpr: this.editado.cpr+'-'+this.editado.letra+' '+this.sucursalFiscal+'-'+'00000001',
        user_id: this.userId,
        sucursal_id: this.sucursal,
        tercero_id: this.editado.tercero_id,
        comprobante_id: this.editado.comprobante_id,
        direccion_id: this.editado.direccion_id,
        documento_id: this.editado.documento_id,
        mediodepago_id: 1, //this.editado.medio_id,             //VERRR
        lista_id: this.editado.lista_id,
        deposito_id: this.editado.deposito_id,
        vendedor_id: this.editado.tercero_id,
        moneda_id: this.editado.moneda_id,
        tasadescuento: this.editado.tasadescuento,
        importedescuento: this.editado.importedescuento*this.coef,
        gravado: this.editado.gravado*this.coef,
        exento: this.editado.exento*this.coef,
        iva: this.editado.iva*this.coef,
        total: this.editado.total*this.coef,
        regstk: true,
        estado: 'F',
        activo: true,
        articulos: this.articulos,
        valores: this.valores,
        pendientes: this.pendientes,
        notificacion: 0,
        notificaEnBaseAOtro: this.notificaEnBaseAOtro,
        notificaOriginal: this.notificaOriginal
      }).then(({ data }) => {
        this.listarHTTP(this.sucursal);
      });
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
    cancelar() {
      this.dialog = false;
      // debugger
      this.articulos = []
      this.editado = Object.assign({}, this.defaultItem);
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editedIndex = -1;
    },
    guardar() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      this.mensaje('¡Alta Exitosa!', 'blue', 1500) 

      // Si es efectivo debo agregar el pago en 'valores' para que grabe en efectivo
      //debugger
      for (let i=0; i<=this.articulos.length-1; i++) {
        this.articulos[i].stock*=(this.coef*-1)
      }

      if (Number(this.valEfectivo) !== 0) {
        this.valores.push({ 
          caja_id: this.caja,
          medio_id: 1,
          cpringreso_id: null,
          cpregreso_id: null,
          librador_id: null,
          librador_medio_id: null,
          cheque_id: null,
          fechafinanciera: null,
          fechasalida: null,
          importe: this.editado.total*this.coef,
          nrovalor: null,
          tipo: 'D',
          observ: 'PAGO EN EFECTIVO'
        })
      } 
      if (Number(this.valCtaCte) !== 0) {
        // Si es ctacte agrego en 'pendientes' para que grabe la cuenta corriente
        //debugger
        this.pendientes.push({ 
          comprobante_id: null,
          vencimiento: moment(new Date).add(30, 'd').format('YYYY-MM-DD'),
          importe: this.valCtaCte*this.coef,
          pendiente: this.valCtaCte*this.coef,
          concepto: 'EN CUENTA CORRIENTE'
        })
      }

      this.altaHTTP();
      this.cancelar();
    },
    nuevoArt() {
      this.editedIndexArt = -1;
      this.dialogArt = true;
      this.uniItems = [];
      this.editadoArt = Object.assign({}, this.defaultItemArt);
    },
    nuevoMed() {
      this.editedIndexMed = -1;
      this.dialogMed = true;
    },
    editarArt() {
    },
    guardarArt(item) {
      debugger
      const codig = this.editadoArt.codigo.substring( 0, this.editadoArt.codigo.indexOf('@'));
      this.editadoArt.codigo = codig;
      if (this.editedIndexArt > -1) { // esta modificando
        this.articulos[this.editedIndexArt].articulo_id = this.editadoArt.articulo_id
        this.articulos[this.editedIndexArt].codigo = this.editadoArt.codigo
        this.articulos[this.editedIndexArt].nombre = this.editadoArt.nombre
        this.articulos[this.editedIndexArt].deposito_id = this.editadoArt.deposito_id
        this.articulos[this.editedIndexArt].unidad_id = this.editadoArt.unidad_id
        this.articulos[this.editedIndexArt].moneda_id = this.editadoArt.moneda_id
        this.articulos[this.editedIndexArt].iva_id = this.editadoArt.iva_id
        this.articulos[this.editedIndexArt].cantidad = this.editadoArt.cantidad
        this.articulos[this.editedIndexArt].stock = this.editadoArt.stock
        this.articulos[this.editedIndexArt].costo = this.editadoArt.costo
        this.articulos[this.editedIndexArt].precio = this.editadoArt.precio
        this.articulos[this.editedIndexArt].preciooriginal = 0
        this.articulos[this.editedIndexArt].tasadescuento = this.editadoArt.tasadescuento
        this.articulos[this.editedIndexArt].importedescuento = this.editadoArt.importedescuento
        this.articulos[this.editedIndexArt].total = this.editadoArt.total
        this.articulos[this.editedIndexArt].texto = ''
        this.articulos[this.editedIndexArt].vencimiento = ''
      } else {
        // debugger
        this.articulos.push({ 
          articulo_id: this.editadoArt.articulo_id,
          codigo: this.editadoArt.codigo,
          nombre: this.editadoArt.nombre,
          deposito_id: this.editadoArt.deposito_id,
          unidad_id: this.editadoArt.unidad_id,
          moneda_id: this.editadoArt.moneda_id,
          iva_id: this.editadoArt.iva_id,
          cantidad: this.editadoArt.cantidad,
          stock: this.editadoArt.stock,
          costo: this.editadoArt.costo,
          precio: this.editadoArt.precio,
          preciooriginal: 0,
          tasadescuento: this.editadoArt.tasadescuento,
          importedescuento: this.editadoArt.importedescuento,
          total: this.editadoArt.total,
          texto: '',
          vencimiento: ''
        })
      }
      this.calculos()
      this.dialogArt = false;
    },

    calculos() {
      debugger
      let gra = 0
      let exe = 0
      let iva = 0
      let tas = 0
      let des = 0
      this.editado.importedescuento = 0;
      this.editado.gravado = 0;
      this.editado.exento = 0;
      this.editado.iva = 0;
      this.editado.total = 0;
      for(let i=0; i<=this.articulos.length-1; i++) {
        let base = this.articulos[i].total
        // debugger
        if (this.editado.tasadescuento>0) {
          des = base*(Number(this.editado.tasadescuento)/100) 
          base = base - des
        }
        if (this.articulos[i].iva_id==2) {
          exe = base
        } else {
          gra = base
          tas = this.ivaTasas[this.articulos[i].iva_id-1].tasa
          iva = (base*(1+(tas/100)))-base
        }
        this.editado.importedescuento += des
        this.editado.gravado += gra
        this.editado.exento += exe
        this.editado.iva += iva
        this.editado.total += exe+gra+iva
      }
      this.editado.importedescuento = this.roundTo(this.editado.importedescuento,2)
      this.editado.gravado = this.roundTo(this.editado.gravado,2)
      this.editado.exento = this.roundTo(this.editado.exento,2)
      this.editado.iva = this.roundTo(this.editado.iva,2)
      this.editado.total = this.roundTo(this.editado.total,2)
      this.valEfectivo = (this.editado.total-(this.valCtaCte+this.valValores))
    },
    calculosValores(cual) {
      //debugger
      if (cual=='E') {
        if (this.ctacte) {
          this.valCtaCte = this.roundTo((Number(this.editado.total) - (Number(this.valEfectivo)+Number(this.valValores))),2)
        } 
      } else if (cual=='C') {
        this.valEfectivo = this.roundTo((Number(this.editado.total) - (Number(this.valCtaCte)+Number(this.valValores))),2)
      }
      this.valDiferencia = this.roundTo((Number(this.editado.total) - (Number(this.valEfectivo)+Number(this.valCtaCte)+Number(this.valValores))),2)
    },
    guardarMed() {
    },
    guardarPed() {
    },
    cancelarArt() {
      this.dialogArt = false;
    },
    cancelarPed() {
      this.dialogPed = false;
    },
    cancelarMed() {
      this.dialogMed = false;
    },

  },
};
</script>