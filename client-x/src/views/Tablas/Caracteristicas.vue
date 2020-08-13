<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Características</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="filter"
          append-icon="search"
          label="Búsqueda"
          single-line hide-details>
        </v-text-field>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div class="col-md-12 mx-auto">
        <table class="table table-hover">
          <thead>
            <tr><th class="text-left">Path: {{pathComputed}}</th></tr>
          </thead>
          <tbody>
            <tr>
              <tree
                v-model="treeModel"
                :data="treeData"
                :options="treeOptions"
                :filter="filter"
                dense
                ref="tree"
                @node:clicked="armoPath">
                <div slot-scope="{ node }" class="node-container">
                  <table class="table table-hover">
                    <template>
                      <v-btn
                        class="mr-2" fab dark x-small color="primary"
                        @click="editNode(node)">
                        <v-icon dark>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        class="mr-2" fab dark x-small color="cyan"
                        @click="addChildNode(node)">
                        <v-icon dark>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn
                        class="mr-2" fab dark x-small color="error"
                        @click="preguntoBorrar(node)">
                        <v-icon dark>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn
                        class="mr-2" fab dark x-small color="green"
                        @click="mostrarInfo(node)">
                        <v-icon dark>mdi-information-outline</v-icon>
                      </v-btn>
                      <v-btn
                        class="mr-2" fab
                        x-small
                        color="white"
                        @click="activarDesactivar(node)">
                      <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                      </v-btn>
                    </template>
                    <td>
<!--                  <div class="text-right">{{ node.id+' '+node.text }} </div> -->
                      <div class="text-right">
                        {{ node.text }}
                      </div>
                    </td>
                  </table>
                </div>
              </tree>
            </tr>
          </tbody>
        </table>
        <Confirmacion
          v-model='msg.msgAccion'
          :title=this.msg.msgTitle
          :body=this.msg.msgBody
          :visible=this.msg.msgVisible
          :buttons=this.msg.msgButtons
          @click="msgRespuesta">
        </Confirmacion>
      </div>

    </v-flex>
  </v-layout>
</template>

<script>
  /* eslint-disable */
  import HTTP from '../../http';
  import { mapGetters } from 'vuex';
  import router from '../../router';
  import moment from 'moment';
  import Confirmacion from "./../Forms/confirmacion.vue"
  const eventsList = [
    { name: 'tree:mounted', args: ['Tree Component'] },
    { name: 'tree:filtered', args: ['Matches', 'Filter String'] },
    { name: 'tree:data:fetch', args: ['Parent Node'] },
    { name: 'tree:data:received', args: ['Parent Node'] },
    { name: 'node:clicked', args: ['Node']},
    { name: 'node:disabled', args: ['Node']},
    { name: 'node:enabled', args: ['Node']},
    { name: 'node:shown', args: ['Node'] },
    { name: 'node:hidden', args: ['Node'] },
    { name: 'node:dblclick', args: ['Node'] },
    { name: 'node:selected', args: ['Node'] },
    { name: 'node:unselected', args: ['Node'] },
    { name: 'node:checked', args: ['Node'] },
    { name: 'node:unchecked', args: ['Node'] },
    { name: 'node:expanded', args: ['Node'] },
    { name: 'node:collapsed',  args: ['Node'] },
    { name: 'node:added',  args: ['Node', 'New Node'] },
    { name: 'node:removed',  args: ['Node'] },
    { name: 'node:text:changed', args: ['Node', 'New Text', 'Old Text']},
    { name: 'node:editing:start',  args: ['Node'] },
    { name: 'node:editing:stop',  args: ['Node', 'isTextChanged'] },
  ]
  let key = 0;
  //import axios from 'axios';

  export default {
  components: {
    Confirmacion,
  },
  data() {
    return {
        path: '/',
        pt: [],
        msg: {
          msgAccion: null,
          msgVisible: false,
          msgTitle: '',
          msgBody: '',
          msgButtons: []
        },
        nodeActual: null,
        isLoggedIn2: true,
        events: [],
        treeModel: null,
        treeData: this.loadCategories(),
        treeOptions: {
          checkbox: false,
          multiple: false,
          keyboardNavigation: true,
          deletion: true,
          disabled: true,
          dnd: true,
        },
        filter: null,
      }
    },
    mounted() {
      this.loadCategories();
      eventsList.forEach(e => {
        this.$refs.tree.$on(e.name, this.initEventViewer(e))
      });
    },
    computed: {
      // ...mapGetters('authentication', ['isLoggedIn']),
      //eventsList() {
      //  return this.events.concat().reverse();
      //},
      pathComputed() {
        return this.pt.join('>')
      }      
    },
    methods: {
      closeForm(){
        router.push('/')
      },
      armoPath(node) {
        this.pt = []
        this.path = ''
        this.armarPath(node.id)
        console.log('path:',this.pt)
        console.log(this.path)
        console.log(this.$data)
      },
      armarPath (val) {
        return HTTP().get(`/caracteristicas/exists/${val}`)
          .then(({ data }) => {
            if (data.caracteristica_id !== 0) {
              this.armarPath(data.caracteristica_id)
            }
            this.pt.unshift(data.nombre)
        });
      },
      msgRespuesta(op) {
        if (op==='Aceptar') {
          if (this.msg.msgAccion=='borrar item') {
            this.nodeActual.remove()
          } else if (this.msg.msgAccion=='exportar a PDF') {
            alert('exportando a PDF...')
          } else if (this.msg.msgAccion=='exportar a XLS')
            alert('exportando a XLS...')
        }
        this.msg.msgVisible = false;
      },
      clearSearch() {
        this.filter = null;
      },
      loadCategories() {
        return HTTP().get('/caracteristicas').then(response => {
          var g = [];
          let txt = ''
          for(var i in response.data) {
            g.push({
                id: response.data[i].id, 
                text: response.data[i].nombre, 
                activo: response.data[i].activo, 
                padre: response.data[i].caracteristica_id,
                state: { disabled: response.data[i].activo===1 ? false : true}
                })
          }
          function getNestedChildren2(arr, padre) {
            var out = []
            for(var i in arr) {
              if(arr[i].padre === padre) {
                var children = getNestedChildren2(arr, arr[i].id);
                if(children.length) {
                  arr[i].children = children;
                }
                out.push(arr[i]);
              }
            }
            return out;
          }
          return getNestedChildren2(g,0)
        },
        error => {
          console.log(error)
        },
      )
      },
      editNode(node, e) {
        node.startEditing();
      },
      activarDesactivar(node, e) {
        const valor = node.states.disabled ? 1 : 0;
        node.states.disabled = !node.states.disabled;
        HTTP().patch(`caracteristicas/${node.id}`,{activo: valor}).then ((res) => {
            console.log(res);
          }).catch((err)=>{
            console.log(err);
          })
      },
      mostrarInfo(node) {
        let data = HTTP().get(`/caracteristicas/exists/${node.id}`)
          .then(({ data }) => {
            this.msg.msgBody  = `Id: <b>${data.id}</b></br>`
            this.msg.msgBody += `Nombre: <b>${data.nombre}</b></br>`
            this.msg.msgBody += `Activo: <b>${data.activo ? 'Sí' : 'No'}</b></br>`
            this.msg.msgBody += `Creado: <b>${moment(String(data.created_at)).format('LLL')}</b></br>`
            this.msg.msgBody += `Modificado: <b>${moment(String(data.updated_at)).format('LLL')}</b></br>`
        });        
          this.msg.msgTitle = 'Información'
          this.msg.msgAccion = 'cerrar'
          this.msg.msgButtons = ['Cerrar']
          this.msg.msgVisible = true
      },
      preguntoBorrar (node) {
        // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
        if (node.children.length>0) {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = `No puede borrar <b>${node.text}</b>, este item posee datos encadenados. Pruebe con deshabilitar o eliminar primeros a todos los datos encadenados.`
          this.msg.msgAccion = 'error'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = 'Borrar'
          this.msg.msgBody = `¿Confirma borrar <b>${node.text}?</b></br>Si confirma el dato no podra ser recuperado.`
          this.msg.msgAccion = 'borrar item'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        }
        this.msg.msgVisible = true
        this.nodeActual = node;
      },
      addChildNode(node) {
        if (node.enabled()) {
          node.append('Nueva Caracterisrtica')
        }
      },
      initEventViewer(event) {
        const events = this.events
        return function (node, newNode) {
          let nodeText = '-'
          let targetNode = newNode && newNode.text ? newNode : node
          if (targetNode && targetNode.text) {
            nodeText = targetNode.text
          }
          events.push(
            Object.assign(
              {},
              event,
              { time: new Date, nodeText, id: key++, activo: true }
            )
          )
          if(event.name === "node:text:changed"){
            HTTP().patch(`caracteristicas/${arguments[0].id}`,{nombre: arguments[0].text}).then ((res) => {
            console.log(res);
          }).catch((err)=>{
            console.log(err);
          })}
          else if(event.name === "node:added"){
            const padre = arguments[0].id
            HTTP().post("/caracteristicas", {nombre: 'Nueva Caracteristica', caracteristica_id: padre, activo: 1}).then(() => {
              HTTP().get("caracteristicas/last").then((res) => {
                targetNode.id = res.data.id});
              }).catch((err) => {
                console.log(err);
            })}
          else if (event.name === 'node:removed') {
            HTTP().delete(`caracteristicas/${arguments[0].id}`).then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            })
          }
        }
      }
    },
  };
</script>

<style>
  html{
    color: rgba(33, 33, 33, 0.87);
  }
  body{
    font-family: "Roboto", 'Helvetica Neue, Helvetica, Arial';
    margin:0;
  }
</style>
