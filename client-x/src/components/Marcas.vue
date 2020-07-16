<template>
  <Panel title="Marcas">
    <div class="mb-2" v-for="marca in marcas" :key="marca.id">
      <v-layout row wrap>
        <v-flex xs9 class="text-xs-left">
          <span
            v-if="!marca.lEditMode">
            {{ marca.nombre }}
          </span>
          <v-text-field
            autofocus
            v-if="marca.lEditMode"
            :value="marca.nombre"
            @keyup.enter="saveMarca(marca)"
            @input="setMarcaNombre({
              marca,
              nombre: $event,
            })">
          </v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-icon
            v-if="!marca.lEditMode"
            @click="setEditMode(marca)">
            edit
          </v-icon>
          <v-icon
            v-if="marca.lEditMode"
            @click="saveMarca(marca)">
            check
          </v-icon>
          <v-icon
            v-if="!marca.lEditMode"
            @click="deleteMarca(marca)">
            delete
          </v-icon>
        </v-flex>
      </v-layout>
    </div>
    <v-layout row-wrap class="mt-4">
      <v-flex xs8>
        <v-text-field
          placeholder="Marca..."
          @input="setNewMarcaNombre"
          :value="newMarcaNombre">
        </v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-btn @click="createMarca" color="green" dark class="mt-2">
          <v-icon dark class="mr-2">add_circle</v-icon>
          Crear
        </v-btn>
      </v-flex>
    </v-layout>
  </Panel>
</template>

<script>

  import { mapActions, mapState, mapMutations } from 'vuex';

  export default {
    mounted() {
      this.fetchMarcas();
    },
    computed: {
      ...mapState('marcas', [
        'newMarcaNombre',
        'marcas',
      ]),
    },
    methods: {
      ...mapMutations('marcas', [
        'setNewMarcaNombre',
        'setEditMode',
        'unsetEditMode',
        'setMarcaNombre',
      ]),
      ...mapActions('marcas', [
        'createMarca',
        'fetchMarcas',
        'saveMarca',
        'deleteMarca',
      ]),
    },
  };
</script>

<style>
.marca {
  font-size: 24px;
}

.icon {
  cursor: pointer;
}

.icon:hover {
  color: #333;
}
</style>
