'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AfipDocumentoSchema extends Schema {
  up () {
    this.create('afip_documentos', (table) => {
      table.string('codigo', 2).notNullable().unique()
      table.string('nombre',50).notNullable()
      table.boolean('activo')
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('afip_documentos')
  }
}

module.exports = AfipDocumentoSchema
