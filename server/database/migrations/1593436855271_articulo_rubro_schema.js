'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArticuloRubroSchema extends Schema {
  up () {
    this.create('articulos_rubros', (table) => {
      table.increments()
      table.integer('articulo_id').unsigned().references('id').inTable('articulos')
      table.integer('rubro_id').unsigned().references('id').inTable('rubros')
      table.timestamps()
    })
  }

  down () {
    this.drop('articulos_rubros')
  }
}

module.exports = ArticuloRubroSchema
