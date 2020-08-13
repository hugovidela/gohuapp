'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUserstercerosAddActivoSchema extends Schema {
  up () {
    this.table('users_terceros', (table) => {
      table.boolean('activo').after('tercero_id').default(1)
    })
  }

  down () {
    this.table('users_terceros', (table) => {
      table.dropColumn('activo')
    })
  }
}

module.exports = AlterUserstercerosAddActivoSchema
