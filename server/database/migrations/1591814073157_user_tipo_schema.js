'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserTipoSchema extends Schema {
  up () {
    this.create('users_tipos', (table) => {
      table.increments()
      table.string('nombre',15).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('users_tipos')
  }
}

module.exports = UserTipoSchema
