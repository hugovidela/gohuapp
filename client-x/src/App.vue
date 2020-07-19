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
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Sistema</span>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-select v-if="isLoggedIn"
          class="mt-3 caption"
          v-model="sucursalNombre"
          :items="sucItems"
          dense
          outlined
          @change="cambioSucursal">
        </v-select>
        <v-btn class="text-capitalize" text link to="/profile" v-if="isLoggedIn">
          <v-icon class="mr-2">account_box</v-icon>
          {{sucursal}} {{userId}} {{userName}}
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
  import { mapGetters, mapActions } from 'vuex';
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
      }),

    mounted () {
      /*
      debugger
      if (this.isLoggedIn) {
        return HTTP().get('/user/'+this.userId)
          .then(({ data }) => {
            this.sucItems = []
            this.sucObj = []
            debugger
            for (let i=0; i<=data[0].sucursales.length-1; i++) {
              this.sucObj.push(data[0].sucursales[i])
              this.sucItems.push(data[0].sucursales[i].nombre)
            }
            this.sucursalId = this.sucObj[0].id
            this.sucursalNombre = this.sucObj[0].nombre
            this.$store.commit('setSucursal', this.sucursalId);
          });
      }
      */
    },
    computed: {
      ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId', 'sucursal']),
      },
    methods: {
      ...mapActions('authentication', ['logout']),
      setTercero(cual) {
        this.$store.commit('setTerceros', cual);
      },

      changed: function(event) {
        this.$store.commit("change", cual);
        if (this.$store.getters.saySucursal) {
          this.alerta();
        }
      },

      cambioSucursal(cual) {
        debugger
        let idSuc = 0;
        for(let i=0; i<=this.sucObj.length-1; i++) {
          if (this.sucObj[i].nombre === cual) {
            idSuc = this.sucObj[i].id
            break
          }
        }
        this.$store.commit('setSucursal', idSuc);
        //debugger
        //this.$store.emit('testEvent', idSuc);
        //this.$refs.Ventas.listarHTTP();
        //this.$root.$emit('cambiarSucursal')
        // debugger
        // this.$refs.Ventas.listarHTTP()
//      debugger
//      this.$emit('envio', idSuc)
      }
    }
  };
</script>
