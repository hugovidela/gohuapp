'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserListaSchema extends Schema {
  up () {
    this.create('users_listas', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('nombre',40).notNullable()
      table.date('fechaultact')
      table.decimal('porrem',7,2)
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('users_listas')
  }
}

module.exports = UserListaSchema
