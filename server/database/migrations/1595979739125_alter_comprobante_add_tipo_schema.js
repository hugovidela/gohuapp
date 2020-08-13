'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterComprobanteAddTipoSchema extends Schema {
  up () {
    this.table('comprobantes', (table) => {
      table.string('carga').after('estado').default('M')
      // alter table
    })
  }

  down () {
    this.table('comprobantes', (table) => {
      table.dropColumn('carga')
      // reverse alternations
    })
  }
}

module.exports = AlterComprobanteAddTipoSchema
