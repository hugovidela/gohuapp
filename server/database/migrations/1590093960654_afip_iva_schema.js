'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AfipIvaSchema extends Schema {
  up () {
    this.create('afip_iva', (table) => {
      table.string('codigo', 4).notNullable().unique()
      table.string('nombre',20).notNullable().unique()
      table.decimal('tasa',5,2)
      table.boolean('activo')
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('afip_iva')
  }
}

module.exports = AfipIvaSchema
