'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUserAddTipoSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('tipo').after('avatar')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('tipo')
    })
  }
}

module.exports = AlterUserAddTipoSchema
