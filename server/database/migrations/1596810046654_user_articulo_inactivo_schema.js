'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserArticuloInactivoSchema extends Schema {
  up () {
    this.create('users_articulos_inactivos', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('articulo_id').unsigned().references('id').inTable('articulos')
      table.timestamps()
    })
  }
  down () {
    this.drop('user_articulos_inactivos')
  }
}

module.exports = UserArticuloInactivoSchema
