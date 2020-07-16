'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AfipMonedaSchema extends Schema {
  up () {
    this.create('afip_monedas', (table) => {
      table.string('codigo', 3).notNullable().unique()
      table.string('nombre',40).notNullable()
      table.string('simbolo',5)
      table.boolean('activo')
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('afip_monedas')
  }
}

module.exports = AfipMonedaSchema
