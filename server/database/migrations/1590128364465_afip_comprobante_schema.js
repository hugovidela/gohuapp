'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AfipComprobanteSchema extends Schema {
  up () {
    this.create('afip_comprobantes', (table) => {
      table.string('codigo', 3).notNullable().unique()
      table.string('nombre',80).notNullable()
      table.string('abrev', 3).notNullable().unique()
      table.boolean('activo')
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('afip_comprobantes')
  }
}

module.exports = AfipComprobanteSchema
