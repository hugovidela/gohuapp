'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostalSchema extends Schema {
  up () {
    this.create('postales', (table) => {
      table.increments()
      table.string('codigo', 3).notNullable().unique()
      table.string('nombre',40).notNullable()
      table.integer('provincia_id').unsigned().references('id').inTable('provincias')
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('postales')
  }
}

module.exports = PostalSchema
