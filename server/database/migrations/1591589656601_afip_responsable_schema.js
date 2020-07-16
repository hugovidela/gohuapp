'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AfipResponsableSchema extends Schema {
  up () {
    this.create('afip_responsables', (table) => {
      table.increments()
      table.string('codigo', 3).notNullable().unique()
      table.string('abrev',3).notNullable()
      table.string('nombre',50).notNullable()
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('afip_responsables')
  }
}

module.exports = AfipResponsableSchema
