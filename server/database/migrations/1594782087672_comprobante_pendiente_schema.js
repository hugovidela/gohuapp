'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComprobantePendienteSchema extends Schema {
  up () {
    this.create('comprobantes_pendientes', (table) => {
      table.increments()
      table.integer('comprobante_id').unsigned().references('id').inTable('comprobantes')
      table.date('vencimiento')
      table.decimal('importe',15,2)
      table.decimal('pendiente',15,2)
      table.string('concepto',20)
      table.timestamps()
    })
  }
  down () {
    this.drop('comprobantes_pendientes')
  }
}

module.exports = ComprobantePendienteSchema
