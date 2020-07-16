<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Grupos</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-card :disabled="!lEnabledTree" flat>
          <v-container dense fluid>
            <v-text-field
              class="text-xs-center"
              v-model="filter"
              append-icon="search"
              label="Búsqueda"
              single-line hide-details>
            </v-text-field>
          </v-container>
        </v-card>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div class="col-md-12 mx-auto">
        <v-row
          class="pa-4"
          justify="space-between"
          style="height: 500px">
          <v-col>
            <v-card :disabled="!lEnabledTree" flat>
              <v-container dense fluid>
                <!--
                <v-treeview
                  :items="gru"
                  :dense="dense"
                  :selectable="false"
                  :selected-color="selectedColor"
                  :color="color"
                  :shaped="shaped"
                  :rounded="rounded"
                  :load-children="buscarRegistro"
                  :active.sync="active"
                  :open.sync="open"
                  activatable
                  open-on-click
                  transition
                ></v-treeview>
                -->
                <v-treeview
                  dense
                  :active.sync="active"
                  :items="gru"
                  :open.sync="open"
                  activatable
                  color="warning"
                  open-on-click
                  transition>
                  <template v-slot:label="{ item, open }">
                    <a @click="test(item)">{{ item.name }}</a>
                  </template>
                </v-treeview>
              </v-container>
            </v-card>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col>
            <v-card
              class="mx-auto"
              max-width="500"
              max-height="500">
              <v-system-bar color="indigo darken-2" dark>
                <v-spacer></v-spacer>
              </v-system-bar>
              <v-toolbar color="indigo" dark>
                <v-toolbar-title>Grupo</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn v-if="!lEditForm"
                  class="mr-2" fab dark x-small color="cyan"
                  @click="addChildNode">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
                <v-btn v-if="!lEditForm"
                  class="mr-2" fab dark x-small color="primary"
                  @click="editNode()">
                  <v-icon dark>mdi-pencil</v-icon>
                </v-btn>
                <v-btn v-if="!lEditForm"
                  class="mr-2" fab dark x-small color="error"
                  @click="removeNode(node)">
                  <v-icon dark>mdi-delete</v-icon>
                </v-btn>
              </v-toolbar>
              <v-container fluid>
                <v-row dense>
                  <v-col>
                    <v-card :disabled="!lEditForm" flat>
                      <v-container dense fluid>
                        <v-row>
                          <v-col cols="3" sm="3" md="3">
                            <v-text-field :disabled="true"
                              label="ID" v-model="id">
                            </v-text-field>
                          </v-col>
                          <v-col cols="9" sm="9" md="9">
                            <v-text-field
                              label="Padre"
                              v-model="nombrePadre"
                              v-if="!lEditForm">
                            </v-text-field>
                            <v-autocomplete
                              label="Grupo Padre"
                              v-model="grupo_id"
                              :items="grupos"
                              item-text="text" v-if="lEditForm"
                              item-value="id">
                            </v-autocomplete>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="9" sm="9" md="9">
                            <v-text-field
                              label="Nombre del grupo"
                              v-model="nombre">
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="6" sx="6" mx="4">
                            <v-switch
                              label="Activo"
                              v-model="activo">
                            </v-switch>
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn v-if="lEditForm"
                          class="mr-2" fab dark x-small color="primary"
                          @click="createNode()">
                          <v-icon dark>save_alt</v-icon>
                        </v-btn>
                        <v-btn v-if="lEditForm"
                          class="mr-2" fab dark x-small color="primary"
                          @click="cancelNode()">
                          <v-icon dark>undo</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  /* eslint-disable */
  import HTTP from '../http';
  import { mapGetters } from 'vuex';
  import router from '../router';
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
  import axios from 'axios';
  export default {
  data() {
    return {
      active: [],
      avatar: null,
      open: [],
      users: [],
      dense: true,
      activatable: true,
      hoverable: true,
      openOnClick: true,
      shaped: false,
      rounded: true,
      color: 'primary',
      selectedColor: 'accent',
      selectedColors: ['accent','teal','red','success','warning lighten-2',],
      search: null,
      filter: null,
      lEditForm: false,
      lEnabledTree: true,
      id: null,
      nombre: null,
      nombrePadre: null,
      grupo_id: null,
      activo: false,
      isLoggedIn2: true,
      events: [],
      grupos: [],
      treeModel: null,
//      treeData: this.loadCategories(),
      gru: [],
      treeOptions: {
        checkbox: false,
        multiple: false,
        keyboardNavigation: true,
        deletion: true,
        dnd: true,
        },
      }
    },
    mounted() {
      this.gru = []
      return HTTP().get('/grupos').then(response => {
        var g = [];
        for(var i in response.data) {
          g.push( {id: response.data[i].id, name: response.data[i].nombre, padre: response.data[i].grupo_id} )
        }
        this.grupos = g;
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
        this.gru = getNestedChildren2(g,0)
        return this.gru
      },
      error => {
        console.log(error)
      },
    )
    },
    computed: {
      items() {
        debugger;
        return [
          {
            name: 'Users',
            children: this.gru,
          },
        ];
      },
      selected() {
        debugger;
        if (!this.active.length) return undefined;
        const id = this.active[0];
        return this.gru.find(user => gru.id === id);
      },
    },
    methods: {
      test(item) {
        console.log('TEST', item)
        HTTP().get(`grupos/${item.id}`).then ((res) => {
          this.id = res.data.id;
          this.nombre = res.data.nombre;
          this.activo = res.data.activo;
          this.grupo_id = res.data.grupo_id;
          if (this.grupo_id) {
            HTTP().get(`grupos/${this.grupo_id}`).then ((res) => {
              this.nombrePadre = res.data.nombre
          })
          .catch((err) => {
            console.log(err);
          })
          }
        })
        .catch((err) => {
          console.log(err);
        });

      },

      async buscarRegistro (item) {
        // Remove in 6 months and say
        // you've made optimizations! :)
        await pause(1500)

        debugger;
        console.log(item)
        return HTTP().patch(`grupos/${arguments[0].id}`,{nombre: arguments[0].text}).then ((res) => {
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })

        /*
        return fetch('https://jsonplaceholder.typicode.com/users')
          .then(res => res.json())
          .then(json => (item.children.push(...json)))
          .catch(err => console.warn(err))
        */

      },
      loadCategories() {
        debugger;
        return HTTP().get('/grupos').then(response => {
          var g = [];
          for(var i in response.data) {
            g.push( {id: response.data[i].id, text: response.data[i].nombre, padre: response.data[i].grupo_id} )
          }
          debugger;
          this.grupos = g;
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
      onNodeClicked(node) {
        alert(node.text)
      },
      onNodeSelected(node) {
        HTTP().get(`grupos/${node.id}`).then ((res) => {
          this.id = res.data.id;
          this.nombre = res.data.nombre;
          this.activo = res.data.activo;
          this.grupo_id = res.data.grupo_id;
          if (this.grupo_id) {
            HTTP().get(`grupos/${this.grupo_id}`).then ((res) => {
              this.nombrePadre = res.data.nombre
          })
          .catch((err) => {
            console.log(err);
          })
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      editNode2(node, e) {
        node.startEditing();
      },
      createNode() {
        HTTP().post("/grupos", {nombre: this.nombre, grupo_id: this.grupo_id, activo: 1}).then(() => {
          this.lEnabledTree = true,
          this.lEditForm = false;
        })
      },
      editNode() {
        this.lEnabledTree = false,
        this.lEditForm = true;
      },
      cancelNode() {
        this.lEnabledTree = true,
        this.lEditForm = false;
      },
      removeNode(node) {
        if (confirm('Are you sure?')) {
          node.remove();
        }
      },
      addChildNode() {
        debugger;
        this.lEnabledTree = false,
        this.lEditForm = true;
        this.id = 0;
        this.nombre = '';
        this.activo = true;
        this.grupo_id = this.grupo_id;
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
              { time: new Date, nodeText, id: key++ }
            )
          )
          if(event.name === "node:text:changed"){
            HTTP().patch(`grupos/${arguments[0].id}`,{nombre: arguments[0].text}).then ((res) => {
            console.log(res);
          }).catch((err)=>{
            console.log(err);
          })} 
          else if(event.name === "node:added"){
            HTTP().post("/grupos", {nombre: 'Nuevo Grupo 2', grupo_id: arguments[0].id, activo: 1}).then(() => {
              HTTP().get("grupos/last").then((res) => {
                targetNode.id = res.data.id});
              }).catch((err) => {
                console.log(err);
            })}
          else if (event.name === 'node:removed') {
            HTTP().delete(`grupos/${arguments[0].id}`).then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            })}
          else if (event.name === 'tree:mounted') {
            }
          else if (event.name === 'node:selected') {
            }
        };
      },
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
/*455*/
