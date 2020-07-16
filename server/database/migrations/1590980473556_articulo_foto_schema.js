'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArticuloFotoSchema extends Schema {
  up () {
    this.create('articulos_fotos', (table) => {
      table.integer('articulo_id').unsigned().references('id').inTable('articulos')
      table.string('foto',255)
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('articulos_fotos')
  }
}

module.exports = ArticuloFotoSchema
