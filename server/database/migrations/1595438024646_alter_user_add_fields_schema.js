'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUserAddFieldsSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').after('tercero_id');
      table.integer('level').unsigned().after('user_id');
      table.text('avatar').after('level');
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('user_id')
      table.dropColumn('level')
      table.dropColumn('avatar')
    })
  }
}

module.exports = AlterUserAddFieldsSchema
