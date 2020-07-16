'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComprobanteCancelacionSchema extends Schema {
  up () {
    this.create('comprobantes_cancelaciones', (table) => {
      table.increments()
      table.integer('cancelador_id').unsigned().references('id').inTable('comprobantes')
      table.integer('cancelado_id').unsigned().references('id').inTable('comprobantes_pendientes')
      table.decimal('importe',15,2)
      table.string('concepto',20)
      table.timestamps()
    })
  }

  down () {
    this.drop('comprobantes_cancelaciones')
  }
}

module.exports = ComprobanteCancelacionSchema
