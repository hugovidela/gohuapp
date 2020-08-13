<template>
  <div id="app">
    <!--
    <h1>gohuApp</h1>
    <p>@2020</p>
    <p> y las notificaciones son:{{ notificaciones }}</p>
    -->
    <v-layout align-start>
      <v-flex>

        <v-container fluid>
          <v-row justify="space-around">
            <v-col v-for="(nota, idx) in $store.state.notificaciones" v-bind:key="idx">
              <v-card max-width="230" class="mx-auto">

                <div v-if="nota.comprobante!=null">

                  <v-list-item>
                    <v-list-item-avatar color="grey">
                      <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="caption">
                        {{nota.comprobante.cpr}}
                      </v-list-item-title>
                      <v-list-item-subtitle></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-card-subtitle class="pb-0">{{nota.comprobante.cpr}}</v-card-subtitle>
                  <v-card-text class="text--primary">
                    <div>${{nota.comprobante.total}}</div>
                    <div>Envia: {{nota.userdesde.username}}</div>
                    <span class="caption" v-for="(not, idn) in nota.notas" v-bind:key="idn">
                      {{ not.nota }}
                    </span>
                    <div>{{fecha(nota.comprobante.created_at)}}</div>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn v-show="nota.paraprocesar==true"
                      text color="deep-purple accent-4" @click="verCpr(nota)">Ver
                    </v-btn>
                    <v-btn v-show="nota.paraprocesar==true"
                      text color="deep-purple accent-4" @click="impCpr(nota)">Importar
                    </v-btn>
                  </v-card-actions>

                </div>

                <div v-else>

                  <v-list-item>
                    <v-list-item-avatar color="grey">
                      <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="caption">
                        {{nota.detalles}}
                      </v-list-item-title>
                      <v-list-item-subtitle></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-card-subtitle class="pb-0">{{nota.detalles}}</v-card-subtitle>
                  <v-card-text class="text--primary">
                    <div>Envia: {{nota.userdesde.username}}</div>
                    <div>
                      Lea en el apartado 'Vinculos', las ventajas de estar vinculado
                      a sus clientes y/o proveedores.
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn v-show="nota.paraprocesar==true"
                      text color="deep-purple accent-4" @click="aceptarVinculo(nota)">Aceptar
                    </v-btn>
                    <v-btn v-show="nota.paraprocesar==true"
                      text color="deep-purple accent-4" @click="rechazarVinculo(nota)">Rechazar
                    </v-btn>
                  </v-card-actions>

                </div>

              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <!--
        <v-data-table
          :headers="headers"
          :items="notificaciones"
          dense
          class="elevation-3"
          :footer-props="footerProps">
          <template v-slot:top>
            <v-system-bar color="indigo darken-2" dark>
            </v-system-bar>
            <v-toolbar flat color="indigo">
              <v-toolbar-title class="white--text">Notificaciones</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip :color="getColor(item.estado)" dark>{{ getEstado(item.estado) }}</v-chip>
          </template>
          <template v-slot:item.accion="{ item }">
            <v-btn
              class="mr-2" fab x-small color="white"
              @click="activarDesactivar(item)">
              <v-icon dark>mdi-checkbox-marked-outline</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        -->
      </v-flex>
    </v-layout>
  </div>
</template>


<script>
 /* eslint-disable */
// import Register from ' ./views/Register';
import HTTP from '../http';
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import moment from 'moment';
import jsPDF from 'jspdf'

export default {
  data: () => ({
    noti: [],
    /*
    item: [],
    headers: [
      { text: 'ENVIA', value:'userdesde.username'},
      { text: 'COPROBANTE', value:'comprobante.cpr'},
      { text: 'DETALLES', value:'detalles'},
      { text: 'ESTADO', value:'estado'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    */
  }),
  created() {
    moment.locale('es');
    //let a = this.userId;
    //let b = this.sucursal;
    //let c = this.sucursales;
    //let d = this.notificaciones;
    //debugger
    //this.noti = this.$store.state.notificaciones.notas;
    //debugger
    // this.item = this.notificaciones;
  },  
  computed: {
    /*
    ...mapGetters(['notificaciones'],
                   'authentication', ['isLoggedIn', 'userName', 'userId', 'sucursal', 'sucursalFiscal', 'caja']),
    */
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState('authentication', [
      'loginEmail',
      'loginPassword',
      'loginUserId',
      'loginError'],
      [
        'sucursal',
        'sucursales',
        'sucursalFiscal',
        'notificaciones',
        'caja',
        'colorSucursal',
        'empresa',
        'operario',
        'level',
      ]),

  },
  methods: {
    ...mapMutations([
        'setSucursal',
        'setSucursales',
        'setSucursalFiscal',
        'setNotificaciones',
        'actNotificacion',
        'setCaja',
        'setColorSucursal',
        'setEmpresa',
        'setOperario',
        'setLevel',
      ]),
    fecha(f) {
      let a = f.substring(8,10)+'/'+f.substring(5,7)+'/'+f.substring(0,4)+' '+f.substring(11,19)
      return a
    },
    /*
    getColor (estado) {
      return (estado === 'P') ? 'red' : 'orange'
    },
    getEstado(estado) {
      if(estado=='P') {
        return 'Pendiente'
      } else {
        return 'No se sabe'
      }
    },
    */
    impCpr(it) {

      // Si es efectivo debo agregar el pago en 'valores' para que grabe en efectivo
      debugger
      let articulos = []
      for (let i=0; i<=it.comprobante.items.length-1; i++) {
        articulos.push(it.comprobante.items[i])
        articulos[i].deposito_id = null
      }

      debugger
      const a = HTTP().get('/empresa/'+it.user_id_desde)
        .then(({ data }) => {
          
          debugger
          if (it.comprobante.tipo=='CO') {

            return HTTP().post('/ventas', {
              fecha: it.comprobante.fecha.substring(0,10),
              perfiscal: it.comprobante.perfiscal,
              tipo: 'VE',
              cpr: it.comprobante.cpr,
              user_id: this.userId,
              sucursal_id: this.sucursal,
              tercero_id: data[0].tercero_id,
              comprobante_id: it.comprobante.comprobante_id,
              direccion_id: it.comprobante.direccion_id,
              documento_id: it.comprobante.documento_id,
              mediodepago_id: null,
              lista_id: null,
              deposito_id: null,
              vendedor_id: null,
              moneda_id: it.comprobante.moneda_id,
              tasadescuento: it.comprobante.tasadescuento,
              importedescuento: it.comprobante.importedescuento,
              retiva: 0,
              retgan: 0,
              retib: 0,
              gravado: it.comprobante.gravado,
              exento: it.comprobante.exento,
              iva: it.comprobante.iva,
              total: it.comprobante.total,
              regstk: true,
              estado: 'P',
              activo: true,
              articulos: articulos,
              valores: [],
              pendientes: [],
              notificacion: it.id,
            }).then(({ data }) => {
              this.mensaje('¡Importación Exitosa!', 'blue', 1500) 
            });

          } else {

            return HTTP().post('/compras', {
              fecha: it.comprobante.fecha.substring(0,10),
              perfiscal: it.comprobante.perfiscal,
              tipo: 'CO',
              cpr: it.comprobante.cpr,
              user_id: this.userId,
              sucursal_id: this.sucursal,
              tercero_id: data[0].tercero_id,
              comprobante_id: it.comprobante.comprobante_id,
              direccion_id: it.comprobante.direccion_id,
              documento_id: it.comprobante.documento_id,
              mediodepago_id: null,
              lista_id: null,
              deposito_id: null,
              vendedor_id: null,
              moneda_id: it.comprobante.moneda_id,
              tasadescuento: it.comprobante.tasadescuento,
              importedescuento: it.comprobante.importedescuento,
              retiva: 0,
              retgan: 0,
              retib: 0,
              gravado: it.comprobante.gravado,
              exento: it.comprobante.exento,
              iva: it.comprobante.iva,
              total: it.comprobante.total,
              regstk: true,
              estado: 'P',
              activo: true,
              articulos: articulos,
              valores: [],
              pendientes: [],
              notificacion: it.id,
            }).then(({ data }) => {
              this.mensaje('¡Importación Exitosa!', 'blue', 1500) 
            });
          }
      })
    },
    verCpr(it) {

        // debugger
        let item = it.comprobante;
        var doc = new jsPDF();

        doc.setFontStyle("bold");
        doc.setFontSize(20);
        doc.text ( item.tercero.nombre, 15, 30 )
        doc.setFontSize(9);
        doc.text ( 'Razón Social:', 15, 47 )
        doc.text ( 'Domicilio Comercial:', 15, 53 )
        doc.text ( 'Condicion frente al IVA:', 15, 59 )

        doc.setFontSize(14);
        doc.text ( 'ORIGINAL', 93, 16 )

        doc.setFontSize(16);
        doc.text ( 'FACTURA', 120, 27 )

        doc.setFontSize(36);
        doc.text ( item.cpr.substring(4,5), 100.5, 32 )

        doc.setFontSize(9);
        doc.text ( 'Punto de Venta', 120, 35 )
        doc.text ( 'Comp. Nro', 157, 35 )
        doc.text ( 'Fecha de Emisión:', 120, 41 )
        doc.text ( 'CUIT', 120, 47 )
        doc.text ( 'Ingresos Brutos', 120, 53 )
        doc.text ( 'Fecha de Inicio de Actividades', 120, 59 )

        doc.setFontStyle("normal");
//        doc.text ( moment(String(this.items[this.editedIndex].fecha)).format('L'), 148, 41 )
//        doc.text ( this.items[this.editedIndex].cpr.substring(6,10), 145, 35 )
//        doc.text ( this.items[this.editedIndex].cpr.substring(11,19), 175, 35 )
//        doc.text ( this.items[this.editedIndex].tercero.cuit, 129, 47 )
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
        doc.text ( item.tercero.cuit, 24, 83 )
        doc.text ( item.tercero.nombre, 141, 83 )
//        doc.text ( this.items[this.editedIndex].tercero.responsable.nombre, 43, 89 )
        doc.text ( 'CONTADO', 46, 95 )

//        doc.text ( this.items[this.editedIndex].direccion.calle0.nombre+' '+
//                   this.items[this.editedIndex].direccion.numero+ ' (' +
//                   this.items[this.editedIndex].direccion.postal.codigo+ '-' +
//                   this.items[this.editedIndex].direccion.postal.nombre+ ')-' +
//                   this.items[this.editedIndex].direccion.postal.provincia.nombre+ '-' +
//                   this.items[this.editedIndex].direccion.postal.provincia.pais.nombre, 106, 89 )

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

        let f = 114;

//        for (let i = 0; i<=this.items[this.editedIndex].items.length-1; i++) {
//          doc.text (this.items[this.editedIndex].items[i].articulo.codigo, 10.5, f )
//          doc.text (this.items[this.editedIndex].items[i].articulo.nombre.substring(0,38), 31, f )
//          doc.text (this.formatMoney(this.items[this.editedIndex].items[i].cantidad), 91, f)
//          doc.text (this.formatMoney(this.items[this.editedIndex].items[i].precio), 125, f)
//          doc.text (this.formatMoney(this.items[this.editedIndex].items[i].tasadescuento), 145, f)
//          doc.text (this.formatMoney(this.items[this.editedIndex].items[i].importedescuento), 155, f)
//          doc.text (this.formatMoney(this.items[this.editedIndex].items[i].total), 185, f)
//          f += 5.5
//        }

//        doc.text (this.formatMoney(this.items[this.editedIndex].gravado), 180, 245)
//        doc.text (this.formatMoney(this.items[this.editedIndex].tasadescuento), 180, 251)
//        doc.text (this.formatMoney(this.items[this.editedIndex].importedescuento), 180, 257)
//        doc.text (this.formatMoney(this.items[this.editedIndex].gravado), 180, 263)
//        doc.text (this.formatMoney(this.items[this.editedIndex].exento), 180, 269)
//        doc.text (this.formatMoney(this.items[this.editedIndex].iva), 180, 275)
//        doc.setFontStyle("bold");
//        doc.text (this.formatMoney(this.items[this.editedIndex].total), 180, 281)

        doc.output ('dataurlnewwindow');

    },
    aceptarVinculo(nota) {

      this.$store.commit('actNotificacion', nota.id, { root: true });
      /*
      return HTTP().patch('vinculoconfirmarrechazar/'+nota.id, { 
        estado: 'R', 
        activo: true,
        user_id_desde: nota.user_id_desde,
        user_id_hasta: nota.user_id_hasta,
      }).then(({ data }) => {
        debugger
        })
        .catch((e) => {});
      */
    },
    rechazarVinculo(nota) {
      let a = this.notificaciones[1].estado='R'
      return HTTP().patch('vinculoconfirmarrechazar/'+nota.id, { 
        estado: 'R', 
        activo: false,
        user_id_desde: nota.user_id_desde,
        user_id_hasta: nota.user_id_hasta,
      }).then(({ data }) => {
      })
        .catch((e) => {});
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
    }
  }
};
</script>
