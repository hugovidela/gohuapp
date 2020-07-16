'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AfipOperacionSchema extends Schema {
  up () {
    this.create('afip_operaciones', (table) => {
      table.string('codigo', 1).notNullable().unique()
      table.string('compras').notNullable()
      table.string('ventas').notNullable()
      table.boolean('activo')
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('afip_operaciones')
  }
}

module.exports = AfipOperacionSchema
