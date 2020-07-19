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
          <v-system-bar color="indigo darken-2" dark></v-system-bar>
          <v-toolbar flat color="indigo">
            <template v-slot:extension>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="cyan accent-3" :class="tl"
                    @click="nuevo('com')" v-on="on">Com
                  </v-btn>
                </template>
                <span>Nueva Compra</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="cyan accent-3" :class="tl"
                    @click="nuevo('gas')" v-on="on">Gas
                  </v-btn>
                </template>
                <span>Nuevo Gasto</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="cyan accent-3" :class="tl"
                    @click="nuevo('rem')" v-on="on">Rem
                  </v-btn>
                </template>
                <span>Nuevo Remito</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab color="cyan accent-3" :class="tl"
                    @click="nuevo('ped')" v-on="on">Ped
                  </v-btn>
                </template>
                <span>Nuevo Pedido</span>
              </v-tooltip>
            </template>
            <v-toolbar-title
              class="white--text" @click="listarHTTP()" v-model="sucursal">
              Central de Compras sucursal ({{ sucursal }}) caja ({{ caja }})
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->

            <!-- DIALOGO DE LA CABECERA -->
            <v-dialog v-model="dialogCab" max-width="550px" :fullscreen="true">
              <template v-slot:activator="{ on }"></template>
              <v-card>
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

                <!--// CABECERA DE LA COMPRA // -->
                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="5" sm="5" md="5">
                          <v-autocomplete
                            v-model="editado.tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTerceros"
                            :search-input.sync="searchTerceros"
                            item-text="nombre"
                            item-value="id"
                            autofocus
                            label="Proveedor"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-select
                            label="Comprobante" v-model="editado.afipcpr_id"
                            :items="cprItems" item-value="id" item-text="abrev"
                            autocomplete return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            v-model="editado.afipSuc"
                            @change="afipsuc()"
                            label="Suc">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="editado.afipNro"
                            label="Numero"
                            @change="afipnro()">
                          </v-text-field>
                        </v-col>

                        <v-col cols="2" sm="2" md="2">
                          <!--<input type="datetime-local" name="datetime">-->
                          <v-menu
                            ref="menu1"
                            v-model="menu1"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="fecha"
                                label="Fecha"
                                hint="MM/DD/YYYY"
                                persistent-hint
                                prepend-icon="event"
                                v-bind="attrs"
                                @blur="date = parseDate(fecha)"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date"
                              no-title
                              locale="es"
                              @input="menu1 = false">
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-spacer></v-spacer>

                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            v-model="editado.perfiscal"
                            label="Per.Fiscal">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
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
                        <v-col cols="1" sm="1" md="1">
                          <v-select
                            label="Moneda" v-model="editado.moneda_id"
                            :items="monItems" item-value="id" item-text="simbolo" return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-select
                            label="Medio de Pago" v-model="editado.medio_id"
                            :items="medItems" item-value="id" item-text="nombre" return-object>
                          </v-select>
                        </v-col>
                      </v-row>

                      <!--// TOTALES DEL COMPROBANTE // -->
                      <v-row>
                        <v-col cols="7" sm="7" md="7">
                          <v-row>
                            <v-col cols="4" sm="4" md="4">
                              <v-text-field
                                v-model="editado.total"
                                label="Total del Comprobante"
                                @change="calculos('total')">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" sm="4" md="4">
                              <v-text-field
                                v-model="editado.retib"
                                label="Ret.Ing.Brutos"
                                @change="calculos('retib')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="4" sm="4" md="4">
                              <v-text-field
                                v-model="editado.retgan"
                                label="Ret.Ganancias"
                                @change="calculos('retgan')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="4" sm="4" md="4">
                              <v-text-field
                                v-model="editado.retiva"
                                label="Ret.IVA"
                                @change="calculos('retiva')">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" sm="4" md="4">
                              <v-text-field
                                v-model="editado.exento"
                                label="Exento"
                                @change="calculos('exento')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="4" sm="4" md="4">
                              <v-text-field
                                v-model="editado.gravado"
                                label="Gravado"
                                @change="calculos('gravado')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="4" sm="4" md="4">
                              <v-text-field
                                v-model="editado.iva"
                                label="IVA"
                                @change="calculos('iva')">
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-col>

                        <!--// DETALLES DEL IVA // -->
                        <v-col cols="5" sm="5" md="5">
                          <v-data-table
                            :headers="headersTasasDeIVA"
                            :items="tasasIVA"
                            class="elevation-3"
                            hide-default-footer>
                            <template v-slot:top>
                              <v-dialog v-model="dialogTasaArt" max-width="900px">
                                <template v-slot:activator="{ on, attrs }">
                                </template>
                                <v-card>
                                  <v-card-title>
                                    <span class="headline">TASAS DE IVA</span>
                                  </v-card-title>
                                  <v-card-text>
                                    <v-container>
                                    </v-container>
                                  </v-card-text>
                                  <v-card-actions>
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
                                class="mr-2" fab x-small color="white"
                                @click="activarDesactivarDep(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>

                            <template v-slot:item.base="props">
                              <v-edit-dialog
                                :return-value.sync="props.item.base"
                                @save="save(props.item)"
                                @cancel="cancel(props.item)"
                                @open="open(props.item)"
                                @close="close(props.item)"> {{ props.item.base }}
                                <template v-slot:input>
                                  <v-text-field
                                    v-model="props.item.base"
                                    :rules="[max25chars]"
                                    label="Editar"
                                    single-line
                                    counter
                                  ></v-text-field>
                                </template>
                              </v-edit-dialog>
                            </template>

                          </v-data-table>
                        </v-col>
                      </v-row>

                      <!--// PIE DEL FORMULARIO CABECERA // -->
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
                              <v-menu
                                ref="menu2"
                                v-model="menu2"
                                :disabled="!ctacte"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="vencimiento"
                                    dense outlined
                                    :disabled="!ctacte"
                                    label="Vencimiento"
                                    hint="MM/DD/YYYY"
                                    persistent-hint
                                    prepend-icon="event"
                                    v-bind="attrs"
                                    @blur="date = parseDate(vencimiento)"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="date"
                                  no-title
                                  locale="es"
                                  @input="menu2 = false">
                                </v-date-picker>
                              </v-menu>
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

                          <!--// TABLA DE VALORES // -->
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
            <!--// FIN DE LA CABECERA DE LA COMPRA // -->

            <!--// ARTICULOS // -->
            <v-dialog v-model="dialogArt" max-width="550px" :fullscreen="true">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-card-title  class="cyan white--text">
                  <span class="headline">{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <span class="text--right">
                    <v-btn
                      color="blue-grey" class="ma-2 white--text" @click="cancelarArt">Cancelar
                    </v-btn>
                    <v-btn
                      color="teal accent-4" class="ma-2 white--text" @click="guardarArt">Guardar
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
                            :headers="headersArt"
                            :items="articulos"
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
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            label="Codigo de Barra"
                                            class="caption"
                                            v-model="editadoArt.codbar">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                          <v-autocomplete
                                            v-model="editadoArt.articulo_id"
                                            :items="itemsArticulos"
                                            :loading="isLoadingArticulos"
                                            :search-input.sync="searchArticulos"
                                            dense
                                            class="caption"
                                            item-text="nombre"
                                            item-value="id"
                                            label="Articulo"
                                            placeholder="Escriba para buscar"
                                            prepend-icon="mdi-database-search">
                                          </v-autocomplete>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="4" sm="4" md="4">
                                          <v-select
                                            label='Deposito' v-model='editadoArt.deposito_id'
                                            :items='depItems' item-value='id' item-text='nombre'
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
                            v-model="editado.gravado"
                            label="Gravado">
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
          <v-btn v-if="item.estado='P'"
            class="mr-2" fab x-small color="white"
            @click="cargarArt(item)">
            <v-icon dark>mdi-barcode</v-icon>
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
import { mapGetters, mapMutations } from 'vuex';
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

    // fecha
    date: new Date().toISOString().substr(0, 10),
    fecha: moment().format('MM-DD-YYYY'),
    vencimiento: moment().format('MM-DD-YYYY'),
    menu1: false,
    menu2: false,

    snack: false,
    snackColor: '',
    snackText: '',

    cfUser: '',
  //sucursal: '',
    coef: 1,  // para signar los comprobantes + o -
    modelo: 'compras',
    queMostrar: 'C',
    ctacte: false,
    formTitle: '',
    formTitleArt: '',
    formTitleMed: '',
    itemActual: null,
    tl: "text-lowercase",
    medFijos: [],
    cprItems: [],
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
    max25chars: v => v.length <= 25 || 'Input too long!',
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '',           // para el cuadro de búsqueda de datatables
    searchTerceros: '',   // para el cuadro de búsqueda de datatables
    searchArticulos: '',  // para el cuadro de búsqueda de datatables
    dialogCab: false,     // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogArt: false,     // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogEditArt: false, // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogTasaArt: false, // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogMed: false,     // para que la ventana de dialogo o modal no aparezca automáticamente
    items: [],
    tasasIVA: [],
    articulos: [],
    valores: [],
    pendientes: [],

    valEfectivo: 0,
    valCtaCte: 0,
    valValores: 0,
    valDiferencia: 0,

    // definimos los headers de la datatables
    headers: [
      /*
      {
        text: 'ID',
        align: 'left',
        sortable: false,
        value: 'id',
      },
      */
      { text: 'COMPROBANTE', value:'cpr'},
      { text: 'FECHA', value:'fecha'},
      { text: 'CLIENTE', value:'tercero.nombre'},
      { text: 'TOTAL', value:'total'},
      { text: 'PENDIENTE', value:'pendientes[0].pendiente'},
      { text: 'ESTADO', value:'estado'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersTasasDeIVA: [
      { text: 'ACCIONES', value: 'accion', sortable: false },
      { text: 'TASA', value:'tasa'},
      { text: 'BASE', value:'base'},
      { text: 'IVA', value:'iva'},
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
      fecha: moment().format('DD-MM-YYYY'),
      vencimiento: moment().format('DD-MM-YYYY'),
      perfiscal: '',
      tercero_id: '',
      afipcpr_id: '',
      afipsuc: '',
      afipnro: '',
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
      retib: 0,
      retgan: 0,
      retiva: 0,
      total: 0,
    },
    defaultItem: {
      id: '',
      fecha: moment().format('DD-MM-YYYY'),
      vencimiento: moment().format('DD-MM-YYYY'),
      perfiscal: '',
      tercero_id: '',
      afipcpr_id: '',
      afipsuc: '',
      afipnro: '',
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
      retib: 0,
      retgan: 0,
      retiva: 0,
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
    isLoadingCprs: false,
    search: null,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId', 'sucursal', 'sucursalFiscal', 'caja']),
    ...mapMutations(['alert','closeAlert']),

    computedDateFormatted () {
      return this.formatDate(this.date)
    },
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
    date (val) {
      // debugger
      this.fecha = this.formatDate(this.date)
    },
    searchTerceros (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      // Lazily load input items
      return HTTP().get('/usersproveedores')
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
            return HTTP().get('/tercero/'+valor)
              .then(({ data }) => {
                this.medItems = [];
                this.lisObj = [];
                // debugger
                let rid = data[0].tercero.responsable.id
                if (this.cfUser===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO
                  if(rid===1 || rid===2 || rid===9 || rid===11) {
                    this.editado.letra = 'A'
                  } else {
                    this.editado.letra = 'B'
                  }
                } else if (this.cfUser===6) { //EL USUARIO ES MONOTRIBUTISTA
                    this.editado.letra = 'C'
                }

                this.editado.documento = data[0].tercero.documento.nombre;
                this.editado.documento_id = data[0].tercero.documento.id;
                this.editado.documentoNumero = data[0].tercero.cuit;
                this.editado.responsableAbrev = data[0].tercero.responsable.abrev;

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
                //debugger
                this.editado.medio_id = this.medItems[0]

                // debugger
                if (data[0].terceroListas.length > 0) {
                  data[0].terceroListas.forEach(element => {
                    entro = true
                    this.lisItems.push(element.lista)
                    this.lisObj.push(element.lista)
                  })
                }
                this.editado.lista_id = this.lisItems[0].id

                const a = HTTP().get('/afipcomprobantes')
                  .then(({ data }) => {
                    data.forEach(element => {
                      this.cprItems.push(element)
                    })
                  })

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
      return HTTP().get('/userarticulos')         // /userarticulos
        .then(({ data }) => {

          // debugger
          this.entriesArticulos = []
          data.forEach(e => {
            let art = e.articulo
            this.entriesArticulos.push(art)
          })

          let ipos = -1
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
          return HTTP().get('/precio/'+iArt+'/'+iLis)
            .then(({ data }) => {
              this.editadoArt.precio = data[0].precio
              this.editadoArt.total = data[0].precio
              this.editadoArt.tasadesuento = 0
              this.editadoArt.importedescuento = 0
              this.uniItems = this.entriesArticulos[ipos].umventa;
              this.monItems = this.entriesArticulos[ipos].moneda;
              this.ivaItems = this.entriesArticulos[ipos].iva;
              this.editadoArt.deposito_id = this.depItems[0]
              this.editadoArt.unidad_id = this.uniItems.id
              this.editadoArt.unidadNombre = this.uniItems.nombre
              this.editadoArt.moneda_id = this.monItems.id
              this.editadoArt.monedaNombre = this.monItems.simbolo
              this.editadoArt.iva_id = this.ivaItems.id
              this.editadoArt.ivaNombre = this.ivaItems.nombre
          })
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingArticulos = false))
    },
    searchCprs (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingCprs) return
      this.isLoadingCprs = true
      // Lazily load input items
      return HTTP().get('/afipcomprobantes')
        .then(({ data }) => {
          this.entriesCprs = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingCprs = false))
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
      return this.listarHTTP()
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

    this.tasasIVA.push({tasa:'0', base: 0, iva: 0})
    this.tasasIVA.push({tasa:'2.5', base: 0, iva: 0})
    this.tasasIVA.push({tasa:'5', base: 0, iva: 0})
    this.tasasIVA.push({tasa:'10.5', base: 0, iva: 0})
    this.tasasIVA.push({tasa:'21', base: 0, iva: 0})
    this.tasasIVA.push({tasa:'27', base: 0, iva: 0})

  },
  methods: {
    afipsuc() {
      this.editado.afipSuc = this.editado.afipSuc.padStart(4,'0')
    },
    afipnro() {
      this.editado.afipNro = this.editado.afipNro.padStart(8,'0')
    },
    save (item) {
      item.iva = this.roundTo(item.base*((Number(item.tasa)/100)),2)
      this.snack = true
//    this.snackColor = 'success'
//    this.snackText = 'Data saved'
    },
    cancel (item) {
//    debugger
      this.snack = false
//    this.snackColor = 'error'
//    this.snackText = 'Canceled'
    },
    open (item) {
//    debugger
      let res = this.editado.gravado;
      for (let i=0; i<=this.tasasIVA.length-1; i++) {
        res -= this.tasasIVA[i].base
      }
      item.base = this.roundTo(res,2);
      this.snack = true
//    this.snackColor = 'info'
//    this.snackText = 'Dialog opened'
    },
    close (item) {
      this.snack = false
//    console.log('Dialog closed')
    },
    formatDate (date) {
      // debugger
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      // debugger
      if (!date) return null
      const [month, day, year] = date.split('-')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    cobrar(item) {
      if (!item.pendientes[0]) return false
      if (item.pendientes[0].pendiente>0) {
        return true
      } else {
        return false
      }
    }, 
    cargarArt(item) {
      // debugger
      // this.dialoCab = false;
      this.dialogArt = true;
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
      this.dialogCab = true;
      this.dialogArt = false;
      this.dialogEditArt = false;
      this.lisItems = [];
      this.depItems = [];

      this.searchTerceros = '';
      this.searchArticulos = '';
      this.isLoadingTerceros = false;
      this.isLoadingCprs = false;

      this.valEfectivo = 0;
      this.valCtaCte = 0;
      this.valValores = 0;
      this.valDiferencia = 0;

      // BUSCO LOS DEPOSITOS HABILITADOS EN LA SUCURSAL
      const b = HTTP().get('/user/'+this.userId)
        .then(({ data }) => {
          // debugger

          /*
          TENGO EL ID DE LA SUCURSAL DE LA BD EN 'sucursal' 
          pero necesito la posicion que ocupa dentro
          de la matriz data[0].sucursales
          */
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

      this.formTitleArt = 'Nuevo Item';
      this.formTitleMed = 'Nuevo Valor';
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editado = Object.assign({}, this.defaultItem);
      this.editado.fecha = moment().format('DD-MM-YYYY');
      this.editado.perfiscal = moment().format('YYYY-MM');
      if (que === 'com') {
        this.formTitle = 'Nuevo Comprobante Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'FAC';
        this.coef = 1;
      } else if (que === 'gas') {
        this.formTitle = 'Nuevo Gasto Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'FAC';
        this.coef = 1;
      } else if (que === 'rem') {
        this.formTitle = 'Nuevo Remito Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'REM';
        this.coef = 1;
      } else if (que === 'ped') {
        this.formTitle = 'Nuevo Pedido Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'PED';
        this.coef = 1;
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

        doc.text ( this.items[this.editedIndex].direccion.calle0.nombre+' '+
                   this.items[this.editedIndex].direccion.numero+ ' (' +
                   this.items[this.editedIndex].direccion.postal.codigo+ '-' +
                   this.items[this.editedIndex].direccion.postal.nombre+ ')-' +
                   this.items[this.editedIndex].direccion.postal.provincia.nombre+ '-' +
                   this.items[this.editedIndex].direccion.postal.provincia.pais.nombre, 106, 89 )

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
    formatoImporte(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    formatoFecha(value) {
      return moment(String(value)).format('L')
    },
    listarHTTP:function() {
      // debugger
      return HTTP().get('/'+this.modelo+'/'+this.sucursal)
        .then(({ data }) => {
          this.items = data;
      });
    },
    altaHTTP:function() {
      // debugger
      this.editado.perfiscal = this.editado.perfiscal.substring(0,4)+this.editado.perfiscal.substring(5,7)
      this.editado.fecha = this.editado.fecha.substring(6,10)+'-'+this.editado.fecha.substring(3,5)+'-'+this.editado.fecha.substring(0,2)
      this.editado.estado = 'F'
      if (valCtaCte!==0) {
        this.editado.estado = 'P'
      }
      return HTTP().post('/compras', {
        fecha: this.editado.fecha,
        perfiscal: this.editado.perfiscal,
        tipo: 'CO',
        cpr: this.editado.afipcpr_id.abrev+' '+this.editado.afipSuc+'-'+this.editado.afipNro,
        user_id: this.userId,
        sucursal_id: this.sucursal,
        tercero_id: this.editado.tercero_id,
        direccion_id: this.editado.direccion_id,
        documento_id: this.editado.documento_id,
        mediodepago_id: 1, //this.editado.medio_id,
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
        estado: this.editado.estado,
        activo: true,
        articulos: this.articulos,
        valores: this.valores,
        pendientes: this.pendientes,
      }).then(({ data }) => {
        this.listarHTTP();
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
      this.dialogCab = false;
    //debugger
      this.articulos = []
      this.editado = Object.assign({}, this.defaultItem);
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editedIndex = -1;
    },
    cancelarArt() {
      // debugger
      // this.dialoCab = true;
      this.dialogArt = false;
      this.articulos = []
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editedIndexArt = -1;
    },
    cancelarEditArt() {
      // debugger
      this.dialogEditArt = false;
      this.editedIndexArt = -1;
    },
    guardar() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      this.mensaje('¡Alta Exitosa!', 'blue', 1500) 

      // Si es efectivo debo agregar el pago en 'valores' para que grabe en efectivo
      // debugger
      for (let i=0; i<=this.articulos.length-1; i++) {
        this.articulos[i].cantidad*=this.coef
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
        // debugger
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
      this.dialogEditArt = true;
      this.uniItems = [];
      this.editadoArt = Object.assign({}, this.defaultItemArt);
    },
    nuevoMed() {
      this.editedIndexMed = -1;
      this.dialogMed = true;
    },
    editarArt() {
    },
    guardarEditArt() {
      const part1 = this.editadoArt.codigo.substring( 0, this.editadoArt.codigo.indexOf('@')+1);
      const codig = this.editadoArt.codigo.substring( this.editadoArt.codigo.indexOf('@')+1, this.editadoArt.codigo.indexOf('$'));
      const part2 = this.editadoArt.codigo.substring( this.editadoArt.codigo.indexOf('$'));
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
      this.dialogEditArt = false;
    },

    calculos(cual) {
      let tot = Number(this.editado.total)
      let gra = Number(this.editado.gravado)
      let exe = Number(this.editado.exento)
      let iva = Number(this.editado.iva)
      let retib = Number(this.editado.retib)
      let retgan = Number(this.editado.retgan)
      let retiva = Number(this.editado.retiva)
      if (cual=='total') {
        gra = this.roundTo( ( ( tot - (retib+retgan+retiva) ) / 1.21 ), 2 )
        iva = this.roundTo( ( tot - ( gra+exe+retib+retgan+retiva ) ) , 2 )
      } else if (cual=='retib' || cual=='retgan' || cual=='retiva') {
        gra = this.roundTo( ( ( tot - (retib+retgan+retiva) ) / 1.21 ), 2 )
        iva = this.roundTo( ( tot - ( gra+exe+retib+retgan+retiva ) ) , 2 )
      } else if (cual=='gravado') {
        iva = this.roundTo( ( tot - ( gra+exe+retib+retgan+retiva ) ) , 2 )
      } else if (cual=='exento') {
        gra = this.roundTo( ( ( (tot-exe) - (retib+retgan+retiva) ) / 1.21 ), 2 )
        iva = this.roundTo( ( tot - ( gra+exe+retib+retgan+retiva ) ) , 2 )
      } else if (cual=='iva') {
        gra = this.roundTo( ( tot - ( iva+exe+retib+retgan+retiva ) ) , 2 )
      }
      this.editado.total = tot
      this.editado.gravado = gra
      this.editado.exento = exe
      this.editado.iva = iva
      this.editado.retib = retib
      this.editado.retgan = retgan
      this.editado.retiva = retiva

      // ASIGNO EL VALOR INICIAL DE LA COMPRA COMO EFECTIVO
      debugger
      if (this.valEfectivo==0 && this.valCtaCte==0 && this.valValores == 0)
        this.valEfectivo = (this.editado.total-(this.valCtaCte+this.valValores))

    },
    calculosValores(cual) {
      // debugger
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
    cancelarMed() {
      this.dialogMed = false;
    },
    guardarArt() {
    }

  },
};
</script>