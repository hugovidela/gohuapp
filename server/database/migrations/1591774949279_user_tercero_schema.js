'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserTerceroSchema extends Schema {
  up () {
    this.create('users_terceros', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('tercero_id').unsigned().references('id').inTable('terceros')      
      table.timestamps()
    })
  }

  down () {
    this.drop('users_terceros')
  }
}

module.exports = UserTerceroSchema
