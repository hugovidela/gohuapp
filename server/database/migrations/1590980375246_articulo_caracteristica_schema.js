'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArticuloCaracteristicaSchema extends Schema {
  up () {
    this.create('articulos_caracteristicas', (table) => {
      table.integer('articulo_id').unsigned().references('id').inTable('articulos')
      table.integer('caracteristica_id').unsigned().references('id').inTable('caracteristicas')
      table.increments()
      table.timestamps()      
    })
  }

  down () {
    this.drop('articulos_caracteristicas')
  }
}

module.exports = ArticuloCaracteristicaSchema
