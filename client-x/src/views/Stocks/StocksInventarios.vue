<template>
  <v-layout align-start>
    <v-flex>
      <div>
        <v-card>
          <v-card-title>
            Nutrition
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            dense
            :options.sync= "pagination"
            :server-items-length="totalItems"
            :loading="loading"
            :footer-props="footerProps"
            class="elevation-1">
          </v-data-table>
        </v-card>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>

/* eslint-disable */
import HTTP from '../../http';
import { mapGetters } from 'vuex'

export default {

  data: () => ({
    modelo: 'marcas',
    search: '',
    items: [],
    loading: true,
    totalItems: 0,
    pagination: {
      page: 1,
    },
    footerProps: {'items-per-page-options': [9]},
    headers: [
      { text: 'id', value: 'id' },
      { text: 'nombre', value: 'nombre' },
      { text: 'activo', value: 'activo' },
    ]
  }),

  watch: {
    pagination: {
      handler () {
        this.listHTTP()
        .then(data => {
          this.items = data.items
          this.totalItems = data.total
        })
      },
      deep: true
    },
    search() {
      this.listHTTP()
      .then(data => {
        this.items = data.items
        this.totalItems = data.total
      })
    }    

  },
  mounted () {
  },
  computed: {
  },
  methods: {
    listHTTP () {
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
      })
    },
    getJsonData () {
      let s = this.search.length>0 ? this.search : 'all'
      return HTTP().get(`${this.modelo}/${this.pagination.page}/${this.pagination.itemsPerPage}/${s}`)
        .then(function(response){
          var result  = response.data;
          return result;
        }).catch(function (error) {
          console.log(error);
      })
    }    
  }
};
  
</script>