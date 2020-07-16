'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TerceroSchema extends Schema {
  up () {
    this.create('terceros', (table) => {
      table.increments()
      table.string('nombre',50).notNullable().unique()
      table.string('razon_social',80).notNullable().unique()
      table.integer('fiscal_id').unsigned().references('id').inTable('afip_responsables')
      table.integer('documento_id').unsigned().references('id').inTable('afip_documentos')
      table.string('cuit',15)
      table.text('observaciones')
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('terceros')
  }
}

module.exports = TerceroSchema
