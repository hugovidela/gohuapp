'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArticuloTagSchema extends Schema {
  up () {
    this.create('articulo_tags', (table) => {
      table.integer('articulo_id').unsigned().references('id').inTable('articulos')
      table.integer('tag_id').unsigned().references('id').inTable('tags')
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('articulo_tags')
  }
}

module.exports = ArticuloTagSchema
