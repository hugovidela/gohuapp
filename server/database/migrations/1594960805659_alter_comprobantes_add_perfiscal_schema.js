'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterComprobantesAddPerfiscalSchema extends Schema {
  up () {
    this.table('comprobantes', (table) => {
      // alter table
      table.string('perfiscal', 6).notNullable().after('fecha');
    })
  }

  down () {
    this.table('perfiscal', (table) => {
      table.dropColumn('perfiscal')
      // reverse alternations
    })
  }
}

module.exports = AlterComprobantesAddPerfiscalSchema
