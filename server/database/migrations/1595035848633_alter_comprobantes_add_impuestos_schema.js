'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterComprobantesAddImpuestosSchema extends Schema {
  up () {
    this.table('comprobantes', (table) => {
      // alter table
      table.decimal('retib', 15,2).after('importedescuento');
      table.decimal('retgan', 15,2).after('importedescuento');
      table.decimal('retiva', 15,2).after('importedescuento');
    })
  }

  down () {
    this.table('comprobantes', (table) => {
      table.dropColumn('retib')
      table.dropColumn('retgan')
      table.dropColumn('retiva')
      // reverse alternations
    })
  }
}

module.exports = AlterComprobantesAddImpuestosSchema
