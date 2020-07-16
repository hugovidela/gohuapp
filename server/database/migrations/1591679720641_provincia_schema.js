'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProvinciaSchema extends Schema {
  up () {
    this.create('provincias', (table) => {
      table.increments()
      table.string('codigo', 3).notNullable().unique()
      table.string('nombre',40).notNullable()
      table.integer('pais_id').unsigned().references('id').inTable('paises')
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('provincias')
  }
}

module.exports = ProvinciaSchema
