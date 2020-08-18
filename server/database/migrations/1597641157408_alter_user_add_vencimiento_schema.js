'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUserAddVencimientoSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.date('vencimiento').after('activo')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('vencimiento')
    })
  }
}

module.exports = AlterUserAddVencimientoSchema
