'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterComprobantesAddTipoSchema extends Schema {
  up () {
    this.table('comprobantes', (table) => {
      // alter table
      table.string('tipo', 2).notNullable().after('cpr');
    })
  }

  down () {
    this.table('comprobantes', (table) => {
      table.dropColumn('tipo')
      // reverse alternations
    })
  }
}

module.exports = AlterComprobantesAddTipoSchema
