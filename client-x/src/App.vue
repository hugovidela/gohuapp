<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-if="isLoggedIn">
      <v-list dense>

        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
            <v-list-item-title>Ventas</v-list-item-title>
          </template>
          <v-list-item
            link :to="{name: 'usersclientes', key: 'C'}"
            @click="setTercero('C')">
            <v-list-item-title>
              <v-icon>mdi-account-multiple</v-icon>
              Clientes
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            link :to="{name: 'ventas'}">
            <v-list-item-title>
              <v-icon>mdi-sale</v-icon>
              Central de Ventas
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            link :to="{name: 'resumenesclientes'}">
            <v-list-item-title>
              <v-icon>mdi-sale</v-icon>
              Resumen de Cuentas
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
            <v-list-item-title>Compras</v-list-item-title>
          </template>
          <v-list-item
            link :to="{name: 'usersproveedores', key: 'P'}"
            @click="setTercero('P')">
            <!--<router-view :key="$route.path"></router-view>-->
            <v-list-item-title>
              <v-icon>mdi-account-multiple</v-icon>
              Proveedores
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'compras'}">
            <v-list-item-title>
              <v-icon>mdi-face</v-icon>
              Central de Compras
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            link :to="{name: 'resumenesproveedores'}">
            <v-list-item-title>
              <v-icon>mdi-sale</v-icon>
              Resumen de Cuentas
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
              <v-list-item-title>Tesoreria</v-list-item-title>
          </template>
          <v-list-item link :to="{name: 'tesoreriacaja'}">
              <v-list-item-title>
                <v-icon>shopping_cart</v-icon>
                Cerrar Caja
              </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'tesoreriainformes'}">
              <v-list-item-title>
                <v-icon>verified_user</v-icon>
                Informes
              </v-list-item-title>
          </v-list-item>
        </v-list-group>


        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
              <v-list-item-title>Almacén</v-list-item-title>
          </template>
          <v-list-item link :to="{name: 'articulos'}">
              <v-list-item-title>
                <v-icon>shopping_cart</v-icon>
                Articulos
              </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'marcas'}">
              <v-list-item-title>
                <v-icon>verified_user</v-icon>
                Marcas
              </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'caracteristicas'}">
              <v-list-item-title>
                <v-icon>search</v-icon>
                Caracteristicas
              </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'grupos'}">
              <v-list-item-title>
                <v-icon>verified_user</v-icon>
                Grupos
              </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'unidades'}">
              <v-list-item-title>
                <v-icon>verified_user</v-icon>
                Unidades de Medida
              </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'tags'}">
              <v-list-item-title>
                <v-icon>verified_user</v-icon>
                Tags
              </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'precios'}">
              <v-list-item-title>
                <v-icon>verified_user</v-icon>
                Precios
              </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
              <v-list-item-title>Stock</v-list-item-title>
          </template>
          <v-list-item link :to="{name: 'stocksinventarios'}">
              <v-list-item-title>
                <v-icon>shopping_cart</v-icon>
                Inventarios
              </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'stocksajustes'}">
              <v-list-item-title>
                <v-icon>verified_user</v-icon>
                Ajustes
              </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'stockstransferencias'}">
              <v-list-item-title>
                <v-icon>search</v-icon>
                Transferencias
              </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name: 'stocksinformes'}">
              <v-list-item-title>
                <v-icon>verified_user</v-icon>
                Informes
              </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
            <v-list-item-title>Tablas</v-list-item-title>
          </template>
          <v-list-item link :to="{name:'afipiva'}">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Ciudades
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'afipdocumentos'}">
            <v-list-item-title>
              <v-icon>mdi-clipboard-flow</v-icon>
              Calles
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
            <v-list-item-title>AFIP</v-list-item-title>
          </template>
          <v-list-item link :to="{name:'afipiva'}">
            <v-list-item-title>
              <v-icon>shopping_cart</v-icon>
              Códigos de IVA
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'afipoperaciones'}">
            <v-list-item-title>
              <v-icon>shopping_cart</v-icon>
              Operaciones
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'afipcomprobantes'}">
            <v-list-item-title>
              <v-icon>shopping_cart</v-icon>
              Comprobantes
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'afipmonedas'}">
            <v-list-item-title>
              <v-icon>shopping_cart</v-icon>
              Monedas
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'afipdocumentos'}">
            <v-list-item-title>
              <v-icon>shopping_cart</v-icon>
              Documentos
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'afipresponsables'}">
            <v-list-item-title>
              <v-icon>shopping_cart</v-icon>
              Tipo de Responsables
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group no-action prepend-icon="shopping_cart">
          <template v-slot:activator>
            <v-list-item-title>Configuracion</v-list-item-title>
          </template>
          <v-list-item link :to="{name:'contactostipos'}">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Contactos
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'mediosdepagos'}">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Medios de Pagos
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'paises'}">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Paises
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'provincias'}">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Provincias
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'postales'}">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Códigos Postales
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'bancos'}">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Bancos
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'tarjetas'}">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Tarjetas
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'rubros'}">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Rubros
            </v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{name:'importararticulos'}">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Importar Artículos
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      v-bind:style="{'background-color': colorSucursal ? colorSucursal:'blue darken-3'}"
      dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Gohu/{{empresa}}/{{operario}}</span>
      </v-toolbar-title>
      <v-icon v-show="mostrarNotificaciones" dense class="mr-2">mdi-bell-ring</v-icon>
      <v-spacer />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-select v-if="isLoggedIn"
          class="mt-3 caption"
          v-bind:style="{'background-color': colorSucursal ? colorSucursal:'blue darken-3'}"
          :value="$store.state.sucursal"
          dense
          outlined
          @change="cambioSucursal"
          :items="sucursales" item-value="id" item-text="nombre" return-object>
        </v-select>
        <v-btn class="text-capitalize" text link to="/profile" v-if="isLoggedIn">
          <v-icon class="mr-2">account_box</v-icon>
          c:{{ contador-1 }}
          s:{{ sucursal }}
          u:{{ userId }}
          n:{{ userName }}
          v:{{ level }}
        </v-btn>
        <v-btn class="text-capitalize" text to="/register" v-if="!isLoggedIn">
          <v-icon class="mr-2">account_box</v-icon>
          Registrarse
        </v-btn>
        <v-btn class="text-capitalize" text to="/login" v-if="!isLoggedIn">
          <v-icon class="mr-2">fingerprint</v-icon>
          Ingresar
        </v-btn>
        <v-btn class="text-capitalize" text v-if="isLoggedIn" @click="logout">
          <v-icon class="mr-2">exit_to_app</v-icon>
          Salir
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  /* eslint-disable */

  import HTTP from './http';
  import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
  import router from './router';

  export default {
    props: {
      source: String,
      },
    data: () => ({
      drawer: false,
      sucursalId: '',
      sucursalNombre: '',
      sucItems: [],
      contador: 0,
      mostrarNotificaciones: false,
      }),
    mounted() {
      this.cambioSucursal(this.sucursales[0])
    },
    created() {
      let vinItems = []
      vinItems.push(this.userId)
      const a = HTTP().get('/articulosvinculos')
        .then(({ data }) => {
          data.forEach(element => {
            vinItems.push(element.user_id_hasta)
          })
        this.$store.commit('setArticulosVinculados', vinItems, { root: true });
      })

      this.mostrarNotificaciones = false;
      var self=this;
      this.contador = 1;
      setInterval(function(){
        self.actualizarContador()
      },1000)
    },
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
        'operario',
        'level',
      ]),    
    },
    methods: {
      ...mapActions('authentication', ['logout']),
      ...mapMutations([
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
      actualizarContador() {
        this.contador --
        if (this.contador == 0) {
          this.contador = 60;
          let n = []
          //alert(this.userId)
          if (this.isLoggedIn) {
            /*
            SELECT users.id, users.username, users.tipo, rubros.id, rubros.nombre,
            (select id from vinculos where user_id_hasta=users.id) as id
            from users
            left join users_rubros on users_rubros.user_id = users.id
            left join rubros on rubros.id = users_rubros.rubro_id
            where users.tipo = 'MI' and users.id <> 2 and rubros.id = rubro_id
            */
            return HTTP().get('/notificaciones/'+this.userId)
              .then(({ data }) => {
                if (data.length>0) {
                  for (let i=0; i<=data.length-1; i++) {
                    let p = -1
                    for (let j=0; j<=n.length-1; j++) {
                      if (data[i].comprobante_id == n[j].comprobante_id && n[j].tipo!='V') {
                        p = j
                        break
                      }
                    }
                    if (p>=0) {
                      n[p].notas.push( { nota: data[i].detalles, tipo: data[i].tipo } )
                    } else {
                      n.push( { 
                        comprobante: data[i].comprobante,
                        comprobante_id: data[i].comprobante_id,
                        created_at: data[i].created_at,
                        detalles: data[i].detalles,
                        estado: data[i].estado,
                        id: data[i].id,
                        tipo: data[i].tipo,
                        updated_at: data[i].updated_at,
                        user_id_desde: data[i].user_id_desde,
                        user_id_hasta: data[i].user_id_hasta,
                        userdesde: data[i].userdesde,
                        notas: [ { nota: data[i].detalles, tipo: data[i].tipo } ],
                        paraprocesar: false
                      })
                    }
                  }
                  // reviso cuales notifiaciones estan listas para procesar asi Home.vue 
                  // puede prender los botones de ver e importar.
                  for (let i=0; i<=n.length-1; i++) {
                    for (let j=0; j<=n[i].notas.length-1; j++) {
                      if (n[i].notas[j].tipo == 'K' || n[i].notas[j].tipo == 'A' || n[i].notas[j].tipo == 'F' || n[i].notas[j].tipo == 'V' ) {
                        n[i].paraprocesar = true;
                      }
                    }
                  }
                  this.$store.commit('setNotificaciones', n, { root: true });
                  this.mostrarNotificaciones = true;
                } else {
                  this.mostrarNotificaciones = false;
                  this.$store.commit('setNotificaciones', [], { root: true });
                }
              })
          } else {
            this.$store.commit('setNotificaciones', [], { root: true });
          }
        }
      },

      setTercero(cual) {
        this.$store.commit('setTerceros', cual, { root: true });
      },

      /*
      changed: function(event) {
        this.$store.commit("change", cual);
        if (this.$store.getters.saySucursal) {
          this.alerta();
        }
      },
      */

      cambioSucursal(cual) {
        console.log(this.notificaciones)
        for (let i=0; i<=this.sucursales.length-1; i++) {
          if (this.sucursales[i].id == cual.id) {
//            this.$store.commit('setSucursalFiscal', this.sucursales[i].fiscal);
//            this.$store.commit('setColorSucursal', this.sucursales[i].color);
            this.$store.commit('setSucursalFiscal',this.sucursales[i].fiscal, { root: true })
            this.$store.commit('setColorSucursal',this.sucursales[i].color, { root: true })
            break
          }
        }

//      this.$store.commit('setSucursal', cual.id);
        this.$store.commit('setSucursal', cual.id, { root: true });
        let aaa = this.sucursal;
        let bbb = this.$store.getters.sucursal;
        let ccc = this.$store.state.sucursal;

        console.log(this.$store.getters.sucursal)

        //this.$store.emit('testEvent', idSuc);
        //this.$refs.Ventas.listarHTTP();
        //this.$root.$emit('cambiarSucursal')
        // this.$refs.Ventas.listarHTTP()
//      this.$emit('envio', idSuc)
      },

      /*
      toHex(str) {
        var result = '';
        for (var i=0; i<str.length; i++) {
          result += str.charCodeAt(i).toString(16);
        }
        return result;
      }
      */
  }

  };
</script>
