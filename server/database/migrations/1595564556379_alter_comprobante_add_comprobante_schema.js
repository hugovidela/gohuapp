'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterComprobanteAddComprobanteSchema extends Schema {
  up () {
    this.table('comprobantes', (table) => {
      table.integer('comprobante_id').unsigned().references('id').inTable('afip_comprobantes').after('tercero_id');
    })
  }

  down () {
    this.table('comprobantes', (table) => {
      table.dropColumn('comprobante_id')
    })
  }
}

module.exports = AlterComprobanteAddComprobanteSchema
