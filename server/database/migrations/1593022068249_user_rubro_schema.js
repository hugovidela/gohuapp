'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserRubroSchema extends Schema {
  up () {
    this.create('users_rubros', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('rubro_id').unsigned().references('id').inTable('rubros')
      table.timestamps()
    })
  }

  down () {
    this.drop('users_rubros')
  }
}

module.exports = UserRubroSchema
