'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUserAddActivoSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.boolean('activo').after('avatar')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('activo')
    })
  }
}

module.exports = AlterUserAddActivoSchema
