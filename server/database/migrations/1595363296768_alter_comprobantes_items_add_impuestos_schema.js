'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterComprobantesItemsAddImpuestosSchema extends Schema {
  up () {
    this.table('comprobantes_items', (table) => {
      table.decimal('stock', 15,4).notNullable().after('cantidad');
    })
  }

  down () {
    this.table('alter_comprobantes_items_add_impuestos', (table) => {
      table.dropColumn('stock')
    })
  }
}

module.exports = AlterComprobantesItemsAddImpuestosSchema
